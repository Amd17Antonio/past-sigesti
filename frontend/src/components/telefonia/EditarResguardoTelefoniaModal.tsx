import { useEffect, useState } from 'react';
import { getCatalogoTelefonos, actualizarTelefono } from '../../services/catalogoTelefoniaService';
import { getCategoriasTelefonia } from '../../services/solicitudTelefoniaService';

interface Props {
  extension: string;
  onClose: () => void;
  onActualizado: () => void;
}

interface UsuarioTelefonia {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  rfc: string | null;
  curp: string | null;
  clave_puesto: string | null;
  puesto: string | null;
  nivel_puesto: string | null;
  dependencia: string | null;
  area_especifica: string | null;
  correo_institucional: string | null;
  correo_externo: string | null;
  correo_jefe: string | null;
  extension: string;
  did: string | null;
  mac: string | null;
  modelo: string | null;
  numero_serie: string | null;
  edificio: string | null;
  nodo: string | null;
  nivel: string | null;
  status: string | null;
  observaciones: string | null;
  categoria_id: number | null;
  categoria?: string | null;
  justificacion_categoria: string | null;
  jefe_id: number | null;
  vinculado_como_secretaria_de?: string | null;
}

interface Categoria {
  id: number;
  categoria: string;
}

const OPCIONES_STATUS = ['Activo', 'Suspendido', 'Baja', 'Mantenimiento'];

const campoReadOnlyClase = 'border border-slate-200 bg-slate-100 rounded px-3 py-2 text-sm w-full text-slate-600';
const campoEditableClase = 'border border-slate-300 rounded px-3 py-2 text-sm w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClase = 'text-xs font-semibold uppercase text-slate-600 mb-1 block';

