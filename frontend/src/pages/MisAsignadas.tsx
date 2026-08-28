import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisAsignadas } from '../services/solicitudService';
import SeguimientoModal from '../components/tickets/SeguimientoModal';
import CerrarModal from '../components/tickets/CerrarModal';
import SortIcon from '../components/common/SortIcon';
import DetalleSolicitudModal from '../components/solicitudes/DetalleSolicitudModal';

interface Solicitud {
  id: number;
  solicitante: string;
  extension: number | null;
  area: string;
  descripcion: string;
  prioridad: string;
  fecha_solicitud: string;
  fecha_asignacion: string | null;
}

type SortKey = keyof Solicitud;

const COLUMNAS: { key: SortKey; label: string }[] = [
  { key: 'id', label: 'Folio Detalle' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'extension', label: 'Extensión' },
  { key: 'area', label: 'Área' },
  { key: 'descripcion', label: 'Desc. Problema' },
  { key: 'prioridad', label: 'Prioridad' },
  { key: 'fecha_solicitud', label: 'Fecha Hora Solicitud' },
  { key: 'fecha_asignacion', label: 'Fecha Hora Asignación' },
];

export default function MisAsignadas() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seguimientoId, setSeguimientoId] = useState<number | null>(null);
  const [cerrarId, setCerrarId] = useState<number | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const cargar = () => {
    getMisAsignadas().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const filtradas = useMemo(() => {
    const resultado = solicitudes.filter((s) =>
      JSON.stringify(s).toLowerCase().includes(busqueda.toLowerCase())
    );

    if (sortBy) {
      resultado.sort((a, b) => {
        const valA = a[sortBy] ?? '';
        const valB = b[sortBy] ?? '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDir === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDir === 'asc' ? -1 : 1;
        if (strA > strB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [solicitudes, busqueda, sortBy, sortDir]);

  return (
    <div className="p-6">
      {/* Cabecera y buscador */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">Mis Solicitudes Asignadas</h1>
          <button
            onClick={() => navigate('/solicitudes-uie')}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1"
          >
            ← Regresar
          </button>
        </div>
        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-blue-200 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-72 shadow-sm"
        />
      </div>

      {/* Contenedor de la Tabla */}
      <div className="overflow-x-auto border border-blue-100 rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50/70 text-blue-900 uppercase text-xs">
            <tr>
              {COLUMNAS.map((c) => (
                <th
                  key={c.key}
                  className="p-3 cursor-pointer select-none hover:bg-blue-100/50 transition-colors"
                  onClick={() => handleSort(c.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <SortIcon active={sortBy === c.key} direction={sortDir} />
                  </span>
                </th>
              ))}
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {filtradas.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50/40 transition-colors align-top">
                <td className="p-3 font-medium text-gray-800">
                  <span className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => setDetalleId(s.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 p-1 rounded text-xs transition-colors shadow-sm"
                      title="Ver detalle"
                    >
                      👁
                    </button>
                    {s.id}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{s.solicitante}</td>
                <td className="p-3 text-gray-700">{s.extension ?? '-'}</td>
                <td className="p-3 text-gray-700">{s.area}</td>
                <td className="p-3 text-gray-700 max-w-xs">{s.descripcion}</td>
                <td className="p-3 text-gray-700">{s.prioridad}</td>
                <td className="p-3 text-gray-700">{s.fecha_solicitud}</td>
                <td className="p-3 text-gray-700">{s.fecha_asignacion ?? '-'}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => setSeguimientoId(s.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-sm"
                    >
                      Seguimiento
                    </button>
                    <button
                      onClick={() => setCerrarId(s.id)}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors shadow-sm"
                    >
                      Cerrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtradas.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
          Sin resultados encontrados.
        </div>
      )}

      {seguimientoId !== null && (
        <SeguimientoModal
          solicitudId={seguimientoId}
          onClose={() => setSeguimientoId(null)}
          onGuardado={cargar}
        />
      )}

      {cerrarId !== null && (
        <CerrarModal
          solicitudId={cerrarId}
          onClose={() => setCerrarId(null)}
          onCerrado={cargar}
        />
      )}

      {detalleId !== null && (
        <DetalleSolicitudModal
          idSolicitud={detalleId}
          onClose={() => setDetalleId(null)}
        />
      )}
    </div>
  );
}