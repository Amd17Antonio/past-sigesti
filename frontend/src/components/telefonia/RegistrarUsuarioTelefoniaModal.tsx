import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import { getCategoriasTelefonia, registrarUsuarioTelefonia } from '../../services/solicitudTelefoniaService';

interface Opcion { id: number; [key: string]: any }

interface Props {
  extension: string;
  onClose: () => void;
  onRegistrado: (usuario: any) => void;
}

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
    getCatalogo('areas').then((r) => setAreas(r.registros));
    getCategoriasTelefonia().then(setCategorias);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!form.nombre) {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded shadow-lg w-[28rem] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold">Registrar Usuario de Telefonía</div>

        <div className="p-4 space-y-3 overflow-y-auto">
          <p className="text-xs text-gray-500">Extensión: <strong>{extension}</strong></p>

          <input name="nombre" placeholder="Nombre(s)" value={form.nombre} onChange={handleChange} className="border p-2 w-full" />
          <input name="apellido_paterno" placeholder="Apellido paterno" value={form.apellido_paterno} onChange={handleChange} className="border p-2 w-full" />
          <input name="apellido_materno" placeholder="Apellido materno" value={form.apellido_materno} onChange={handleChange} className="border p-2 w-full" />
          <input name="puesto" placeholder="Puesto" value={form.puesto} onChange={handleChange} className="border p-2 w-full" />

          <select name="area_id" value={form.area_id} onChange={handleChange} className="border p-2 w-full">
            <option value="">--Área--</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
          </select>

          <input name="correo_institucional" placeholder="Correo institucional" value={form.correo_institucional} onChange={handleChange} className="border p-2 w-full" />

          <div className="grid grid-cols-3 gap-2">
            <input name="edificio" placeholder="Edificio" value={form.edificio} onChange={handleChange} className="border p-2" />
            <input name="nodo" placeholder="Nodo" value={form.nodo} onChange={handleChange} className="border p-2" />
            <input name="nivel" placeholder="Nivel" value={form.nivel} onChange={handleChange} className="border p-2" />
          </div>

          <select name="categoria_id" value={form.categoria_id} onChange={handleChange} className="border p-2 w-full">
            <option value="">--Categoría--</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.categoria}</option>)}
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-orange-500 text-white rounded text-sm">✕ Cancelar</button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50">
            💾 {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}