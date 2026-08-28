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
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-blue-950">Mis Asignadas</h1>
          <button
            onClick={() => navigate('/solicitudes-uie')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
          >
            ← Regresar
          </button>
        </div>
        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-blue-200 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            {COLUMNAS.map((c) => (
              <th
                key={c.key}
                className="p-2 text-left cursor-pointer select-none border-b border-gray-200"
                onClick={() => handleSort(c.key)}
              >
                <span className="inline-flex items-center">
                  {c.label}
                  <SortIcon active={sortBy === c.key} direction={sortDir} />
                </span>
              </th>
            ))}
            <th className="p-2 text-left border-b border-gray-200">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((s) => (
            <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50 align-top">
              <td className="p-2">
                <button
                  onClick={() => setDetalleId(s.id)}
                  className="mr-1 hover:opacity-70"
                  title="Ver detalle"
                >
                  👁
                </button>
                {s.id}
              </td>
              <td className="p-2">{s.solicitante}</td>
              <td className="p-2">{s.extension ?? '-'}</td>
              <td className="p-2">{s.area}</td>
              <td className="p-2">{s.descripcion}</td>
              <td className="p-2">{s.prioridad}</td>
              <td className="p-2">{s.fecha_solicitud}</td>
              <td className="p-2">{s.fecha_asignacion ?? '-'}</td>
              <td className="p-2">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setSeguimientoId(s.id)}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition"
                  >
                    Seguimiento
                  </button>
                  <button
                    onClick={() => setCerrarId(s.id)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition"
                  >
                    Cerrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtradas.length === 0 && <p className="text-gray-500 mt-4 text-sm">Sin resultados</p>}

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