import { useEffect, useState } from 'react';
import { getSolicitudVpnDetalle } from '../../services/solicitudVpnService';

interface Props {
  folio: number;
  onGuardar: (payload: { link_sistema: string; ip_puerto: string }) => Promise<any>;
  onClose: () => void;
  onActualizado: () => void;
}

interface DetalleVpn {
  nombre_usuario?: string;
  puesto?: string;
  area?: string;
  dependencia?: string;
  correo_institucional?: string;
  telefono?: string;
  extension?: string;
  tipo_acceso?: string;
  link_sistema?: string | null;
  ip_puerto?: string | null;
  justificacion_uso?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  num_ticket?: string;
}

const TIPO_ACCESO_LABEL: Record<string, string> = {
  link: 'Link del sistema',
  ip_puerto: 'IP y puerto',
};

const REGEX_IP_PUERTO = /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(,\d{1,5})*$/;

export default function EditarResguardoVpnModal({
  folio,
  onGuardar,
  onClose,
  onActualizado,
}: Props) {
  const [cargando, setCargando] = useState(true);
  const [detalle, setDetalle] = useState<DetalleVpn | null>(null);
  const [linkSistema, setLinkSistema] = useState('');
  const [ipPuerto, setIpPuerto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    getSolicitudVpnDetalle(folio)
      .then(({ solicitud }) => {
        if (!activo) return;
        setDetalle(solicitud as DetalleVpn);
        setLinkSistema((solicitud as any).link_sistema ?? '');
        setIpPuerto((solicitud as any).ip_puerto ?? '');
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar la información de la solicitud.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [folio]);

  const handleGuardar = async () => {
    setError(null);

    if (!linkSistema.trim()) {
      setError('El link del sistema es obligatorio.');
      return;
    }
    if (!ipPuerto.trim()) {
      setError('La IP y puerto del servidor son obligatorios.');
      return;
    }
    if (!REGEX_IP_PUERTO.test(ipPuerto.trim())) {
      setError('La IP y puerto no tienen un formato válido. Ejemplo: 192.168.1.100:8080');
      return;
    }

    setGuardando(true);
    try {
      await onGuardar({
        link_sistema: linkSistema.trim(),
        ip_puerto: ipPuerto.trim(),
      });
      onActualizado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo actualizar el acceso VPN.');
    } finally {
      setGuardando(false);
    }
  };

  const campoGris = 'w-full border rounded p-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-6">
        <div className="flex justify-between items-center px-5 py-4 border-b bg-blue-600 rounded-t-lg">
          <h2 className="text-lg font-semibold text-white">
            Editar acceso VPN — Folio: {folio}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-gray-500 text-sm">Cargando información…</div>
        ) : (
          <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-2">
                {error}
              </div>
            )}

            {/* Datos de la solicitud (solo lectura) */}
            <div className="border rounded">
              <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">
                Datos de la Solicitud (solo lectura)
              </div>
              <div className="p-3 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600">Nombre del usuario</label>
                  <input disabled value={detalle?.nombre_usuario ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Puesto</label>
                  <input disabled value={detalle?.puesto ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Área de adscripción</label>
                  <input disabled value={detalle?.area ?? '-'} className={campoGris} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600">Dependencia o Entidad</label>
                  <input disabled value={detalle?.dependencia ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Correo institucional</label>
                  <input disabled value={detalle?.correo_institucional ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Teléfono / Extensión</label>
                  <input
                    disabled
                    value={`${detalle?.telefono ?? '-'} / ${detalle?.extension ?? '-'}`}
                    className={campoGris}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Tipo de acceso</label>
                  <input
                    disabled
                    value={TIPO_ACCESO_LABEL[detalle?.tipo_acceso ?? ''] ?? detalle?.tipo_acceso ?? '-'}
                    className={campoGris}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">No. Ticket</label>
                  <input disabled value={detalle?.num_ticket ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Fecha inicial</label>
                  <input disabled value={detalle?.fecha_inicio ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Fecha final</label>
                  <input disabled value={detalle?.fecha_fin ?? '-'} className={campoGris} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600">Justificación de uso</label>
                  <textarea
                    disabled
                    value={detalle?.justificacion_uso ?? '-'}
                    rows={2}
                    className={campoGris}
                  />
                </div>
              </div>
            </div>

            {/* Datos editables del resguardo */}
            <div className="border rounded">
              <div className="bg-blue-50 px-3 py-2 font-semibold text-sm border-b text-blue-800">
                Datos de Acceso (editable)
              </div>
              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link del sistema <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={linkSistema}
                    onChange={(e) => setLinkSistema(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP y puerto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ipPuerto}
                    onChange={(e) => setIpPuerto(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="192.168.1.100:8080"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 px-5 py-4 border-t">
          <button
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2 border rounded text-sm disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando || cargando}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}