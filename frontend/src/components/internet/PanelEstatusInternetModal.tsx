import { useEffect, useState } from 'react';
import {
  getSolicitudInternetDetalle,
  cambiarEstatusSolicitudInternet,
  type EstatusInternet,
} from '../../services/solicitudInternetService';
import { colorPorEstatus } from '../../utils/estatusColor';
import { opcionesEstatusDisponibles } from '../../utils/estatusFlujo';

const OPCIONES: { value: EstatusInternet; label: string }[] = [
  { value: 'generado_uie', label: 'GENERADO POR CGD' },
  { value: 'atendiendo_dt', label: 'ATENDIENDO DGTI' },
  { value: 'activo', label: 'SERVICIO ACTIVO' },
  { value: 'baja', label: 'BAJA DEL SERVICIO' },
];

const ORDEN_ESTATUS_INTERNET = ['generado_uie', 'atendiendo_dt', 'activo'];

export default function PanelEstatusInternetModal({
  idSolicitud, onClose, onActualizado,
}: { idSolicitud: number; onClose: () => void; onActualizado: () => void }) {
  const [tab, setTab] = useState<'estatus' | 'info'>('estatus');
  const [cargando, setCargando] = useState(true);
  const [solicitud, setSolicitud] = useState<any>(null);

  const [nuevoEstatus, setNuevoEstatus] = useState<EstatusInternet>('generado_uie');
  const [folioGlpi, setFolioGlpi] = useState('');
  const [observacionGlpi, setObservacionGlpi] = useState('');
  const [motivoBaja, setMotivoBaja] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const cargar = () => {
    setCargando(true);
    getSolicitudInternetDetalle(idSolicitud).then(({ solicitud }) => {
      setSolicitud(solicitud);
      setNuevoEstatus(solicitud.estatus);
      setFolioGlpi(solicitud.folio_glpi ?? '');
      setObservacionGlpi(solicitud.observacion_glpi ?? '');
      setMotivoBaja(solicitud.motivo_baja ?? '');
      setCargando(false);
    });
  };

  useEffect(cargar, [idSolicitud]);

  const yaActiva = solicitud?.estatus === 'activo' && nuevoEstatus === 'activo';

  const aplicar = async () => {
    setEnviando(true);
    setError('');
    try {
      await cambiarEstatusSolicitudInternet(idSolicitud, {
        estatus: nuevoEstatus,
        folio_glpi: nuevoEstatus === 'atendiendo_dt' ? folioGlpi : undefined,
        observacion_glpi: nuevoEstatus === 'atendiendo_dt' ? observacionGlpi : undefined,
        motivo_baja: nuevoEstatus === 'baja' ? motivoBaja : undefined,
      });
      onActualizado();
      cargar();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo actualizar el estatus');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando || !solicitud) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 text-sm text-slate-600 font-medium">Cargando...</div>
      </div>
    );
  }

  const opcionesDisponibles = opcionesEstatusDisponibles(
    solicitud.estatus,
    OPCIONES,
    ORDEN_ESTATUS_INTERNET,
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-100 w-[52rem] max-w-[95vw] overflow-hidden">
        
        {/* Cabecera Principal */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-4 font-semibold flex justify-between items-center shadow-sm">
          <span className="text-base tracking-wide flex items-center gap-2">
            ⚙️ Control de Estatus — Folio: <span className="underline decoration-blue-300">{solicitud.id}</span>
          </span>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-base cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex gap-6 px-6 pt-4 border-b border-slate-200 bg-slate-50 text-sm font-medium">
          <button
            onClick={() => setTab('estatus')}
            className={`pb-3 -mb-px transition-colors cursor-pointer flex items-center gap-2 ${
              tab === 'estatus' 
                ? 'border-b-2 border-blue-600 text-blue-700 font-semibold' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🔄 Cambiar Estatus
          </button>
          <button
            onClick={() => setTab('info')}
            className={`pb-3 -mb-px transition-colors cursor-pointer flex items-center gap-2 ${
              tab === 'info' 
                ? 'border-b-2 border-blue-600 text-blue-700 font-semibold' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📋 Información General
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-slate-50/50">
          {tab === 'estatus' ? (
            <div className="space-y-5">
              
              {/* Estado actual banner */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado actual</p>
                  <p className="text-lg font-bold text-slate-800 uppercase mt-0.5">
                    {OPCIONES.find((o) => o.value === solicitud.estatus)?.label}
                  </p>
                </div>
                <div>
                  <span 
                    className="text-xs px-3 py-1.5 rounded-full text-white font-semibold shadow-xs"
                    style={{ backgroundColor: colorPorEstatus(solicitud.estatus) }}
                  >
                    {solicitud.estatus}
                  </span>
                </div>
              </div>

              {/* Selector de nuevo estatus */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  Seleccionar Nuevo Estatus:
                </label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 px-3.5 py-2.5 text-xs font-semibold text-slate-600 rounded-l-lg select-none">
                    NUEVO
                  </span>
                  <select
                    value={nuevoEstatus}
                    onChange={(e) => setNuevoEstatus(e.target.value as EstatusInternet)}
                    className="border border-slate-300 rounded-r-lg p-2.5 flex-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    disabled={solicitud.estatus === 'baja'}
                  >
                    {opcionesDisponibles.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Campos condicionales para ATENDIENDO DT */}
              {nuevoEstatus === 'atendiendo_dt' && (
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-4">
                  <div className="font-semibold text-xs text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    🛠️ Detalles de Atención DGTI
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Folio GLPI:</label>
                    <input 
                      className="border border-slate-300 rounded-lg p-2.5 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={folioGlpi} 
                      onChange={(e) => setFolioGlpi(e.target.value)} 
                      placeholder="Ej. GLPI-2026-0001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Observaciones del sistema GLPI:</label>
                    <textarea 
                      className="border border-slate-300 rounded-lg p-2.5 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      rows={3} 
                      value={observacionGlpi} 
                      onChange={(e) => setObservacionGlpi(e.target.value)} 
                      placeholder="Detalles adicionales sobre la atención técnica..."
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionales para BAJA */}
              {nuevoEstatus === 'baja' && (
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="font-semibold text-xs text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    ⚠️ Motivo de Baja del Servicio
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Especifique el motivo:</label>
                    <textarea 
                      className="border border-slate-300 rounded-lg p-2.5 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      rows={3} 
                      value={motivoBaja} 
                      onChange={(e) => setMotivoBaja(e.target.value)} 
                      placeholder="Razón por la cual se da de baja el servicio..."
                    />
                  </div>
                </div>
              )}

              {/* Aviso si ya está activa */}
              {nuevoEstatus === 'activo' && solicitud.estatus === 'activo' && (
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-2">
                  ⚠️ Esta solicitud ya se encuentra activa actualmente.
                </div>
              )}

              {/* Mensaje de error general */}
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  ❌ {error}
                </div>
              )}

              {/* Botón de Aplicar */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={aplicar}
                  disabled={enviando || yaActiva}
                  className="px-6 py-2.5 rounded-lg text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  style={{ backgroundColor: colorPorEstatus(nuevoEstatus) }}
                >
                  🚀 {enviando ? 'Aplicando...' : 'Aplicar Estatus'}
                </button>
              </div>

            </div>
          ) : (
            
            /* Tab de Información General con diseño limpio */
            <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-sm divide-y divide-slate-200">
                <tbody className="divide-y divide-slate-200/60">
                  <Fila label="Folio (ID)" valor={solicitud.id} />
                  <Fila label="Tipo Solicitud" valor={solicitud.tipo_solicitud?.toUpperCase()} />
                  <Fila label="Usuario" valor={solicitud.usuario_internet} />
                  <Fila label="Correo" valor={solicitud.correo} />
                  <Fila label="Cargo" valor={solicitud.cargo} />
                  <Fila label="Área de Adscripción" valor={solicitud.area} />
                  <Fila label="Extensión" valor={solicitud.tel_ext} />
                  <Fila label="Tipo Conexión" valor={solicitud.tipo_conexion?.toUpperCase()} />
                  <Fila label="Puerto" valor={`Edificio: ${solicitud.edificio} | Nivel: ${solicitud.nivel} | Puerto: ${solicitud.puerto ?? '-'}`} />
                  <Fila
                    label="Equipo"
                    valor={
                      <div className="space-y-0.5 text-xs text-slate-600">
                        <p><strong>Tipo:</strong> {solicitud.tipo_equipo}</p>
                        <p><strong>Marca:</strong> {solicitud.marca}</p>
                        <p><strong>No. Inventario:</strong> {solicitud.no_inventario}</p>
                        <p><strong>MAC Ethernet:</strong> <span className="font-mono">{solicitud.mac_ethernet || '-'}</span></p>
                        <p><strong>MAC Wi-Fi:</strong> <span className="font-mono">{solicitud.mac_wifi || '-'}</span></p>
                      </div>
                    }
                  />
                  <Fila
                    label="Historial de Estatus"
                    valor={
                      <div className="space-y-2 text-xs text-slate-700">
                        <p>🔵 <strong>GENERADO POR UIE:</strong> {formatoFecha(solicitud.fecha_generado_uie)}</p>
                        {solicitud.fecha_atendiendo_dt && (
                          <p>🟡 <strong>ATENDIENDO POR DGTI:</strong> {formatoFecha(solicitud.fecha_atendiendo_dt)} <br/>
                          <span className="text-slate-500">Folio GLPI: {solicitud.folio_glpi || '-'}</span></p>
                        )}
                        {solicitud.fecha_activo && (
                          <p>🟢 <strong>SERVICIO ACTIVO:</strong> {formatoFecha(solicitud.fecha_activo)}</p>
                        )}
                        {solicitud.fecha_baja && (
                          <p>🔴 <strong>BAJA DEL SERVICIO:</strong> {formatoFecha(solicitud.fecha_baja)} <br/>
                          <span className="text-slate-500">Motivo: {solicitud.motivo_baja || '-'}</span></p>
                        )}
                      </div>
                    }
                  />
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="flex justify-end gap-2 px-6 py-4 bg-slate-100/80 border-t border-slate-200/80">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

function Fila({ label, valor }: { label: string; valor: any }) {
  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="p-3 font-semibold text-right w-1/3 text-xs uppercase tracking-wider text-slate-500 align-top bg-slate-50/40 border-r border-slate-200/60">{label}:</td>
      <td className="p-3 align-top text-slate-800 text-sm">{valor}</td>
    </tr>
  );
}

function formatoFecha(fecha?: string | null) {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}