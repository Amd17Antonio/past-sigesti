import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import { getExtrasEquipo, guardarExtrasEquipo } from '../../services/equipoService';
import { formatMac, isValidMac } from '../../utils/mac';

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
  const [error, setError] = useState('');

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
    setError('');
    setMensaje('');

    if (form.Mac && !isValidMac(form.Mac)) {
      setError('La Dirección MAC no tiene un formato válido.');
      return;
    }

    setEnviando(true);
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
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudieron guardar los datos complementarios.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[40rem] max-h-[90vh] overflow-y-auto border border-blue-100">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span>Datos complementarios</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-700">Ubicación Física:</label>
              <select name="IdArea" value={form.IdArea} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">--Seleccionar--</option>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Resguardante:</label>
              <input name="Resguardante" value={form.Resguardante} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-700">Usuario:</label>
              <input name="Usuario" value={form.Usuario} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Edificio:</label>
              <select name="Edificio" value={form.Edificio} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">--Seleccionar--</option>
                {EDIFICIOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Nivel Edificio:</label>
              <select name="ENivel" value={form.ENivel} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">--Seleccionar--</option>
                {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 items-end">
            <div>
              <label className="text-sm font-medium text-slate-700">Puerto:</label>
              <input name="Puerto" value={form.Puerto} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">En Switch:</label>
              <input type="checkbox" checked={form.Switch} onChange={handleCheckbox} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Dirección MAC:</label>
              <input
                name="Mac"
                value={form.Mac}
                onChange={(e) => setForm({ ...form, Mac: formatMac(e.target.value) })}
                maxLength={17}
                className="border border-slate-300 rounded p-2 w-full mt-1 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-700">Conexión:</label>
              <input name="Conexion" value={form.Conexion} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Nivel:</label>
              <select name="Nivel" value={form.Nivel} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">--Seleccionar--</option>
                {NIVELES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {mensaje && <p className="text-emerald-700 bg-emerald-50 p-2 rounded text-sm border border-emerald-200">{mensaje}</p>}
          {error && <p className="text-red-600 bg-red-50 p-2 rounded text-sm border border-red-200">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-sm text-slate-700 transition-colors">
            Cerrar
          </button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50 transition-colors shadow-sm">
            {enviando ? 'Guardando...' : 'Grabar'}
          </button>
        </div>
      </div>
    </div>
  );
}