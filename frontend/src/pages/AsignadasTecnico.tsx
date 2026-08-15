import { useEffect, useState } from 'react';
import { getAsignadas } from '../services/solicitudService';
import SeguimientoModal from '../components/tickets/SeguimientoModal';
import CerrarModal from '../components/tickets/CerrarModal';
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

export default function AsignadasTecnico() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seguimientoId, setSeguimientoId] = useState<number | null>(null);
  const [cerrarId, setCerrarId] = useState<number | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);

  const cargar = () => {
    getAsignadas().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtradas = solicitudes.filter((s) =>
    JSON.stringify(s).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold">Solicitudes Asignadas</h1>
        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Folio Detalle</th>
            <th className="p-2 text-left">Solicitante</th>
            <th className="p-2 text-left">Extensión</th>
            <th className="p-2 text-left">Área</th>
            <th className="p-2 text-left">Desc. Problema</th>
            <th className="p-2 text-left">Prioridad</th>
            <th className="p-2 text-left">Fecha Hora Solicitud</th>
            <th className="p-2 text-left">Fecha Hora Asignación</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((s) => (
            <tr key={s.id} className="border-t align-top">
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
                    className="px-2 py-1 bg-blue-700 text-white rounded text-xs"
                  >
                    Seguimiento
                  </button>
                  <button
                    onClick={() => setCerrarId(s.id)}
                    className="px-2 py-1 bg-purple-800 text-white rounded text-xs"
                  >
                    Cerrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtradas.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

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
