import { useEffect, useState } from 'react';
import { getSolicitudCorreoDetalle } from '../../services/solicitudCorreoService';

interface Props {
  folio: number;
  onGuardar: (payload: {
    correo_institucional: string;
    usuario_generado?: string | null;
    correo_secundario?: string | null;
    telefono_contacto?: string | null;
  }) => Promise<any>;
  onClose: () => void;
  onActualizado: () => void;
}

interface DetalleCorreo {
  tipo_solicitud?: string;
  nombre?: string;
  puesto?: string;
  area?: string;
  area_interna?: string;
  extension?: string;
  correo_secundario?: string | null;
  telefono_contacto?: string | null;
  correo_institucional?: string | null;
  usuario_generado?: string | null;
  oficio_cgd?: string | null;
  observaciones?: string | null;
}

export default function EditarResguardoCorreoModal({
  folio,
  onGuardar,
  onClose,
  onActualizado,
}: Props) {
  const [cargando, setCargando] = useState(true);
  const [detalle, setDetalle] = useState<DetalleCorreo | null>(null);
  const [correoInstitucional, setCorreoInstitucional] = useState('');
  const [usuarioGenerado, setUsuarioGenerado] = useState('');
  const [correoSecundario, setCorreoSecundario] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    getSolicitudCorreoDetalle(folio)
      .then(({ solicitud }) => {
        if (!activo) return;
        setDetalle(solicitud as DetalleCorreo);
        setCorreoInstitucional((solicitud as any).correo_institucional ?? '');
        setUsuarioGenerado((solicitud as any).usuario_generado ?? '');
        setCorreoSecundario((solicitud as any).correo_secundario ?? '');
        setTelefonoContacto((solicitud as any).telefono_contacto ?? '');
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

    if (!correoInstitucional.trim()) {
      setError('El correo institucional asignado es obligatorio.');
      return;
    }
    if (!correoSecundario.trim()) {
      setError('El correo secundario es obligatorio.');
      return;
    }
    if (!telefonoContacto.trim()) {
      setError('El teléfono de contacto es obligatorio.');
      return;
    }

    setGuardando(true);
    try {
      await onGuardar({
        correo_institucional: correoInstitucional.trim(),
        usuario_generado: usuarioGenerado.trim() || null,
        correo_secundario: correoSecundario.trim(),
        telefono_contacto: telefonoContacto.trim(),
      });
      onActualizado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo actualizar el correo asignado.');
    } finally {
      setGuardando(false);
    }
  };

  const campoGris = 'w-full border border-blue-200 rounded-lg p-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed shadow-xs';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-6 border border-blue-100 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-blue-800 bg-blue-900">
          <h2 className="text-base font-bold text-white">
            Editar correo institucional asignado — Folio: {folio}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-gray-500 text-sm">Cargando información…</div>
        ) : (
          <div className="px-6 py-5 space-y-5 max-h-[72vh] overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 font-medium shadow-xs">
                {error}
              </div>
            )}

            {/* Datos de la solicitud (solo lectura) */}
            <div className="border border-blue-200 rounded-lg overflow-hidden">
              <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">
                Datos de la Solicitud (solo lectura)
              </div>
              <div className="p-4 grid grid-cols-2 gap-3.5 bg-blue-50/10">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de solicitud</label>
                  <input disabled value={detalle?.tipo_solicitud?.toUpperCase() ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
                  <input disabled value={detalle?.nombre ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Puesto</label>
                  <input disabled value={detalle?.puesto ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Área interna</label>
                  <input disabled value={detalle?.area_interna ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Dependencia / Área</label>
                  <input disabled value={detalle?.area ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Extensión</label>
                  <input disabled value={detalle?.extension ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Oficio CGD</label>
                  <input disabled value={detalle?.oficio_cgd ?? '-'} className={campoGris} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Observaciones</label>
                  <textarea disabled value={detalle?.observaciones ?? '-'} rows={2} className={campoGris} />
                </div>
              </div>
            </div>

            {/* Datos editables */}
            <div className="border border-blue-200 rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-900 border-b border-blue-200">
                Datos Editables
              </div>
              <div className="p-4 grid grid-cols-2 gap-3.5 bg-white">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Correo secundario <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={correoSecundario}
                    onChange={(e) => setCorreoSecundario(e.target.value)}
                    className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Teléfono de contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={telefonoContacto}
                    onChange={(e) => setTelefonoContacto(e.target.value)}
                    className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Correo institucional asignado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={correoInstitucional}
                    onChange={(e) => setCorreoInstitucional(e.target.value)}
                    className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="usuario@oaxaca.gob.mx"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Usuario generado</label>
                  <input
                    type="text"
                    value={usuarioGenerado}
                    onChange={(e) => setUsuarioGenerado(e.target.value)}
                    className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-blue-100 bg-blue-50/20">
          <button
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 font-medium disabled:opacity-50 transition shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando || cargando}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition shadow-sm"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}