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
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Solicitudes Pendientes</h1>
          <button
            onClick={() => navigate('/solicitudes-uie')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
          >
            ← Regresar
          </button>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded"
          />
          {puedeCrear && (
            <button onClick={() => setMostrarCrear(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
              + Crear Solicitud
            </button>
          )}
        </div>
      </div>

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
            {puedeAsignar && <th className="p-2 text-left">Asignar</th>}
          </tr>
        </thead>
        <tbody>
          {ordenadas.map((s) => (
            <tr key={s.id} className="border-t">
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
              <td className="p-2">{s.descripcion}</td>
              <td className="p-2">{s.area}</td>
              {puedeAsignar && (
                <td className="p-2">
                  <button
                    onClick={() => setModalId(s.id)}
                    className="px-3 py-1 bg-purple-800 text-white rounded text-xs"
                  >
                    {rol === 'Soporte Técnico' ? 'Autoasignar' : 'Asignar'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {ordenadas.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

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
