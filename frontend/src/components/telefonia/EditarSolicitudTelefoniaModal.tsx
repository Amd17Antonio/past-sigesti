import { useEffect, useState } from 'react';
import {
  actualizarSolicitudTelefonia,
  getSolicitudTelefoniaDetalle,
  getCategoriasTelefonia,
} from '../../services/solicitudTelefoniaService';

interface Props {
  solicitud: { id: number; tramite: string; estatus: string };
  onClose: () => void;
  onActualizado: () => void;
}

const campoEditableClase = 'border border-slate-300 rounded px-3 py-2 text-sm w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClase = 'text-xs font-semibold uppercase text-slate-600 mb-1 block';

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClase}>{label}</label>
      {children}
    </div>
  );
}

export default function EditarSolicitudTelefoniaModal({ solicitud, onClose, onActualizado }: Props) {
  const [cargando, setCargando] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  // `detalle` guarda el objeto tal cual viene/va a la solicitud, según el trámite.
  const [detalle, setDetalle] = useState<Record<string, any>>({});
  const [categorias, setCategorias] = useState<{ id: number; categoria: string }[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');

    Promise.all([
      getSolicitudTelefoniaDetalle(solicitud.id),
      solicitud.tramite === 'CAMBIO_CATEGORIA' ? getCategoriasTelefonia() : Promise.resolve([])
    ])
      .then(([resDetalle, listaCategorias]) => {
        if (!activo) return;
        const s = resDetalle.solicitud;
        setObservaciones(s.observaciones ?? '');
        setDetalle(s.detalle ?? {});
        if (solicitud.tramite === 'CAMBIO_CATEGORIA') {
          setCategorias(listaCategorias as { id: number; categoria: string }[]);
        }
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar la información de la solicitud.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [solicitud.id, solicitud.tramite]);

  const setCampo = (name: string, value: any) => setDetalle((d) => ({ ...d, [name]: value }));

  const setCampoAnidado = (grupo: string, name: string, value: any) =>
    setDetalle((d) => ({ ...d, [grupo]: { ...(d[grupo] ?? {}), [name]: value } }));

  const handleGuardar = async () => {
    setEnviando(true);
    setError('');
    try {
      await actualizarSolicitudTelefonia(solicitud.id, {
        observaciones: observaciones || undefined,
        detalle,
      });
      onActualizado();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo actualizar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  const renderCamposPorTramite = () => {
    switch (solicitud.tramite) {
      case 'CAMBIO_PIN_CN':
        return (
          <>
            <Campo label="Motivo del cambio:">
              <select
                value={detalle.motivo_cambio ?? 'Extravío'}
                onChange={(e) => setCampo('motivo_cambio', e.target.value)}
                className={campoEditableClase}
              >
                <option value="Extravío">Extravío</option>
                <option value="Olvido">Olvido</option>
                <option value="Otro">Otro</option>
              </select>
            </Campo>
            <Campo label="Correo de notificación:">
              <input
                value={detalle.correo_notificacion ?? ''}
                onChange={(e) => setCampo('correo_notificacion', e.target.value)}
                className={campoEditableClase}
              />
            </Campo>
          </>
        );

      case 'CAMBIO_DID':
        return (
          <>
            <Campo label="Nueva extensión:">
              <input
                value={detalle.nueva_extension ?? ''}
                onChange={(e) => setCampo('nueva_extension', e.target.value)}
                className={campoEditableClase}
              />
            </Campo>
            <Campo label="Número DID:">
              <input
                value={detalle.numero_did ?? ''}
                onChange={(e) => setCampo('numero_did', e.target.value)}
                className={campoEditableClase}
              />
            </Campo>
            <Campo label="Justificación:">
              <textarea
                value={detalle.justificacion ?? ''}
                onChange={(e) => setCampo('justificacion', e.target.value)}
                rows={2}
                className={campoEditableClase}
              />
            </Campo>
          </>
        );

      case 'CAMBIO_CATEGORIA':
        return (
          <>
            <Campo label="Clave de puesto:">
              <input
                value={detalle.clave_puesto ?? ''}
                onChange={(e) => setCampo('clave_puesto', e.target.value)}
                className={campoEditableClase}
              />
            </Campo>
            <Campo label="Puesto:">
              <input
                value={detalle.puesto ?? ''}
                onChange={(e) => setCampo('puesto', e.target.value)}
                className={campoEditableClase}
              />
            </Campo>
            <Campo label="Dirección:">
              <input
                value={detalle.direccion ?? ''}
                onChange={(e) => setCampo('direccion', e.target.value)}
                className={campoEditableClase}
              />
            </Campo>
            <Campo label="Correo institucional:">
              <input
                value={detalle.correo_institucional ?? ''}
                onChange={(e) => setCampo('correo_institucional', e.target.value)}
                className={campoEditableClase}
              />
            </Campo>
            <Campo label="Categoría:">
              <select
                value={detalle.categoria_id ?? ''}
                onChange={(e) => setCampo('categoria_id', e.target.value ? Number(e.target.value) : '')}
                className={campoEditableClase}
              >
                <option value="">Selecciona...</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.categoria}</option>)}
              </select>
            </Campo>
            <Campo label="Justificación:">
              <textarea
                value={detalle.justificacion ?? ''}
                onChange={(e) => setCampo('justificacion', e.target.value)}
                rows={2}
                className={campoEditableClase}
              />
            </Campo>
          </>
        );

      case 'CAMBIO_USUARIO': {
        const n = detalle.nuevo_usuario ?? {};
        return (
          <>
            <div className="bg-blue-50 text-blue-900 font-semibold px-3 py-1.5 rounded border border-blue-100 text-sm">
              Datos del nuevo usuario que quedará en esta extensión:
            </div>
            <Campo label="Nombre:">
              <input value={n.nombre ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'nombre', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Apellido paterno:">
              <input value={n.apellido_paterno ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'apellido_paterno', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Apellido materno:">
              <input value={n.apellido_materno ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'apellido_materno', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="RFC:">
              <input value={n.rfc ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'rfc', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="CURP:">
              <input value={n.curp ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'curp', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Clave de puesto:">
              <input value={n.clave_puesto ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'clave_puesto', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Correo institucional:">
              <input value={n.correo_institucional ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'correo_institucional', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Dirección:">
              <input value={n.direccion ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'direccion', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Nodo:">
              <input value={n.nodo ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'nodo', e.target.value)} className={campoEditableClase} />
            </Campo>
          </>
        );
      }

      case 'MODIFICAR_DATOS': {
        const c = detalle.campos_modificados ?? {};
        return (
          <>
            <div className="bg-blue-50 text-blue-900 font-semibold px-3 py-1.5 rounded border border-blue-100 text-sm">
              Datos que se aplicarán al usuario al activar:
            </div>
            <Campo label="Nombre:">
              <input value={c.nombre ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'nombre', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Apellido paterno:">
              <input value={c.apellido_paterno ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'apellido_paterno', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Apellido materno:">
              <input value={c.apellido_materno ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'apellido_materno', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Puesto:">
              <input value={c.puesto ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'puesto', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Correo institucional:">
              <input value={c.correo_institucional ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'correo_institucional', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Dirección:">
              <input value={c.direccion ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'direccion', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Ubicación:">
              <input value={c.ubicacion ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'ubicacion', e.target.value)} className={campoEditableClase} />
            </Campo>
            <Campo label="Nivel:">
              <input value={c.nivel ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'nivel', e.target.value)} className={campoEditableClase} />
            </Campo>
          </>
        );
      }

      case 'JEFE_SECRETARIA':
        return (
          <label className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded border border-slate-200">
            <input
              type="checkbox"
              checked={!!detalle.mismos_privilegios}
              onChange={(e) => setCampo('mismos_privilegios', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            Mismos privilegios
          </label>
        );

      case 'OTROS':
        return (
          <>
            <Campo label="Extensión (es):">
              <textarea value={detalle.extensiones ?? ''} onChange={(e) => setCampo('extensiones', e.target.value)} rows={2} className={campoEditableClase} />
            </Campo>
            <Campo label="Nodo (s):">
              <textarea value={detalle.nodos ?? ''} onChange={(e) => setCampo('nodos', e.target.value)} rows={2} className={campoEditableClase} />
            </Campo>
            <Campo label="Descripción del problema:">
              <textarea value={detalle.descripcion_problema ?? ''} onChange={(e) => setCampo('descripcion_problema', e.target.value)} rows={3} className={campoEditableClase} />
            </Campo>
          </>
        );

      case 'SOLICITAR_TELEFONO':
      default:
        return (
          <div className="bg-slate-50 text-slate-600 text-sm p-3 rounded border border-slate-200">
            Este trámite no tiene datos adicionales editables aquí; solo la observación.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-blue-100 flex flex-col">
        {/* Cabecera */}
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span className="text-base">Editar solicitud #{solicitud.id} — {solicitud.tramite.replace(/_/g, ' ')}</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-sm">
          {cargando ? (
            <div className="p-8 text-center text-slate-500 text-sm flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>Cargando información...</span>
            </div>
          ) : (
            <>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2 font-medium">{error}</p>
              )}

              {renderCamposPorTramite()}

              <div>
                <label className={labelClase}>Observaciones:</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  className={campoEditableClase}
                />
              </div>
            </>
          )}
        </div>

        {/* Pie */}
        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={enviando || cargando}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition text-sm font-medium shadow-sm"
          >
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}