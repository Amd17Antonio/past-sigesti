import { useEffect, useMemo, useState } from 'react';
import { getSolicitudesTelefonia, eliminarSolicitudTelefonia } from '../services/solicitudTelefoniaService';
import SolicitudTelefoniaWizard from '../components/telefonia/SolicitudTelefoniaWizard';
import SortIcon from '../components/common/SortIcon';
import EditarSolicitudTelefoniaModal from '../components/telefonia/EditarSolicitudTelefoniaModal';
import {
  ESTATUS_TELEFONIA_LABEL,
  TRAMITES_TELEFONIA,
  type SolicitudTelefoniaRow,
} from '../types/SolicitudTelefonia';

const COLUMNAS: { key: keyof SolicitudTelefoniaRow; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'tramite', label: 'Trámite' },
  { key: 'nombre', label: 'Usuario' },
  { key: 'extension', label: 'Extensión' },
  { key: 'puesto', label: 'Puesto' },
  { key: 'correo_institucional', label: 'Correo' },
];

export default function SolicitudTelefono() {
  const [solicitudes, setSolicitudes] = useState<SolicitudTelefoniaRow[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [filtroTramite, setFiltroTramite] = useState('todos');
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<SolicitudTelefoniaRow | null>(null);
  const [sortKey, setSortKey] = useState<keyof SolicitudTelefoniaRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const cargar = () => {
    getSolicitudesTelefonia().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (id: number) => {
    if (!window.confirm(`¿Dar de baja la solicitud #${id}?`)) return;
    await eliminarSolicitudTelefonia(id);
    cargar();
  };

  const handleImprimir = (s: SolicitudTelefoniaRow) => {
    const ventana = window.open('', '_blank', 'width=600,height=700');
    if (!ventana) return;

    ventana.document.write(`
      <html>
        <head>
          <title>Solicitud de Telefonía #${s.id}</title>
        </head>
        <body style="font-family:sans-serif;padding:20px;">
          <h2>Solicitud de Telefonía #${s.id}</h2>
          <p><strong>Trámite:</strong> ${s.tramite.replace(/_/g, ' ')}</p>
          <p><strong>Usuario:</strong> ${s.nombre}</p>
          <p><strong>Extensión:</strong> ${s.extension ?? '-'}</p>
          <p><strong>Puesto:</strong> ${s.puesto ?? '-'}</p>
          <p><strong>Correo:</strong> ${s.correo_institucional ?? '-'}</p>
          <p><strong>Estatus:</strong> ${ESTATUS_TELEFONIA_LABEL[s.estatus] ?? s.estatus}</p>
        </body>
      </html>
    `);

    ventana.document.close();
    ventana.focus();
    ventana.print();
  };

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
    return solicitudes.filter((s) => {
      const pasaColumnas = COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      });
      const pasaEstatus = filtroEstatus === 'todos' || s.estatus === filtroEstatus;
      const pasaTramite = filtroTramite === 'todos' || s.tramite === filtroTramite;
      return pasaColumnas && pasaEstatus && pasaTramite;
    });
  }, [solicitudes, filtros, filtroEstatus, filtroTramite]);

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

  return (
    <div className="p-6">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t font-semibold">
        SOLICITUDES DE TELEFONÍA
      </div>

      <div className="border border-t-0 rounded-b p-4">
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => setMostrarModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            + Nueva Solicitud
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
                <th className="p-2 text-left">Estatus</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
              <tr className="bg-gray-50">
                {COLUMNAS.map((c) => (
                  <th key={c.key} className="p-1">
                    {c.key === 'tramite' ? (
                      <select
                        value={filtroTramite}
                        onChange={(e) => { setFiltroTramite(e.target.value); setPagina(1); }}
                        className="border p-1 w-full text-xs font-normal"
                      >
                        <option value="todos">Todos</option>
                        {TRAMITES_TELEFONIA.map((t) => (
                          <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={filtros[c.key] ?? ''}
                        onChange={(e) => handleFiltroColumna(c.key, e.target.value)}
                        className="border p-1 w-full text-xs font-normal"
                      />
                    )}
                  </th>
                ))}
                <th className="p-1">
                  <select
                    value={filtroEstatus}
                    onChange={(e) => { setFiltroEstatus(e.target.value); setPagina(1); }}
                    className="border p-1 w-full text-xs font-normal"
                  >
                    <option value="todos">Todos</option>
                    {Object.entries(ESTATUS_TELEFONIA_LABEL).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </th>
                <th className="p-1"></th>
              </tr>
            </thead>
            <tbody>
              {paginadas.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{s.tramite.replace(/_/g, ' ')}</td>
                  <td className="p-2">{s.nombre}</td>
                  <td className="p-2">{s.extension ?? '-'}</td>
                  <td className="p-2">{s.puesto ?? '-'}</td>
                  <td className="p-2">{s.correo_institucional ?? '-'}</td>
                  <td className="p-2">{ESTATUS_TELEFONIA_LABEL[s.estatus] ?? s.estatus}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleImprimir(s)} title="Imprimir">🖨</button>
                    <button onClick={() => setEditando(s)} title="Editar">✏️</button>
                    <button onClick={() => handleEliminar(s.id)} title="Dar de baja">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginadas.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

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

      {mostrarModal && (
        <SolicitudTelefoniaWizard onClose={() => setMostrarModal(false)} onCreado={cargar} />
      )}

      {editando && (
        <EditarSolicitudTelefoniaModal
          solicitud={editando}
          onClose={() => setEditando(null)}
          onActualizado={cargar}
        />
      )}
    </div>
  );
}
