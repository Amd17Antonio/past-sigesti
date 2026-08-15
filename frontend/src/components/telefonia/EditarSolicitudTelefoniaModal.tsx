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

const inputClass = 'border p-2 w-full text-sm';

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
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
    getSolicitudTelefoniaDetalle(solicitud.id).then(({ solicitud: s }) => {
      setObservaciones(s.observaciones ?? '');
      setDetalle(s.detalle ?? {});
      setCargando(false);
    });
    if (solicitud.tramite === 'CAMBIO_CATEGORIA') {
      getCategoriasTelefonia().then(setCategorias);
    }
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
              />
            </Campo>
            <Campo label="Número DID:">
              <input
                value={detalle.numero_did ?? ''}
                onChange={(e) => setCampo('numero_did', e.target.value)}
                className={inputClass}
              />
            </Campo>
            <Campo label="Justificación:">
              <textarea
                value={detalle.justificacion ?? ''}
                onChange={(e) => setCampo('justificacion', e.target.value)}
                rows={2}
                className={inputClass}
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
                className={inputClass}
              />
            </Campo>
            <Campo label="Puesto:">
              <input
                value={detalle.puesto ?? ''}
                onChange={(e) => setCampo('puesto', e.target.value)}
                className={inputClass}
              />
            </Campo>
            <Campo label="Dirección:">
              <input
                value={detalle.direccion ?? ''}
                onChange={(e) => setCampo('direccion', e.target.value)}
                className={inputClass}
              />
            </Campo>
            <Campo label="Correo institucional:">
              <input
                value={detalle.correo_institucional ?? ''}
                onChange={(e) => setCampo('correo_institucional', e.target.value)}
                className={inputClass}
              />
            </Campo>
            <Campo label="Categoría:">
              <select
                value={detalle.categoria_id ?? ''}
                onChange={(e) => setCampo('categoria_id', e.target.value ? Number(e.target.value) : '')}
                className={inputClass}
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
                className={inputClass}
              />
            </Campo>
          </>
        );

      case 'CAMBIO_USUARIO': {
        const n = detalle.nuevo_usuario ?? {};
        return (
          <>
            <p className="text-xs text-gray-500">Datos del nuevo usuario que quedará en esta extensión:</p>
            <Campo label="Nombre:">
              <input value={n.nombre ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'nombre', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Apellido paterno:">
              <input value={n.apellido_paterno ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'apellido_paterno', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Apellido materno:">
              <input value={n.apellido_materno ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'apellido_materno', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="RFC:">
              <input value={n.rfc ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'rfc', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="CURP:">
              <input value={n.curp ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'curp', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Clave de puesto:">
              <input value={n.clave_puesto ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'clave_puesto', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Correo institucional:">
              <input value={n.correo_institucional ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'correo_institucional', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Dirección:">
              <input value={n.direccion ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'direccion', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Nodo:">
              <input value={n.nodo ?? ''} onChange={(e) => setCampoAnidado('nuevo_usuario', 'nodo', e.target.value)} className={inputClass} />
            </Campo>
          </>
        );
      }

      case 'MODIFICAR_DATOS': {
        const c = detalle.campos_modificados ?? {};
        return (
          <>
            <p className="text-xs text-gray-500">Datos que se aplicarán al usuario al activar:</p>
            <Campo label="Nombre:">
              <input value={c.nombre ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'nombre', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Apellido paterno:">
              <input value={c.apellido_paterno ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'apellido_paterno', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Apellido materno:">
              <input value={c.apellido_materno ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'apellido_materno', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Puesto:">
              <input value={c.puesto ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'puesto', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Correo institucional:">
              <input value={c.correo_institucional ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'correo_institucional', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Dirección:">
              <input value={c.direccion ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'direccion', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Ubicación:">
              <input value={c.ubicacion ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'ubicacion', e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Nivel:">
              <input value={c.nivel ?? ''} onChange={(e) => setCampoAnidado('campos_modificados', 'nivel', e.target.value)} className={inputClass} />
            </Campo>
          </>
        );
      }

      case 'JEFE_SECRETARIA':
        return (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!detalle.mismos_privilegios}
              onChange={(e) => setCampo('mismos_privilegios', e.target.checked)}
            />
            Mismos privilegios
          </label>
        );

      case 'OTROS':
        return (
          <>
            <Campo label="Extensión (es):">
              <textarea value={detalle.extensiones ?? ''} onChange={(e) => setCampo('extensiones', e.target.value)} rows={2} className={inputClass} />
            </Campo>
            <Campo label="Nodo (s):">
              <textarea value={detalle.nodos ?? ''} onChange={(e) => setCampo('nodos', e.target.value)} rows={2} className={inputClass} />
            </Campo>
            <Campo label="Descripción del problema:">
              <textarea value={detalle.descripcion_problema ?? ''} onChange={(e) => setCampo('descripcion_problema', e.target.value)} rows={3} className={inputClass} />
            </Campo>
          </>
        );

      case 'SOLICITAR_TELEFONO':
      default:
        // Los datos personales de este trámite viven en usuarios_telefonia (se
        // capturaron al crear el usuario), no en `detalle`; aquí solo se edita
        // la observación general de la solicitud.
        return (
          <p className="text-xs text-gray-500">
            Este trámite no tiene datos adicionales editables aquí; solo la observación.
          </p>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-[26rem] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold shrink-0">
          Editar solicitud #{solicitud.id} — {solicitud.tramite.replace(/_/g, ' ')}
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {cargando ? (
            <p className="text-gray-500 text-sm">Cargando...</p>
          ) : (
            <>
              {renderCamposPorTramite()}

              <div>
                <label className="text-sm font-medium block mb-1">Observaciones:</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  className={inputClass}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t shrink-0">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm">Cancelar</button>
          <button
            onClick={handleGuardar}
            disabled={enviando || cargando}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50"
          >
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
