import { useEffect, useState } from 'react';
import { colorPorEstatus } from '../../utils/estatusColor';

export interface EstatusOpcion {
  value: string;
  label: string;
}

export interface DetalleCampo {
  label: string;
  value: React.ReactNode;
}

export interface CampoActivacion {
  name: string;
  label: string;
  tipo?: 'text' | 'select';
  opciones?: { value: string; label: string }[];
  requerido?: boolean;
  placeholder?: string;
}

interface Props {
  folio: number;
  estatusActual: string;
  opciones: EstatusOpcion[];
  estatusQueRequiereFolio: string;
  estatusActivo: string;
  estatusBaja: string;
  /**
   * Orden lineal de los estatus "de avance" (sin incluir baja), del primero al último,
   * p.ej. ['creado_cgd', 'atendiendo_dgti', 'activo'].
   * Se usa para no dejar seleccionar un paso anterior al actual ni saltar etapas.
   * Si no se pasa, no se restringe nada (se muestran todas las `opciones`).
   */
  orden?: string[];
  /** Campos extra que se piden solo cuando el nuevo estatus === estatusActivo (p.ej. extensión/DID/clave en telefonía, correo asignado en correo) */
  camposActivacion?: CampoActivacion[];
  onGuardar: (payload: Record<string, any>) => Promise<void>;
  onClose: () => void;
  onActualizado: () => void;
  cargarInfoGeneral?: () => Promise<DetalleCampo[]>;
}

