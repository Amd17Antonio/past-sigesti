import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendientes } from '../services/solicitudService';
import { useAuth } from '../context/AuthContext';
import AsignarModal from '../components/tickets/AsignarModal';
import CrearSolicitudModal from '../components/solicitudes/CrearSolicitudModal';
import SortIcon from '../components/common/SortIcon';
import DetalleSolicitudModal from '../components/solicitudes/DetalleSolicitudModal';

interface Solicitud {
  id: number;
  solicitante: string;
  extension: number | null;
  area: string;
  descripcion: string;
  usr_crea: string;
}

const COLUMNAS: { key: keyof Solicitud; label: string }[] = [
  { key: 'id', label: 'Folio Detalle' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'extension', label: 'Extensión' },
  { key: 'descripcion', label: 'Asunto' },
  { key: 'area', label: 'Área' },
];

export default function Pendientes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalId, setModalId] = useState<number | null>(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<keyof Solicitud | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { user } = useAuth();
  const rol = user?.rol?.nombre;
  const navigate = useNavigate();

  const puedeAsignar = rol !== 'Usuario Solicitante';
  const puedeCrear = rol === 'Administrador';
  const puedeRegresar = rol === 'Administrador' || rol === 'Capturista';

  const cargar = () => {
    getPendientes().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSort = (key: keyof Solicitud) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtradas = solicitudes.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(busqueda.toLowerCase())
  );

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

  return (
    <div className="p-6">
      {/* Cabecera, botones de navegación, buscador y creación */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">Solicitudes Pendientes</h1>
          {puedeRegresar && (
            <button
              onClick={() => navigate('/solicitudes-uie')}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1"
            >
              ← Regresar
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            placeholder="Buscar de forma general..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-blue-200 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-72"
          />
          {puedeCrear && (
            <button
              onClick={() => setMostrarCrear(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              + Crear Solicitud
            </button>
          )}
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="overflow-x-auto border border-blue-100 rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50/70 text-blue-900 uppercase text-xs">
            <tr>
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-3 cursor-pointer select-none hover:bg-blue-100/50 transition-colors" onClick={() => handleSort(c.key)}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <SortIcon active={sortKey === c.key} direction={sortDir} />
                  </span>
                </th>
              ))}
              {puedeAsignar && <th className="p-3 text-left">Asignar</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {ordenadas.map((s) => (
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
                <td className="p-3 text-gray-700 max-w-xs">{s.descripcion}</td>
                <td className="p-3 text-gray-700">{s.area}</td>
                {puedeAsignar && (
                  <td className="p-3">
                    <button
                      onClick={() => setModalId(s.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-sm"
                    >
                      {rol === 'Soporte Técnico' ? 'Autoasignar' : 'Asignar'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordenadas.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
          Sin resultados encontrados.
        </div>
      )}

      {modalId !== null && (
        <AsignarModal solicitudId={modalId} onClose={() => setModalId(null)} onAsignado={cargar} />
      )}

      {mostrarCrear && (
        <CrearSolicitudModal onClose={() => setMostrarCrear(false)} onCreado={cargar} />
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