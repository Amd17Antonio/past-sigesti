import { useEffect, useState } from 'react';
import {
  getSolicitudVpnDetalle,
  cambiarEstatusSolicitudVpn,
  type EstatusVpn,
} from '../../services/solicitudVpnService';
import { colorPorEstatus } from '../../utils/estatusColor';
import { OPCIONES_ESTATUS } from '../../utils/opcionesEstatus';
import { opcionesEstatusDisponibles } from '../../utils/estatusFlujo';

const ORDEN_ESTATUS_VPN = ['creado_cgd', 'atendiendo_dgti', 'activo'];

export default function PanelEstatusVpnModal({
  idSolicitud, onClose, onActualizado,
}: { idSolicitud: number; onClose: () => void; onActualizado: () => void }) {
  const [tab, setTab] = useState<'estatus' | 'info'>('estatus');
  const [cargando, setCargando] = useState(true);
  const [solicitud, setSolicitud] = useState<any>(null);
  const [nuevoEstatus, setNuevoEstatus] = useState<EstatusVpn>('creado_cgd');
  const [folioGlpi, setFolioGlpi] = useState('');
  const [observacionGlpi, setObservacionGlpi] = useState('');
  const [motivoBaja, setMotivoBaja] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const cargar = () => {
    setCargando(true);
    getSolicitudVpnDetalle(idSolicitud).then(({ solicitud }) => {
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
      await cambiarEstatusSolicitudVpn(idSolicitud, {
        estatus: nuevoEstatus,
        folio_glpi: nuevoEstatus === 'atendiendo_dgti' ? folioGlpi : undefined,
        observacion_glpi: nuevoEstatus === 'atendiendo_dgti' ? observacionGlpi : undefined,
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

  const campoEditable = 'w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  if (cargando || !solicitud) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 text-gray-500 text-sm">Cargando información...</div>
      </div>
    );
  }

  const opcionesDisponibles = opcionesEstatusDisponibles(
    solicitud.estatus,
    OPCIONES_ESTATUS,
    ORDEN_ESTATUS_VPN,
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 w-[42rem] max-w-[95vw] my-6 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b bg-blue-600">
          <h2 className="text-lg font-bold text-white">
            Folio: {solicitud.id}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-6 px-5 border-b border-gray-200 bg-gray-50 text-sm">
          <button
            onClick={() => setTab('estatus')}
            className={`py-3 font-medium transition-colors border-b-2 -mb-px ${
              tab === 'estatus'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            CAMBIAR EL ESTATUS
          </button>
          <button
            onClick={() => setTab('info')}
            className={`py-3 font-medium transition-colors border-b-2 -mb-px ${
              tab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            INFORMACIÓN GENERAL
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {tab === 'estatus' ? (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm flex items-center justify-between">
                <span className="text-gray-600 font-medium">Estado actual:</span>
                <span className="uppercase font-semibold text-gray-800">
                  {OPCIONES_ESTATUS.find((o) => o.value === solicitud.estatus)?.label}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">NUEVO ESTATUS</label>
                <select
                  value={nuevoEstatus}
                  onChange={(e) => setNuevoEstatus(e.target.value as EstatusVpn)}
                  className={campoEditable}
                  disabled={solicitud.estatus === 'baja'}
                >
                  {opcionesDisponibles.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {nuevoEstatus === 'atendiendo_dgti' && (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Folio GLPI <span className="text-red-500">*</span></label>
                    <input
                      className={campoEditable}
                      value={folioGlpi}
                      onChange={(e) => setFolioGlpi(e.target.value)}
                      placeholder="Número de ticket o folio GLPI"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Observaciones del sistema GLPI</label>
                    <textarea
                      className={`${campoEditable} resize-none`}
                      rows={3}
                      value={observacionGlpi}
                      onChange={(e) => setObservacionGlpi(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {nuevoEstatus === 'baja' && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Motivo de baja <span className="text-red-500">*</span></label>
                  <textarea
                    className={`${campoEditable} resize-none`}
                    rows={3}
                    value={motivoBaja}
                    onChange={(e) => setMotivoBaja(e.target.value)}
                    placeholder="Describa el motivo de la baja..."
                  />
                </div>
              )}

              {yaActiva && (
                <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  Esta solicitud ya está activa.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={aplicar}
                  disabled={enviando || yaActiva}
                  className="px-5 py-2 rounded text-white text-sm font-medium shadow-sm disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: colorPorEstatus(nuevoEstatus) }}
                >
                  {enviando ? 'Aplicando...' : 'Aplicar ⤴'}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <Fila label="Folio (ID)" valor={solicitud.id} />
                  <Fila label="Usuario" valor={solicitud.nombre_usuario} />
                  <Fila label="Puesto" valor={solicitud.puesto} />
                  <Fila label="Área" valor={solicitud.area} />
                  <Fila label="Dependencia" valor={solicitud.dependencia} />
                  <Fila label="Correo institucional" valor={solicitud.correo_institucional} />
                  <Fila label="Teléfono / Ext." valor={`${solicitud.telefono ?? '-'} / ${solicitud.extension ?? '-'}`} />
                  <Fila label="Tipo de acceso" valor={solicitud.tipo_acceso === 'link' ? solicitud.link_sistema : solicitud.ip_puerto} />
                  <Fila label="Vigencia" valor={`${formatoFecha(solicitud.fecha_inicio)} — ${formatoFecha(solicitud.fecha_fin)}`} />
                  <Fila label="Justificación" valor={solicitud.justificacion_uso} />
                  <Fila label="Núm. Ticket" valor={solicitud.num_ticket ?? '-'} />
                  <Fila
                    label="Estatus"
                    valor={
                      <div className="space-y-1 text-xs">
                        <div><span className="font-medium text-gray-700">CREADO EN CGD:</span> {formatoFecha(solicitud.fecha_creado_cgd ?? solicitud.created_at)}</div>
                        {solicitud.fecha_atendiendo_dgti && <div><span className="font-medium text-gray-700">ATENDIENDO DGTI:</span> {formatoFecha(solicitud.fecha_atendiendo_dgti)} | <span className="font-medium text-gray-700">FOLIO GLPI:</span> {solicitud.folio_glpi}</div>}
                        {solicitud.fecha_activo && <div><span className="font-medium text-gray-700">SERVICIO ACTIVO:</span> {formatoFecha(solicitud.fecha_activo)}</div>}
                        {solicitud.fecha_baja && <div><span className="font-medium text-gray-700">BAJA:</span> {formatoFecha(solicitud.fecha_baja)} | <span className="font-medium text-gray-700">MOTIVO:</span> {solicitud.motivo_baja}</div>}
                      </div>
                    }
                  />
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end px-5 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded transition-colors"
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
    <tr className="border-b border-gray-100 odd:bg-gray-50/50">
      <td className="p-3 font-medium text-gray-600 text-right w-1/3 align-top text-xs uppercase tracking-wider">{label}:</td>
      <td className="p-3 align-top text-gray-800">{valor}</td>
    </tr>
  );
}

function formatoFecha(fecha?: string | null) {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-MX');
}