import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import { getAsignables, crearSolicitud } from '../../services/solicitudService';

interface Opcion { id: number; [key: string]: any }
interface Tecnico { id: number; nombre: string }

interface Props {
  onClose: () => void;
  onCreado: () => void;
}

const TIPOS_DOCUMENTO = ['MEMORÁNDUM', 'TARJETA INFORMATIVA', 'CORREO ELECTRÓNICO', 'SOLICITUD VERBAL', 'SOLICITUD VÍA TELEFÓNICA', 'CIRCULAR'];

export default function CrearSolicitudModal({ onClose, onCreado }: Props) {
  const [areas, setAreas] = useState<Opcion[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    solicitante: '',
    puesto: '',
    tipo_documento: '',
    num_documento: '',
    fecha_memo: '',
    fecha_memo_recibido: '',
    id_area: '',
    id_soporte: '',
    descripcion: '',
    prioridad: '',
    extension: '',
    edificio: '',
    nivel: '',
  });

  useEffect(() => {
    getCatalogo('areas').then((r) => setAreas(r.registros));
    getAsignables().then(setTecnicos);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.solicitante || !form.id_area || !form.descripcion) {
      setError('Solicitante, Área y Descripción del problema son obligatorios.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitud({
        solicitante: form.solicitante,
        puesto: form.puesto || undefined,
        tipo_documento: form.tipo_documento || undefined,
        num_documento: form.num_documento || undefined,
        fecha_memo: form.fecha_memo || undefined,
        fecha_memo_recibido: form.fecha_memo_recibido || undefined,
        id_area: Number(form.id_area),
        descripcion: form.descripcion,
        prioridad: form.prioridad || undefined,
        extension: form.extension ? Number(form.extension) : undefined,
        edificio: form.edificio ? Number(form.edificio) : undefined,
        nivel: form.nivel || undefined,
        id_soporte: form.id_soporte ? Number(form.id_soporte) : undefined,
      });
      onCreado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo crear la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded p-6 w-[42rem] shadow-lg space-y-4">
        <h2 className="font-bold text-lg">Crear Solicitud</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Solicitante:</label>
            <input name="solicitante" placeholder="Ejemplo: C.P. Omar Pérez" value={form.solicitante} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Puesto <span className="text-red-400 text-xs">(Opcional)</span>:</label>
            <input name="puesto" placeholder="Ingresa el puesto" value={form.puesto} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Tipo documento <span className="text-red-400 text-xs">(Opcional)</span>:</label>
            <select name="tipo_documento" value={form.tipo_documento} onChange={handleChange} className="border p-2 w-full mt-1">
              <option value="">-- Seleccionar --</option>
              {TIPOS_DOCUMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">No. Documento <span className="text-red-400 text-xs">(Opcional)</span>:</label>
            <input name="num_documento" value={form.num_documento} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Fecha de memorándum:</label>
            <input type="date" name="fecha_memo" value={form.fecha_memo} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Fecha recibido:</label>
            <input type="date" name="fecha_memo_recibido" value={form.fecha_memo_recibido} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Área:</label>
            <select name="id_area" value={form.id_area} onChange={handleChange} className="border p-2 w-full mt-1">
              <option value="">-- Seleccionar --</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Técnico <span className="text-red-400 text-xs">(Opcional)</span>:</label>
            <select name="id_soporte" value={form.id_soporte} onChange={handleChange} className="border p-2 w-full mt-1">
              <option value="">-- Sin asignar --</option>
              {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Descripción del problema:</label>
            <textarea name="descripcion" rows={3} value={form.descripcion} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Prioridad:</label>
            <select name="prioridad" value={form.prioridad} onChange={handleChange} className="border p-2 w-full mt-1">
              <option value="">-- Seleccionar --</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Extensión:</label>
            <input name="extension" value={form.extension} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Edificio <span className="text-red-400 text-xs">(Opcional)</span>:</label>
            <select name="edificio" value={form.edificio} onChange={handleChange} className="border p-2 w-full mt-1">
              <option value="">-- Seleccionar --</option>
              {['2', '3', '4', '6'].map((e) => <option key={e} value={e}>Edificio {e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Nivel <span className="text-red-400 text-xs">(Opcional)</span>:</label>
            <select name="nivel" value={form.nivel} onChange={handleChange} className="border p-2 w-full mt-1">
              <option value="">-- Seleccionar --</option>
              {['PB', '1', '2', '3'].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
          <button onClick={handleSubmit} disabled={enviando} className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}