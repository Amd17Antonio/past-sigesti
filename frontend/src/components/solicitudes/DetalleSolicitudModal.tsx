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
    <div className="flex py-1.5 px-3 border-b border-slate-100 text-sm hover:bg-slate-50/50 transition-colors">
      <span className="font-semibold text-blue-900 w-48 shrink-0">{label}:</span>
      <span className="text-slate-700">{valor ?? ''}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden border border-blue-100 flex flex-col">
        {/* Cabecera del modal */}
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span className="text-base">Detalle de Solicitud</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        {/* Contenido principal */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cargando && (
            <div className="flex items-center justify-center py-8 gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-slate-600 font-medium text-sm">Cargando detalle...</span>
            </div>
          )}

          {data && (
            <div className="border border-blue-100 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="bg-blue-50/70 px-3 py-2 font-semibold text-blue-900 border-b border-blue-100 text-xs uppercase tracking-wider">
                Información General
              </div>
              <div className="divide-y divide-slate-100">
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
              </div>

              {data.equipos.length > 0 && (
                <div className="p-3 bg-blue-50/30 border-t border-blue-100">
                  <p className="font-semibold text-blue-900 text-sm mb-2">Equipos vinculados:</p>
                  <div className="space-y-1">
                    {data.equipos.map((eq) => (
                      <div key={eq.id} className="text-sm text-slate-700 bg-white border border-blue-100 p-2 rounded shadow-xs">
                        • <span className="font-medium text-slate-900">{eq.no_inventario}</span> — {eq.tipo} {eq.marca} {eq.modelo}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.dictamen && (
                <div className="p-3 bg-blue-50/30 border-t border-blue-100">
                  <p className="font-semibold text-blue-900 text-sm mb-1">
                    Dictamen: {data.dictamen.folio}/{data.dictamen.ejercicio}
                  </p>
                  <p className="text-sm text-slate-700 bg-white border border-blue-100 p-2 rounded shadow-xs">{data.dictamen.dictamen}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="flex justify-end px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}