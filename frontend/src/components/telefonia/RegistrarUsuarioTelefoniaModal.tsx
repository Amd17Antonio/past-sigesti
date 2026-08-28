import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import { getCategoriasTelefonia, registrarUsuarioTelefonia } from '../../services/solicitudTelefoniaService';

interface Opcion { id: number; [key: string]: any }

interface Props {
  extension: string;
  onClose: () => void;
  onRegistrado: (usuario: any) => void;
}

const inputClass = 'border border-slate-300 rounded px-3 py-2 text-sm w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

export default function RegistrarUsuarioTelefoniaModal({ extension, onClose, onRegistrado }: Props) {
  const [areas, setAreas] = useState<Opcion[]>([]);
  const [categorias, setCategorias] = useState<Opcion[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '',
    puesto: '', area_id: '', correo_institucional: '',
    edificio: '', nodo: '', nivel: '', categoria_id: '',
  });

  useEffect(() => {
    let activo = true;
    Promise.all([
      getCatalogo('areas'),
      getCategoriasTelefonia()
    ])
      .then(([resAreas, listaCategorias]) => {
        if (!activo) return;
        setAreas(resAreas.registros ?? []);
        setCategorias(listaCategorias ?? []);
      })
      .catch(() => {
        if (activo) setError('No se pudieron cargar los catálogos.');
      });

    return () => { activo = false; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setError('');
    setEnviando(true);
    try {
      const usuario = await registrarUsuarioTelefonia({
        ...form,
        area_id: form.area_id ? Number(form.area_id) : undefined,
        categoria_id: form.categoria_id ? Number(form.categoria_id) : undefined,
        extension,
      });
      onRegistrado(usuario);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el usuario.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden border border-blue-100 flex flex-col">
        {/* Cabecera */}
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center shrink-0">
          <span className="text-base">Registrar Usuario de Telefonía</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1 text-sm">
          <div className="bg-blue-50 text-blue-900 px-3 py-2 rounded border border-blue-100 flex justify-between items-center text-xs">
            <span>Extensión asignada:</span>
            <strong className="text-sm font-semibold">{extension}</strong>
          </div>

          <input name="nombre" placeholder="Nombre(s)" value={form.nombre} onChange={handleChange} className={inputClass} />
          <input name="apellido_paterno" placeholder="Apellido paterno" value={form.apellido_paterno} onChange={handleChange} className={inputClass} />
          <input name="apellido_materno" placeholder="Apellido materno" value={form.apellido_materno} onChange={handleChange} className={inputClass} />
          <input name="puesto" placeholder="Puesto" value={form.puesto} onChange={handleChange} className={inputClass} />

          <select name="area_id" value={form.area_id} onChange={handleChange} className={inputClass}>
            <option value="">-- Selecciona Área --</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
          </select>

          <input name="correo_institucional" placeholder="Correo institucional" value={form.correo_institucional} onChange={handleChange} className={inputClass} />

          <div className="grid grid-cols-3 gap-2">
            <input name="edificio" placeholder="Edificio" value={form.edificio} onChange={handleChange} className={inputClass} />
            <input name="nodo" placeholder="Nodo" value={form.nodo} onChange={handleChange} className={inputClass} />
            <input name="nivel" placeholder="Nivel" value={form.nivel} onChange={handleChange} className={inputClass} />
          </div>

          <select name="categoria_id" value={form.categoria_id} onChange={handleChange} className={inputClass}>
            <option value="">-- Selecciona Categoría --</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.categoria}</option>)}
          </select>

          {error && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 font-medium text-xs">
              {error}
            </p>
          )}
        </div>

        {/* Pie */}
        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={enviando}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition text-sm font-medium shadow-sm flex items-center gap-1.5"
          >
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}