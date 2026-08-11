import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import { getExtrasEquipo, guardarExtrasEquipo } from '../../services/equipoService';

interface Opcion { id: number; [key: string]: any }

interface Props {
  equipoId: number;
  onClose: () => void;
}

const EDIFICIOS = [2, 3, 4, 6];
const NIVELES = ['PB', '1', '2', '3'];

export default function ExtrasEquipoModal({ equipoId, onClose }: Props) {
  const [areas, setAreas] = useState<Opcion[]>([]);
  const [form, setForm] = useState({
    IdArea: '', Resguardante: '', Usuario: '', Edificio: '', ENivel: '',
    Puerto: '', Switch: false, Mac: '', Conexion: '', Nivel: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    getCatalogo('areas').then((r) => setAreas(r.registros));
    getExtrasEquipo(equipoId).then((r) => {
      if (r) {
        setForm({
          IdArea: r.IdArea ? String(r.IdArea) : '',
          Resguardante: r.Resguardante ?? '',
          Usuario: r.Usuario ?? '',
          Edificio: r.Edificio ? String(r.Edificio) : '',
          ENivel: r.ENivel ?? '',
          Puerto: r.Puerto ?? '',
          Switch: !!r.Switch,
          Mac: r.Mac ?? '',
          Conexion: r.Conexion ?? '',
          Nivel: r.Nivel ?? '',
        });
      }
    });
  }, [equipoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, Switch: e.target.checked });
  };

  const handleGuardar = async () => {
    setEnviando(true);
    setMensaje('');
    try {
      await guardarExtrasEquipo(equipoId, {
        IdArea: form.IdArea ? Number(form.IdArea) : undefined,
        Resguardante: form.Resguardante || undefined,
        Usuario: form.Usuario || undefined,
        Edificio: form.Edificio ? Number(form.Edificio) : undefined,
        ENivel: form.ENivel || undefined,
        Puerto: form.Puerto || undefined,
        Switch: form.Switch,
        Mac: form.Mac || undefined,
        Conexion: form.Conexion || undefined,
        Nivel: form.Nivel || undefined,
      });
      setMensaje('Guardado correctamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-[40rem] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg">Datos complementarios</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Ubicación Física:</label>
              <select name="IdArea" value={form.IdArea} onChange={handleChange} className="border p-2 w-full mt-1">
                <option value="">SELECCIONAR</option>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Resguardante:</label>
              <input name="Resguardante" value={form.Resguardante} onChange={handleChange} className="border p-2 w-full mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">Usuario:</label>
              <input name="Usuario" value={form.Usuario} onChange={handleChange} className="border p-2 w-full mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Edificio:</label>
              <select name="Edificio" value={form.Edificio} onChange={handleChange} className="border p-2 w-full mt-1">
                <option value="">SELECCIONAR</option>
                {EDIFICIOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Nivel Edificio:</label>
              <select name="ENivel" value={form.ENivel} onChange={handleChange} className="border p-2 w-full mt-1">
                <option value="">SELECCIONAR</option>
                {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 items-end">
            <div>
              <label className="text-sm font-medium">Puerto:</label>
              <input name="Puerto" value={form.Puerto} onChange={handleChange} className="border p-2 w-full mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">En Switch:</label>
              <input type="checkbox" checked={form.Switch} onChange={handleCheckbox} className="border p-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Dirección MAC:</label>
              <input name="Mac" value={form.Mac} onChange={handleChange} className="border p-2 w-full mt-1 font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Conexión:</label>
              <input name="Conexion" value={form.Conexion} onChange={handleChange} className="border p-2 w-full mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Nivel:</label>
              <select name="Nivel" value={form.Nivel} onChange={handleChange} className="border p-2 w-full mt-1">
                <option value="">SELECCIONAR</option>
                {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t">
          <button onClick={onClose} className="px-5 py-2 bg-orange-400 text-white rounded text-sm hover:bg-orange-500">
            Cerrar
          </button>
          <button onClick={handleGuardar} disabled={enviando} className="px-5 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Grabar'}
          </button>
        </div>
      </div>
    </div>
  );
}