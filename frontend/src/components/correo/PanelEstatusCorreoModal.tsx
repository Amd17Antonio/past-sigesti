import { useEffect, useState } from 'react';
import {
  getSolicitudCorreoDetalle,
  cambiarEstatusSolicitudCorreo,
  type EstatusCorreo,
} from '../../services/solicitudCorreoService';
import { colorPorEstatus } from '../../utils/estatusColor';
import { OPCIONES_ESTATUS } from '../../utils/opcionesEstatus';
import { opcionesEstatusDisponibles } from '../../utils/estatusFlujo';

const ORDEN_ESTATUS_CORREO = ['creado_cgd', 'atendiendo_dgti', 'activo'];

export default function PanelEstatusCorreoModal({
  idSolicitud, onClose, onActualizado,
}: { idSolicitud: number; onClose: () => void; onActualizado: () => void }) {
  const [tab, setTab] = useState<'estatus' | 'info'>('estatus');
  const [cargando, setCargando] = useState(true);
  const [solicitud, setSolicitud] = useState<any>(null);
  const [nuevoEstatus, setNuevoEstatus] = useState<EstatusCorreo>('creado_cgd');
  const [folioGlpi, setFolioGlpi] = useState('');
  const [observacionGlpi, setObservacionGlpi] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState('');
  const [motivoBaja, setMotivoBaja] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const cargar = () => {
    setCargando(true);
    getSolicitudCorreoDetalle(idSolicitud).then(({ solicitud }) => {
      setSolicitud(solicitud);
      setNuevoEstatus(solicitud.estatus);
      setFolioGlpi(solicitud.folio_glpi ?? '');
      setObservacionGlpi(solicitud.observacion_glpi ?? '');
      setUsuarioGenerado(solicitud.usuario_generado ?? '');
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
      await cambiarEstatusSolicitudCorreo(idSolicitud, {
        estatus: nuevoEstatus,
        folio_glpi: nuevoEstatus === 'atendiendo_dgti' ? folioGlpi : undefined,
        observacion_glpi: nuevoEstatus === 'atendiendo_dgti' ? observacionGlpi : undefined,
        usuario_generado: nuevoEstatus === 'activo' ? usuarioGenerado : undefined,
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-blue-100 text-gray-600 text-sm font-medium">Cargando información...</div>
      </div>
    );
  }

  const opcionesDisponibles = opcionesEstatusDisponibles(
    solicitud.estatus,
    OPCIONES_ESTATUS,
    ORDEN_ESTATUS_CORREO,
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-[42rem] max-w-[95vw] border border-blue-100 overflow-hidden flex flex-col my-6">
        <div className="bg-blue-900 border-b border-blue-800 text-white px-6 py-4 font-bold flex justify-between items-center">
          <span>Seguimiento de Solicitud — Folio: {solicitud.id}</span>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        <div className="flex gap-2 border-b border-blue-100 px-6 pt-4 bg-blue-50/20 text-sm">
          <button 
            onClick={() => setTab('estatus')} 
            className={`pb-3 px-4 font-semibold transition-all border-b-2 ${
              tab === 'estatus' 
                ? 'border-blue-600 text-blue-900 bg-white rounded-t-lg shadow-xs' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            CAMBIAR EL ESTATUS
          </button>
          <button 
            onClick={() => setTab('info')} 
            className={`pb-3 px-4 font-semibold transition-all border-b-2 ${
              tab === 'info' 
                ? 'border-blue-600 text-blue-900 bg-white rounded-t-lg shadow-xs' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            INFORMACIÓN GENERAL
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto bg-white">
          {tab === 'estatus' ? (
            <div className="space-y-5">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-950">Estado actual:</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-white uppercase shadow-xs" style={{ backgroundColor: colorPorEstatus(solicitud.estatus) }}>
                  {OPCIONES_ESTATUS.find((o) => o.value === solicitud.estatus)?.label ?? solicitud.estatus}
                </span>
              </div>

              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Actualizar Estatus</div>
                <div className="p-4 space-y-4 bg-blue-50/10">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nuevo estatus</label>
                    <select
                      value={nuevoEstatus}
                      onChange={(e) => setNuevoEstatus(e.target.value as EstatusCorreo)}
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      disabled={solicitud.estatus === 'baja'}
                    >
                      {opcionesDisponibles.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  {nuevoEstatus === 'atendiendo_dgti' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Folio GLPI</label>
                        <input className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={folioGlpi} onChange={(e) => setFolioGlpi(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Observaciones del sistema GLPI</label>
                        <textarea className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" rows={3} value={observacionGlpi} onChange={(e) => setObservacionGlpi(e.target.value)} />
                      </div>
                    </>
                  )}

                  {nuevoEstatus === 'activo' && solicitud.tipo_solicitud === 'alta' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Usuario generado (usuario@oaxaca.gob.mx)</label>
                      <input className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={usuarioGenerado} onChange={(e) => setUsuarioGenerado(e.target.value)} />
                    </div>
                  )}

                  {nuevoEstatus === 'baja' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Motivo de baja</label>
                      <textarea className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" rows={3} value={motivoBaja} onChange={(e) => setMotivoBaja(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>

              {yaActiva && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3.5 font-medium shadow-xs">
                  Esta cuenta ya está activa.
                </p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 shadow-xs">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-blue-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <Fila label="Folio (ID)" valor={solicitud.id} />
                  <Fila label="Tipo Solicitud" valor={solicitud.tipo_solicitud?.toUpperCase()} />
                  <Fila label="Nombre" valor={solicitud.nombre} />
                  {solicitud.tipo_solicitud === 'alta' ? (
                    <>
                      <Fila label="Puesto" valor={solicitud.puesto} />
                      <Fila label="Área interna" valor={solicitud.area_interna} />
                      <Fila label="Correo secundario" valor={solicitud.correo_secundario} />
                      <Fila label="Teléfono de contacto" valor={solicitud.telefono_contacto} />
                    </>
                  ) : (
                    <>
                      <Fila label="Correo institucional a dar de baja" valor={solicitud.correo_institucional} />
                      <Fila label="Motivo de baja" valor={solicitud.motivo_baja} />
                    </>
                  )}
                  <Fila label="Dependencia / Área" valor={solicitud.area} />
                  <Fila label="Usuario generado" valor={solicitud.usuario_generado ?? '-'} />
                  <Fila
                    label="Estatus"
                    valor={
                      <div className="space-y-1">
                        <div>CREADO EN CGD: {formatoFecha(solicitud.fecha_creado_cgd ?? solicitud.created_at)}</div>
                        {solicitud.fecha_atendiendo_dgti && <div>ATENDIENDO DGTI: {formatoFecha(solicitud.fecha_atendiendo_dgti)} <br />FOLIO GLPI: {solicitud.folio_glpi}</div>}
                        {solicitud.fecha_activo && <div>SERVICIO ACTIVO: {formatoFecha(solicitud.fecha_activo)}</div>}
                        {solicitud.fecha_baja && <div>BAJA: {formatoFecha(solicitud.fecha_baja)} <br />MOTIVO: {solicitud.motivo_baja}</div>}
                      </div>
                    }
                  />
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-blue-100 bg-blue-50/20">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
          >
            ✕ Cerrar
          </button>
          {tab === 'estatus' && (
            <button
              onClick={aplicar}
              disabled={enviando || yaActiva}
              className="px-5 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition shadow-sm"
              style={{ backgroundColor: colorPorEstatus(nuevoEstatus) }}
            >
              {enviando ? 'Aplicando...' : 'Aplicar ⤴'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Fila({ label, valor }: { label: string; valor: any }) {
  return (
    <tr className="border-b border-blue-100 last:border-0 odd:bg-blue-50/20">
      <td className="p-3.5 font-semibold text-right w-1/3 align-top text-gray-700">{label}:</td>
      <td className="p-3.5 align-top text-gray-800">{valor}</td>
    </tr>
  );
}

function formatoFecha(fecha?: string | null) {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-MX');
}