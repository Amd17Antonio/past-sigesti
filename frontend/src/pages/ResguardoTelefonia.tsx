import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSolicitudesTelefonia,
  imprimirResguardoTelefonia,
  actualizarAsignacionTelefonia,
} from '../services/solicitudTelefoniaService';
import type { SolicitudTelefoniaRow } from '../types/SolicitudTelefonia';
import EditarAsignacionModal from '../components/common/EditarAsignacionModal';
import SortIcon from '../components/common/SortIcon';

const COLUMNAS: { key: keyof SolicitudTelefoniaRow; label: string }[] = [
  { key: 'extension_asignada', label: 'Extensión' },
  { key: 'nombre', label: 'Nombre' },
];

export default function ResguardoTelefonia() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<SolicitudTelefoniaRow[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<keyof SolicitudTelefoniaRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<SolicitudTelefoniaRow | null>(null);

  const cargar = () => {
    getSolicitudesTelefonia().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const activas = useMemo(
    () => solicitudes.filter((s) => s.estatus === 'activo'),
    [solicitudes]
  );

  const handleFiltroColumna = (key: string, value: string) => {
    setFiltros({ ...filtros, [key]: value });
    setPagina(1);
  };

  const handleSort = (key: keyof SolicitudTelefoniaRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtradas = useMemo(() => {
    return activas.filter((s) =>
      COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      })
    );
  }, [activas, filtros]);

  const ordenadas = useMemo(() => {
    if (!sortKey) return filtradas;
    return [...filtradas].sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtradas, sortKey, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  const paginadas = ordenadas.slice(inicio, inicio + porPagina);

  const handleGenerarPdf = async (id: number) => {
    try {
      await imprimirResguardoTelefonia(id);
    } catch {
      alert('No se pudo generar el PDF de resguardo.');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t font-semibold">
        RESGUARDO DE TELEFONÍA — SERVICIOS ACTIVOS
      </div>

      <div className="border border-t-0 rounded-b p-4">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => navigate('/solicitud-telefono')}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            ← Solicitud Teléfono
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span>Mostrar</span>
            <select
              value={porPagina}
              onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
              className="border rounded p-1"
            >
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                {COLUMNAS.map((c) => (
                  <th key={c.key} className="p-2 text-left cursor-pointer" onClick={() => handleSort(c.key)}>
                    <span className="inline-flex items-center">
                      {c.label}
                      <SortIcon active={sortKey === c.key} direction={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="p-2 text-left w-16">Editar</th>
                <th className="p-2 text-left">PDF</th>
              </tr>
              <tr className="bg-gray-50">
                {COLUMNAS.map((c) => (
                  <th key={c.key} className="p-1">
                    <input
                      value={filtros[c.key] ?? ''}
                      onChange={(e) => handleFiltroColumna(c.key, e.target.value)}
                      className="border p-1 w-full text-xs font-normal"
                    />
                  </th>
                ))}
                <th className="p-1"></th>
                <th className="p-1"></th>
              </tr>
            </thead>
            <tbody>
              {paginadas.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2 font-medium">{s.extension_asignada ?? '-'}</td>
                  <td className="p-2 uppercase">{s.nombre}</td>
                  <td className="p-2 w-16">
                    <button
                      onClick={() => setEditando(s)}
                      title="Editar información del usuario"
                      className="p-1.5 rounded hover:bg-amber-100 hover:ring-1 hover:ring-amber-300 transition-colors"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleGenerarPdf(s.id)}
                      className="text-blue-700 hover:underline text-xs font-medium"
                    >
                      GENERAR PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginadas.length === 0 && <p className="text-gray-500 mt-4">Sin servicios activos.</p>}

        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Mostrando registros del {ordenadas.length === 0 ? 0 : inicio + 1} al {Math.min(inicio + porPagina, ordenadas.length)} de un total de {ordenadas.length} registros
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaSegura === 1}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-3 py-1 bg-purple-800 text-white rounded">{paginaSegura}</span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura === totalPaginas}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {editando && (
        <EditarAsignacionModal
          folio={editando.id}
          titulo="Editar extensión / DID / clave"
          campos={[
            { name: 'extension_asignada', label: 'Extensión asignada', requerido: true },
            { name: 'did_asignado', label: 'DID asignado' },
            {
              name: 'tipo_clave',
              label: 'Tipo de clave',
              tipo: 'select',
              opciones: [
                { value: 'PIN', label: 'PIN' },
                { value: 'CN', label: 'CN' },
              ],
            },
            { name: 'clave_asignada', label: 'Clave (PIN o CN)' },
          ]}
          valoresIniciales={{
            extension_asignada: editando.extension_asignada,
            did_asignado: editando.did_asignado,
            tipo_clave: editando.tipo_clave,
            clave_asignada: editando.clave_asignada,
          }}
          onGuardar={(payload) => actualizarAsignacionTelefonia(editando.id, payload as any)}
          onClose={() => setEditando(null)}
          onActualizado={cargar}
        />
      )}
    </div>
  );
}