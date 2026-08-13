import { useEffect, useState } from 'react';
import {
  getSolicitudVpnDetalle,
  cambiarEstatusSolicitudVpn,
  type EstatusVpn,
} from '../../services/solicitudVpnService';
import { colorPorEstatus } from '../../utils/estatusColor';
import { OPCIONES_ESTATUS } from '../../utils/opcionesEstatus';

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

  if (cargando || !solicitud) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg p-6">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-5 text-gray-400 hover:text-gray-600">×</button>
        <h2 className="text-2xl mb-4">Folio: {solicitud.id}</h2>

        <div className="flex gap-6 border-b mb-6 text-sm">
          <button onClick={() => setTab('estatus')} className={`pb-2 -mb-px ${tab === 'estatus' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}>CAMBIAR EL ESTATUS</button>
          <button onClick={() => setTab('info')} className={`pb-2 -mb-px ${tab === 'info' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}>INFORMACIÓN GENERAL</button>
        </div>

        {tab === 'estatus' ? (
          <div className="space-y-4">
            <p className="text-2xl">
              Estado actual: <span className="uppercase text-gray-500 font-light">
                {OPCIONES_ESTATUS.find((o) => o.value === solicitud.estatus)?.label}
              </span>
            </p>

            <div className="flex items-center gap-3">
              <span className="bg-gray-100 px-3 py-2 text-sm text-gray-600 rounded-l">NUEVO ESTATUS</span>
              <select value={nuevoEstatus} onChange={(e) => setNuevoEstatus(e.target.value as EstatusVpn)} className="border p-2 flex-1">
                {OPCIONES_ESTATUS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {nuevoEstatus === 'atendiendo_dgti' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Folio GLPI:</label>
                  <input className="border p-2 w-full" value={folioGlpi} onChange={(e) => setFolioGlpi(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Observaciones del sistema GLPI:</label>
                  <textarea className="border p-2 w-full" rows={3} value={observacionGlpi} onChange={(e) => setObservacionGlpi(e.target.value)} />
                </div>
              </>
            )}

            {nuevoEstatus === 'baja' && (
              <div>
                <label className="block text-sm font-medium mb-1">Motivo de baja:</label>
                <textarea className="border p-2 w-full" rows={3} value={motivoBaja} onChange={(e) => setMotivoBaja(e.target.value)} />
              </div>
            )}

            {yaActiva && (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                Esta solicitud ya está activa.
              </p>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end">
              <button
                onClick={aplicar}
                disabled={enviando || yaActiva}
                className="px-6 py-2 rounded text-white disabled:opacity-50"
                style={{ backgroundColor: colorPorEstatus(nuevoEstatus) }}
              >
                {enviando ? 'Aplicando...' : 'Aplicar ⤴'}
              </button>
            </div>
          </div>
        ) : (
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
                  <>
                    CREADO EN CGD: {formatoFecha(solicitud.fecha_creado_cgd ?? solicitud.created_at)}
                    {solicitud.fecha_atendiendo_dgti && <><br /><br />ATENDIENDO DGTI: {formatoFecha(solicitud.fecha_atendiendo_dgti)}<br />FOLIO GLPI: {solicitud.folio_glpi}</>}
                    {solicitud.fecha_activo && <><br /><br />SERVICIO ACTIVO: {formatoFecha(solicitud.fecha_activo)}</>}
                    {solicitud.fecha_baja && <><br /><br />BAJA: {formatoFecha(solicitud.fecha_baja)}<br />MOTIVO: {solicitud.motivo_baja}</>}
                  </>
                }
              />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Fila({ label, valor }: { label: string; valor: any }) {
  return (
    <tr className="odd:bg-gray-50">
      <td className="p-3 font-semibold text-right w-1/3 align-top">{label}:</td>
      <td className="p-3 align-top">{valor}</td>
    </tr>
  );
}

function formatoFecha(fecha?: string | null) {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-MX');
}