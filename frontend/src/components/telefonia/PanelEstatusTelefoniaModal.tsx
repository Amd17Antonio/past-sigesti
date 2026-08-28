import { useEffect, useState } from 'react';
import {
  getSolicitudTelefoniaDetalle,
  cambiarEstatusSolicitudTelefonia,
  type EstatusTelefonia,
} from '../../services/solicitudTelefoniaService';
import { colorPorEstatus } from '../../utils/estatusColor';
import { OPCIONES_ESTATUS } from '../../utils/opcionesEstatus';
import { opcionesEstatusDisponibles } from '../../utils/estatusFlujo';

const ORDEN_ESTATUS_TELEFONIA = ['creado_cgd', 'atendiendo_dgti', 'activo'];
const inputClass = 'border border-slate-300 rounded px-3 py-2 text-sm w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'text-xs font-semibold uppercase text-slate-600 mb-1 block';

export default function PanelEstatusTelefoniaModal({
  idSolicitud, onClose, onActualizado,
}: { idSolicitud: number; onClose: () => void; onActualizado: () => void }) {
  const [tab, setTab] = useState<'estatus' | 'info'>('estatus');
  const [cargando, setCargando] = useState(true);
  const [solicitud, setSolicitud] = useState<any>(null);
  const [nuevoEstatus, setNuevoEstatus] = useState<EstatusTelefonia>('creado_cgd');
  const [folioGlpi, setFolioGlpi] = useState('');
  const [observacionGlpi, setObservacionGlpi] = useState('');
  const [motivoBaja, setMotivoBaja] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const cargar = () => {
    let activo = true;
    setCargando(true);
    getSolicitudTelefoniaDetalle(idSolicitud).then(({ solicitud: s }) => {
      if (!activo) return;
      setSolicitud(s);
      setNuevoEstatus(s.estatus);
      setFolioGlpi(s.folio_glpi ?? '');
      setObservacionGlpi(s.observacion_glpi ?? '');
      setMotivoBaja(s.motivo_baja ?? '');
      setCargando(false);
    });
    return () => { activo = false; };
  };

  useEffect(() => {
    cargar();
  }, [idSolicitud]);

  const yaActiva = solicitud?.estatus === 'activo' && nuevoEstatus === 'activo';

  const aplicar = async () => {
    setEnviando(true);
    setError('');
    try {
      await cambiarEstatusSolicitudTelefonia(idSolicitud, {
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

  if (cargando || !solicitud) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center text-slate-500 text-sm flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>Cargando información...</span>
        </div>
      </div>
    );
  }

  const opcionesDisponibles = opcionesEstatusDisponibles(
    solicitud.estatus,
    OPCIONES_ESTATUS,
    ORDEN_ESTATUS_TELEFONIA,
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-blue-100 flex flex-col relative">
        {/* Cabecera */}
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center shrink-0">
          <span className="text-base">Folio: #{solicitud.id}</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex gap-6 border-b border-slate-200 px-5 pt-3 text-sm shrink-0 bg-slate-50">
          <button
            onClick={() => setTab('estatus')}
            className={`pb-2 -mb-px transition font-medium ${tab === 'estatus' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            CAMBIAR EL ESTATUS
          </button>
          <button
            onClick={() => setTab('info')}
            className={`pb-2 -mb-px transition font-medium ${tab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            INFORMACIÓN GENERAL
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-sm">
          {tab === 'estatus' ? (
            <div className="space-y-4">
              <div className="text-lg text-slate-800 font-medium">
                Estado actual:{' '}
                <span className="uppercase text-slate-500 font-normal">
                  {OPCIONES_ESTATUS.find((o) => o.value === solicitud.estatus)?.label}
                </span>
              </div>

              <div className="flex items-center shadow-sm rounded">
                <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2 text-xs font-semibold uppercase text-slate-600 rounded-l flex items-center">
                  Nuevo estatus
                </span>
                <select
                  value={nuevoEstatus}
                  onChange={(e) => setNuevoEstatus(e.target.value as EstatusTelefonia)}
                  className="border border-slate-300 rounded-r px-3 py-2 text-sm flex-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={solicitud.estatus === 'baja'}
                >
                  {opcionesDisponibles.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {nuevoEstatus === 'atendiendo_dgti' && (
                <>
                  <div>
                    <label className={labelClass}>Folio GLPI:</label>
                    <input className={inputClass} value={folioGlpi} onChange={(e) => setFolioGlpi(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Observaciones del sistema GLPI:</label>
                    <textarea className={inputClass} rows={3} value={observacionGlpi} onChange={(e) => setObservacionGlpi(e.target.value)} />
                  </div>
                </>
              )}

              {nuevoEstatus === 'baja' && (
                <div>
                  <label className={labelClass}>Motivo de baja:</label>
                  <textarea className={inputClass} rows={3} value={motivoBaja} onChange={(e) => setMotivoBaja(e.target.value)} />
                </div>
              )}

              {yaActiva && (
                <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-3 text-sm font-medium">
                  Esta solicitud ya está activa.
                </div>
              )}

              {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={aplicar}
                  disabled={enviando || yaActiva}
                  className="px-5 py-2 rounded text-white disabled:opacity-50 font-medium text-sm shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: colorPorEstatus(nuevoEstatus) }}
                >
                  {enviando ? 'Aplicando...' : 'Aplicar ⤴'}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <Fila label="Folio (ID)" valor={solicitud.id} />
                  <Fila label="Trámite" valor={solicitud.tipo_tramite?.replace(/_/g, ' ')} />
                  <Fila label="Nombre" valor={`${solicitud.nombre ?? ''} ${solicitud.apellido_paterno ?? ''} ${solicitud.apellido_materno ?? ''}`} />
                  <Fila label="Puesto" valor={solicitud.puesto} />
                  <Fila label="Extensión" valor={solicitud.extension} />
                  <Fila label="DID" valor={solicitud.did} />
                  <Fila label="Correo institucional" valor={solicitud.correo_institucional} />
                  <Fila label="Categoría" valor={solicitud.categoria} />
                  <Fila label="Ubicación" valor={`Ed: ${solicitud.edificio ?? '-'} | Nivel: ${solicitud.nivel ?? '-'}`} />
                  <Fila label="Equipo" valor={<span className="space-y-0.5 block"><strong>MODELO:</strong> {solicitud.modelo}<br /><strong>MAC:</strong> {solicitud.mac}<br /><strong>No. SERIE:</strong> {solicitud.numero_serie}</span>} />
                  <Fila
                    label="Estatus"
                    valor={
                      <div className="space-y-2">
                        <div><strong>CREADO EN CGD:</strong> {formatoFecha(solicitud.fecha_creado_cgd ?? solicitud.created_at)}</div>
                        {solicitud.fecha_atendiendo_dgti && <div className="text-slate-600"><strong>ATENDIENDO DGTI:</strong> {formatoFecha(solicitud.fecha_atendiendo_dgti)}<br /><strong>FOLIO GLPI:</strong> {solicitud.folio_glpi}</div>}
                        {solicitud.fecha_activo && <div className="text-slate-600"><strong>SERVICIO ACTIVO:</strong> {formatoFecha(solicitud.fecha_activo)}</div>}
                        {solicitud.fecha_baja && <div className="text-red-600"><strong>BAJA:</strong> {formatoFecha(solicitud.fecha_baja)}<br /><strong>MOTIVO:</strong> {solicitud.motivo_baja}</div>}
                      </div>
                    }
                  />
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 shrink-0">
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

function Fila({ label, valor }: { label: string; valor: any }) {
  return (
    <tr className="border-b border-slate-100 odd:bg-white even:bg-slate-50">
      <td className="p-3 font-semibold text-right w-1/3 align-top text-slate-600">{label}:</td>
      <td className="p-3 align-top text-slate-700">{valor ?? '-'}</td>
    </tr>
  );
}

function formatoFecha(fecha?: string | null) {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-MX');
}