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

  const campoGris = 'w-full border rounded p-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-6">
        <div className="flex justify-between items-center px-5 py-4 border-b bg-blue-600 rounded-t-lg">
          <h2 className="text-lg font-semibold text-white">
            Editar correo institucional asignado — Folio: {folio}
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
                <div>
                  <label className="text-xs font-medium text-gray-600">Tipo de solicitud</label>
                  <input disabled value={detalle?.tipo_solicitud?.toUpperCase() ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Nombre</label>
                  <input disabled value={detalle?.nombre ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Puesto</label>
                  <input disabled value={detalle?.puesto ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Área interna</label>
                  <input disabled value={detalle?.area_interna ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Dependencia / Área</label>
                  <input disabled value={detalle?.area ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Extensión</label>
                  <input disabled value={detalle?.extension ?? '-'} className={campoGris} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Oficio CGD</label>
                  <input disabled value={detalle?.oficio_cgd ?? '-'} className={campoGris} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600">Observaciones</label>
                  <textarea disabled value={detalle?.observaciones ?? '-'} rows={2} className={campoGris} />
                </div>
              </div>
            </div>

            {/* Datos editables */}
            <div className="border rounded">
              <div className="bg-blue-50 px-3 py-2 font-semibold text-sm border-b text-blue-800">
                Datos Editables
              </div>
              <div className="p-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo secundario <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={correoSecundario}
                    onChange={(e) => setCorreoSecundario(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={telefonoContacto}
                    onChange={(e) => setTelefonoContacto(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo institucional asignado <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={correoInstitucional}
                    onChange={(e) => setCorreoInstitucional(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                    placeholder="usuario@oaxaca.gob.mx"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuario generado</label>
                  <input
                    type="text"
                    value={usuarioGenerado}
                    onChange={(e) => setUsuarioGenerado(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
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