export default function CambiarEstatusModal({
  folio,
  estatusActual,
  opciones,
  estatusQueRequiereFolio,
  estatusActivo,
  estatusBaja,
  orden,
  camposActivacion,
  onGuardar,
  onClose,
  onActualizado,
  cargarInfoGeneral,
}: Props) {
  const [tab, setTab] = useState<'estatus' | 'info'>('estatus');
  const [nuevoEstatus, setNuevoEstatus] = useState(estatusActual);
  const [folioGlpi, setFolioGlpi] = useState('');
  const [observacionGlpi, setObservacionGlpi] = useState('');
  const [motivoBaja, setMotivoBaja] = useState('');
  const [valoresActivacion, setValoresActivacion] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [infoCampos, setInfoCampos] = useState<DetalleCampo[] | null>(null);
  const [infoCargando, setInfoCargando] = useState(false);
  const [infoError, setInfoError] = useState('');

  const labelActual = opciones.find((o) => o.value === estatusActual)?.label ?? estatusActual;
  const esActivar = nuevoEstatus === estatusActivo;
  const esBaja = nuevoEstatus === estatusBaja;
  const requiereFolio = nuevoEstatus === estatusQueRequiereFolio;

  // Ya está en un estatus terminal (baja): no se permite cambiar nada más.
  const esTerminal = estatusActual === estatusBaja;

  // Filtra las opciones visibles según el flujo lineal definido en `orden`:
  // solo se permite quedarse en el estatus actual, avanzar al SIGUIENTE inmediato,
  // o pasar a baja. No se puede regresar a un paso anterior ni saltar etapas.
  const opcionesDisponibles = (() => {
    if (!orden || orden.length === 0) return opciones;
    if (esTerminal) return opciones.filter((o) => o.value === estatusBaja);
    const idxActual = orden.indexOf(estatusActual);
    if (idxActual === -1) return opciones; // estatus no contemplado en el orden, no restringe
    const siguiente = orden[idxActual + 1]; // undefined si ya es el último paso
    return opciones.filter(
      (o) => o.value === estatusBaja || o.value === estatusActual || o.value === siguiente,
    );
  })();

  useEffect(() => {
    if (tab === 'info' && cargarInfoGeneral && infoCampos === null && !infoCargando) {
      setInfoCargando(true);
      setInfoError('');
      cargarInfoGeneral()
        .then(setInfoCampos)
        .catch(() => setInfoError('No se pudo cargar la información general.'))
        .finally(() => setInfoCargando(false));
    }
  }, [tab, cargarInfoGeneral, infoCampos, infoCargando]);

  const handleCampoActivacion = (name: string, value: string) => {
    setValoresActivacion((prev) => ({ ...prev, [name]: value }));
  };

  const handleAplicar = async () => {
    setError('');
    if (requiereFolio && !folioGlpi.trim()) {
      setError('El folio GLPI es obligatorio para este estatus.');
      return;
    }
    if (esBaja && motivoBaja.trim().length < 5) {
      setError('Describe el motivo de baja con más detalle.');
      return;
    }
    if (esActivar && camposActivacion) {
      for (const campo of camposActivacion) {
        if (campo.requerido && !(valoresActivacion[campo.name] ?? '').trim()) {
          setError(`El campo "${campo.label}" es obligatorio para activar el servicio.`);
          return;
        }
      }
    }

    setEnviando(true);
    try {
      const payload: Record<string, any> = {
        estatus: nuevoEstatus,
        folio_glpi: requiereFolio ? folioGlpi : undefined,
        observacion_glpi: requiereFolio ? (observacionGlpi || undefined) : undefined,
        motivo_baja: esBaja ? motivoBaja : undefined,
      };

      if (esActivar && camposActivacion) {
        for (const campo of camposActivacion) {
          const val = valoresActivacion[campo.name];
          if (val !== undefined && val !== '') payload[campo.name] = val;
        }
      }

      await onGuardar(payload);
      onActualizado();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo actualizar el estatus.');
    } finally {
      setEnviando(false);
    }
  };

  const colorBoton = esActivar ? '#16A34A' : esBaja ? '#DC2626' : '#1D4ED8';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 pt-5">
          <h2 className="text-xl font-medium">Folio: {folio}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        <div className="flex gap-6 border-b px-6 mt-3">
          <button
            onClick={() => setTab('estatus')}
            className={`pb-2 text-sm font-medium ${
              tab === 'estatus' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-500'
            }`}
          >
            CAMBIAR EL ESTATUS
          </button>
          {cargarInfoGeneral && (
            <button
              onClick={() => setTab('info')}
              className={`pb-2 text-sm font-medium ${
                tab === 'info' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-500'
              }`}
            >
              INFORMACIÓN GENERAL
            </button>
          )}
        </div>

        <div className="overflow-y-auto">
          {tab === 'estatus' ? (
            <div className="p-6 space-y-4">
              <p className="text-lg">
                Estado actual:{' '}
                <span className="uppercase font-medium" style={{ color: colorPorEstatus(estatusActual) }}>
                  {labelActual}
                </span>
              </p>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">NUEVO ESTATUS</label>
                <select
                  value={nuevoEstatus}
                  onChange={(e) => setNuevoEstatus(e.target.value)}
                  className="border rounded p-2 w-full uppercase disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={esTerminal}
                >
                  {opcionesDisponibles.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {esTerminal && (
                <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded p-2">
                  Esta solicitud ya fue dada de baja y no admite más cambios de estatus.
                </p>
              )}

              {requiereFolio && (
                <>
                  <div>
                    <label className="text-sm font-medium block mb-1">Folio GLPI:</label>
                    <input
                      value={folioGlpi}
                      onChange={(e) => setFolioGlpi(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Observaciones del sistema GLPI:</label>
                    <textarea
                      value={observacionGlpi}
                      onChange={(e) => setObservacionGlpi(e.target.value)}
                      rows={3}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                </>
              )}

              {esActivar && camposActivacion && camposActivacion.length > 0 && (
                <div className="border rounded p-3 bg-green-50 space-y-3">
                  <p className="text-xs font-medium text-green-700 uppercase">Datos del servicio activo</p>
                  {camposActivacion.map((campo) => (
                    <div key={campo.name}>
                      <label className="text-sm font-medium block mb-1">
                        {campo.label}
                        {campo.requerido && <span className="text-red-500"> *</span>}
                      </label>
                      {campo.tipo === 'select' ? (
                        <select
                          value={valoresActivacion[campo.name] ?? ''}
                          onChange={(e) => handleCampoActivacion(campo.name, e.target.value)}
                          className="border rounded p-2 w-full"
                        >
                          <option value="">Selecciona...</option>
                          {campo.opciones?.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={valoresActivacion[campo.name] ?? ''}
                          onChange={(e) => handleCampoActivacion(campo.name, e.target.value)}
                          placeholder={campo.placeholder}
                          className="border rounded p-2 w-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {esBaja && (
                <div>
                  <label className="text-sm font-medium block mb-1">Motivo de baja:</label>
                  <textarea
                    value={motivoBaja}
                    onChange={(e) => setMotivoBaja(e.target.value)}
                    rows={3}
                    className="border rounded p-2 w-full"
                  />
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end">
                <button
                  onClick={handleAplicar}
                  disabled={enviando || esTerminal}
                  style={{ backgroundColor: colorBoton }}
                  className="text-white px-5 py-2 rounded disabled:opacity-50"
                >
                  {enviando ? 'Aplicando...' : esActivar ? 'Activar' : 'Aplicar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-0">
              {infoCargando && <p className="text-gray-500 p-6">Cargando información...</p>}
              {infoError && <p className="text-red-500 p-6">{infoError}</p>}
              {infoCampos && (
                <table className="w-full text-sm border-t">
                  <tbody>
                    {infoCampos.map((c, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-3 font-medium text-right w-1/3 align-top text-gray-700 border-r">
                          {c.label}:
                        </td>
                        <td className="p-3 whitespace-pre-line">{c.value ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