export default function EditarResguardoTelefoniaModal({ extension, onClose, onActualizado }: Props) {
  const [usuario, setUsuario] = useState<UsuarioTelefonia | null>(null);
  const [todosLosUsuarios, setTodosLosUsuarios] = useState<UsuarioTelefonia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Campos editables
  const [nivelPuesto, setNivelPuesto] = useState('');
  const [correoJefe, setCorreoJefe] = useState('');
  const [jefeId, setJefeId] = useState<string>('');
  const [modelo, setModelo] = useState('');
  const [categoriaId, setCategoriaId] = useState<string>('');
  const [justificacion, setJustificacion] = useState('');
  const [status, setStatus] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [edificio, setEdificio] = useState('');
  const [nodo, setNodo] = useState('');
  const [nivel, setNivel] = useState('');

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');

    Promise.all([getCatalogoTelefonos(), getCategoriasTelefonia()])
      .then(([todos, listaCategorias]) => {
        if (!activo) return;
        const lista = todos as UsuarioTelefonia[];
        const encontrado = lista.find((u) => u.extension === extension);
        if (!encontrado) {
          setError('No se encontró el usuario con esa extensión.');
          return;
        }
        setUsuario(encontrado);
        setTodosLosUsuarios(lista);
        setCategorias(listaCategorias);
        setNivelPuesto(encontrado.nivel_puesto ?? '');
        setCorreoJefe(encontrado.correo_jefe ?? '');
        setJefeId(encontrado.jefe_id ? String(encontrado.jefe_id) : '');
        setModelo(encontrado.modelo ?? '');
        setCategoriaId(encontrado.categoria_id ? String(encontrado.categoria_id) : '');
        setJustificacion(encontrado.justificacion_categoria ?? '');
        setStatus(encontrado.status ?? '');
        setObservaciones(encontrado.observaciones ?? '');
        setEdificio(encontrado.edificio ?? '');
        setNodo(encontrado.nodo ?? '');
        setNivel(encontrado.nivel ?? '');
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar la información del usuario.');
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [extension]);

  const handleGuardar = async () => {
    if (!usuario) return;
    setGuardando(true);
    setError('');
    try {
      await actualizarTelefono(usuario.id, {
        nivel_puesto: nivelPuesto || null,
        correo_jefe: correoJefe || null,
        jefe_id: jefeId ? Number(jefeId) : null,
        modelo: modelo || null,
        categoria_id: categoriaId ? Number(categoriaId) : null,
        justificacion_categoria: justificacion || null,
        status: status || null,
        observaciones: observaciones || null,
        edificio: edificio || null,
        nodo: nodo || null,
        nivel: nivel || null,
      });
      onActualizado();
      onClose();
    } catch {
      setError('No se pudo guardar la información. Verifica los datos e intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-blue-100 flex flex-col">
        {/* Cabecera */}
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span className="text-base">Editar Resguardo de Telefonía</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-slate-500 text-sm flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Cargando información...</span>
          </div>
        ) : !usuario ? (
          <div className="p-8 text-center text-red-600 text-sm bg-red-50 border border-red-200 m-4 rounded">{error || 'No se encontró el usuario.'}</div>
        ) : (
          <div className="p-5 overflow-y-auto flex-1 space-y-4 text-sm">
            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2 font-medium">{error}</p>
            )}

            <div className="bg-blue-50 text-blue-900 font-semibold px-3 py-1.5 rounded border border-blue-100 text-sm">
              INFORMACIÓN PERSONAL
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClase}>Nombre:</label>
                <div className={campoReadOnlyClase}>{usuario.nombre}</div>
              </div>
              <div>
                <label className={labelClase}>Apellido Paterno:</label>
                <div className={campoReadOnlyClase}>{usuario.apellido_paterno || '-'}</div>
              </div>
              <div>
                <label className={labelClase}>Apellido Materno:</label>
                <div className={campoReadOnlyClase}>{usuario.apellido_materno || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClase}>RFC:</label>
                <div className={campoReadOnlyClase}>{usuario.rfc || '-'}</div>
              </div>
              <div>
                <label className={labelClase}>CURP:</label>
                <div className={campoReadOnlyClase}>{usuario.curp || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClase}>Clave del puesto:</label>
                <div className={campoReadOnlyClase}>{usuario.clave_puesto || '-'}</div>
              </div>
              <div>
                <label className={labelClase}>Nivel del puesto:</label>
                <input
                  value={nivelPuesto}
                  onChange={(e) => setNivelPuesto(e.target.value)}
                  className={campoEditableClase}
                />
              </div>
              <div>
                <label className={labelClase}>Puesto:</label>
                <div className={campoReadOnlyClase}>{usuario.puesto || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClase}>Jefe Superior:</label>
                <select
                  value={jefeId}
                  onChange={(e) => setJefeId(e.target.value)}
                  className={campoEditableClase}
                >
                  <option value="">Sin jefe asignado</option>
                  {todosLosUsuarios
                    .filter((u) => u.id !== usuario.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} {u.apellido_paterno ?? ''} {u.apellido_materno ?? ''}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className={labelClase}>Correo del Jefe:</label>
                <input
                  value={correoJefe}
                  onChange={(e) => setCorreoJefe(e.target.value)}
                  className={campoEditableClase}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClase}>Enlace:</label>
                <div className={campoReadOnlyClase}>{usuario.vinculado_como_secretaria_de || '-'}</div>
              </div>
              <div>
                <label className={labelClase}>Dependencia:</label>
                <div className={campoReadOnlyClase}>{usuario.dependencia || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClase}>Área Específica:</label>
                <div className={campoReadOnlyClase}>{usuario.area_especifica || '-'}</div>
              </div>
              <div>
                <label className={labelClase}>Correo Institucional:</label>
                <div className={campoReadOnlyClase}>{usuario.correo_institucional || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClase}>Correo Externo:</label>
                <div className={campoReadOnlyClase}>{usuario.correo_externo || '-'}</div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-900 font-semibold px-3 py-1.5 rounded border border-blue-100 text-sm">
              INFORMACIÓN DEL EQUIPO TELEFÓNICO
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClase}>Extensión:</label>
                <div className={campoReadOnlyClase}>{usuario.extension}</div>
              </div>
              <div>
                <label className={labelClase}>MAC:</label>
                <div className={campoReadOnlyClase}>{usuario.mac || '-'}</div>
              </div>
              <div>
                <label className={labelClase}>No. Serie:</label>
                <div className={campoReadOnlyClase}>{usuario.numero_serie || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClase}>Modelo:</label>
                <input
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className={campoEditableClase}
                />
              </div>
              <div>
                <label className={labelClase}>Categoría:</label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className={campoEditableClase}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClase}>Justificación de la categoría:</label>
              <textarea
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                rows={2}
                className={campoEditableClase}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClase}>Estatus Actual:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={campoEditableClase}
                >
                  <option value="">Selecciona...</option>
                  {OPCIONES_STATUS.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClase}>Observaciones del status:</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  className={campoEditableClase}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClase}>Edificio:</label>
                <input
                  value={edificio}
                  onChange={(e) => setEdificio(e.target.value)}
                  className={campoEditableClase}
                />
              </div>
              <div>
                <label className={labelClase}>Nodo:</label>
                <input
                  value={nodo}
                  onChange={(e) => setNodo(e.target.value)}
                  className={campoEditableClase}
                />
              </div>
              <div>
                <label className={labelClase}>Nivel:</label>
                <input
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className={campoEditableClase}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pie del modal */}
        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando || cargando || !usuario}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition text-sm font-medium shadow-sm"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}