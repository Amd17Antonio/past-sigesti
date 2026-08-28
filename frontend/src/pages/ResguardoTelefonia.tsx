import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSolicitudesTelefonia,
  imprimirResguardoTelefonia,
  exportarResguardoTelefoniaExcel,
} from '../services/solicitudTelefoniaService';
import type { SolicitudTelefoniaRow } from '../types/SolicitudTelefonia';
import EditarResguardoTelefoniaModal from '../components/telefonia/EditarResguardoTelefoniaModal';
import SortIcon from '../components/common/SortIcon';

const COLUMNAS: { key: keyof SolicitudTelefoniaRow; label: string }[] = [
  { key: 'extension_asignada', label: 'Extensión' },
  { key: 'nombre', label: 'Nombre' },
];

// Convierte 'YYYY-MM-DD' a 'DD/MM/YYYY' para mostrar en el resumen.
const formatFecha = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export default function ResguardoTelefonia() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<SolicitudTelefoniaRow[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<keyof SolicitudTelefoniaRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<SolicitudTelefoniaRow | null>(null);

  // Filtro de fechas (Del / Al): ahora afecta tanto la tabla como el Excel.
  const [fechaDel, setFechaDel] = useState('');
  const [fechaAl, setFechaAl] = useState('');
  const [exportando, setExportando] = useState(false);
  const [errorExport, setErrorExport] = useState<string | null>(null);

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

  const handleFechaDelChange = (value: string) => {
    setFechaDel(value);
    setPagina(1);
  };

  const handleFechaAlChange = (value: string) => {
    setFechaAl(value);
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

  // Si no hay fechas seleccionadas, se comporta como antes (muestra todo).
  // Si hay una o ambas fechas, filtra por fecha_activo dentro del rango.
  const activasPorFecha = useMemo(() => {
    if (!fechaDel && !fechaAl) return activas;

    return activas.filter((s) => {
      const fechaActivo = (s as any).fecha_activo as string | null | undefined;
      if (!fechaActivo) return false;
      const fecha = fechaActivo.slice(0, 10);
      if (fechaDel && fecha < fechaDel) return false;
      if (fechaAl && fecha > fechaAl) return false;
      return true;
    });
  }, [activas, fechaDel, fechaAl]);

  const filtradas = useMemo(() => {
    return activasPorFecha.filter((s) =>
      COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      })
    );
  }, [activasPorFecha, filtros]);

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

  // Texto resumen del rango de fechas seleccionado.
  const resumenFechas = useMemo(() => {
    const cantidad = activasPorFecha.length;
    const plural = cantidad === 1 ? 'resguardo' : 'resguardos';

    if (fechaDel && fechaAl) {
      return `Del ${formatFecha(fechaDel)} al ${formatFecha(fechaAl)} se registraron ${cantidad} ${plural}.`;
    }
    if (fechaDel && !fechaAl) {
      return `Desde el ${formatFecha(fechaDel)} se registraron ${cantidad} ${plural}.`;
    }
    if (!fechaDel && fechaAl) {
      return `Hasta el ${formatFecha(fechaAl)} se registraron ${cantidad} ${plural}.`;
    }
    return null;
  }, [fechaDel, fechaAl, activasPorFecha]);

  const handleGenerarPdf = async (id: number) => {
    try {
      await imprimirResguardoTelefonia(id);
    } catch {
      alert('No se pudo generar el PDF de resguardo.');
    }
  };

  const handleExportarExcel = async () => {
    setErrorExport(null);
    setExportando(true);
    try {
      await exportarResguardoTelefoniaExcel({
        del: fechaDel || undefined,
        al: fechaAl || undefined,
      });
    } catch {
      setErrorExport('No se pudo generar el Excel de resguardos.');
    } finally {
      setExportando(false);
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

        {/* Filtro de fechas + exportar a Excel (solo telefonía) */}
        <div className="flex flex-wrap items-end gap-4 mb-2 p-3 bg-gray-50 border rounded">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Del:</label>
            <input
              type="date"
              value={fechaDel}
              onChange={(e) => handleFechaDelChange(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Al:</label>
            <input
              type="date"
              value={fechaAl}
              onChange={(e) => handleFechaAlChange(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <button
            onClick={handleExportarExcel}
            disabled={exportando}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {exportando ? 'Generando...' : 'Exportar a Excel'}
          </button>
          {(fechaDel || fechaAl) && (
            <button
              onClick={() => { setFechaDel(''); setFechaAl(''); setPagina(1); }}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Quitar filtro de fechas
            </button>
          )}
          {errorExport && <span className="text-red-600 text-sm">{errorExport}</span>}
        </div>

        {resumenFechas && (
          <p className="text-sm text-gray-700 mb-4 px-1">{resumenFechas}</p>
        )}

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

      {editando && (editando.extension_asignada || editando.extension) && (
        <EditarResguardoTelefoniaModal
          extension={editando.extension_asignada || editando.extension || ''}
          onClose={() => setEditando(null)}
          onActualizado={cargar}
        />
      )}
      {editando && !editando.extension_asignada && !editando.extension && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center">
            <p className="text-gray-700 text-sm mb-4">
              Este registro no tiene ninguna extensión asociada, no se puede consultar su ficha.
            </p>
            <button
              onClick={() => setEditando(null)}
              className="px-4 py-2 rounded bg-purple-800 hover:bg-purple-900 text-white text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
