import { useEffect, useState } from 'react';
import { getSolicitudUieDetalle, type SolicitudUieDetalle } from '../../services/solicitudUieService';

export default function DetalleSolicitudModal({
  idSolicitud, onClose,
}: { idSolicitud: number; onClose: () => void }) {
  const [data, setData] = useState<SolicitudUieDetalle | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getSolicitudUieDetalle(idSolicitud)
      .then(setData)
      .finally(() => setCargando(false));
  }, [idSolicitud]);

  const fila = (label: string, valor: any) => (
    <div className="flex py-1 text-sm">
      <span className="font-semibold text-teal-700 w-48 shrink-0">{label}:</span>
      <span className="text-gray-800">{valor ?? ''}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-lg">✕</button>
        <h2 className="text-lg font-semibold mb-4">Detalle</h2>

        {cargando && <p className="text-sm text-gray-500">Cargando...</p>}

        {data && (
          <>
            {fila('Folio', data.solicitud.id)}
            {fila('Solicitante', data.solicitud.solicitante)}
            {fila('Extensión', data.solicitud.extension)}
            {fila('Área', data.solicitud.area)}
            {fila('Número de Documento', data.solicitud.num_documento)}
            {fila('Problema', data.solicitud.descripcion)}
            {fila('Prioridad', data.solicitud.prioridad)}
            {fila('Fecha Solicitud/Creación', data.solicitud.fecha_solicitud)}
            {fila('Fecha Asignado', data.solicitud.fecha_asignacion)}
            {fila('Asignado a', data.solicitud.tecnico)}
            {fila('Edificio y nivel', data.solicitud.edificio ? `E. ${data.solicitud.edificio} N. ${data.solicitud.nivel ?? ''}` : '')}
            {fila('Seguimiento', data.solicitud.seguimiento)}
            {fila('Respuesta', data.solicitud.observaciones)}
            {fila('POA', data.solicitud.poa)}

            {data.equipos.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-teal-700 text-sm mb-1">Equipos vinculados:</p>
                {data.equipos.map((eq) => (
                  <div key={eq.id} className="text-sm text-gray-700 pl-2">
                    • {eq.no_inventario} — {eq.tipo} {eq.marca} {eq.modelo}
                  </div>
                ))}
              </div>
            )}

            {data.dictamen && (
              <div className="mt-4">
                <p className="font-semibold text-teal-700 text-sm mb-1">
                  Dictamen: {data.dictamen.folio}/{data.dictamen.ejercicio}
                </p>
                <p className="text-sm text-gray-700">{data.dictamen.dictamen}</p>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cerrar</button>
        </div>
      </div>
    </div>
  );
}