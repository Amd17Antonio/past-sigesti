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
        <h1 className="text-xl font-bold text-gray-800">Solicitudes Asignadas</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Buscar:</span>
          <input
            placeholder="Buscar en registros..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border border-blue-200 p-1.5 rounded-md text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-blue-100 rounded-lg shadow-sm bg-white">
        <table className="w-full border-collapse text-sm text-left">
          <thead className="bg-blue-900 text-white uppercase text-xs">
            <tr>
              <th className="p-3 font-semibold">Folio Detalle</th>
              <th className="p-3 font-semibold">Solicitante</th>
              <th className="p-3 font-semibold">Extensión</th>
              <th className="p-3 font-semibold">Área</th>
              <th className="p-3 font-semibold">Desc. Problema</th>
              <th className="p-3 font-semibold">Prioridad</th>
              <th className="p-3 font-semibold">Fecha Solicitud</th>
              <th className="p-3 font-semibold">Fecha Asignación</th>
              <th className="p-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtradas.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50/30 transition-colors align-top">
                <td className="p-3 font-medium">
                  <button
                    onClick={() => setDetalleId(s.id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 font-semibold"
                    title="Ver detalle"
                  >
                    👁 {s.id}
                  </button>
                </td>
                <td className="p-3 text-gray-800">{s.solicitante}</td>
                <td className="p-3 text-gray-600">{s.extension ?? '-'}</td>
                <td className="p-3 text-gray-800">{s.area}</td>
                <td className="p-3 text-gray-700">{s.descripcion}</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                    {s.prioridad}
                  </span>
                </td>
                <td className="p-3 text-gray-600 text-xs">{s.fecha_solicitud}</td>
                <td className="p-3 text-gray-600 text-xs">{s.fecha_asignacion ?? '-'}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1.5 items-center">
                    <button
                      onClick={() => setSeguimientoId(s.id)}
                      className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
                    >
                      Seguimiento
                    </button>
                    <button
                      onClick={() => setCerrarId(s.id)}
                      className="w-full px-3 py-1 bg-blue-900 hover:bg-blue-950 text-white rounded-md text-xs font-medium transition-colors shadow-sm"
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

      {filtradas.length === 0 && <p className="text-gray-500 mt-4 text-sm text-center py-4 bg-white border border-blue-100 rounded-lg shadow-sm">Sin resultados</p>}

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