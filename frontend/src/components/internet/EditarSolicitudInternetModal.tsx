import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import { actualizarSolicitudInternet } from '../../services/solicitudInternetService';

interface Opcion { id: number; [key: string]: any }

interface Props {
  solicitud: {
    id: number;
    usuario_internet: string;
    correo: string;
    tel_ext: number;
    tipo_conexion: string;
    id_area?: number;
  };
  onClose: () => void;
  onActualizado: () => void;
}

export default function EditarSolicitudInternetModal({ solicitud, onClose, onActualizado }: Props) {
  const [areas, setAreas] = useState<Opcion[]>([]);
  const [form, setForm] = useState({
    usuario_internet: solicitud.usuario_internet,
    correo: solicitud.correo,
    tel_ext: String(solicitud.tel_ext),
    tipo_conexion: solicitud.tipo_conexion,
    edificio: '2',
    nivel: 'PB',
    puerto: '',
    justificacion: '',
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getCatalogo('areas').then((r) => setAreas(r.registros));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    setEnviando(true);
    setError('');
    try {
      await actualizarSolicitudInternet(solicitud.id, {
        usuario_internet: form.usuario_internet,
        correo: form.correo,
        tel_ext: Number(form.tel_ext),
        tipo_conexion: form.tipo_conexion,
        edificio: form.edificio,
        nivel: form.nivel,
        puerto: form.puerto ? Number(form.puerto) : undefined,
        justificacion: form.justificacion || undefined,
      });
      onActualizado();
      onClose();
    } catch {
      setError('No se pudo actualizar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[28rem] shadow-lg space-y-3">
        <h2 className="font-bold text-lg">Editar Solicitud #{solicitud.id}</h2>

        <input name="usuario_internet" placeholder="Nombre completo" value={form.usuario_internet} onChange={handleChange} className="border p-2 w-full" />
        <input name="correo" placeholder="Correo electrónico" value={form.correo} onChange={handleChange} className="border p-2 w-full" />
        <input name="tel_ext" placeholder="Extensión" value={form.tel_ext} onChange={handleChange} className="border p-2 w-full" />

        <select name="tipo_conexion" value={form.tipo_conexion} onChange={handleChange} className="border p-2 w-full">
          <option value="cableada">Cableada</option>
          <option value="inalambrica">Inalámbrica</option>
        </select>

        <div className="grid grid-cols-2 gap-2">
          <select name="edificio" value={form.edificio} onChange={handleChange} className="border p-2">
            {['2', '3', '4', '6'].map((e) => <option key={e} value={e}>Edificio {e}</option>)}
          </select>
          <select name="nivel" value={form.nivel} onChange={handleChange} className="border p-2">
            {['PB', '1', '2', '3'].map((n) => <option key={n} value={n}>Nivel {n}</option>)}
          </select>
        </div>

        <input name="puerto" placeholder="Puerto" value={form.puerto} onChange={handleChange} className="border p-2 w-full" />

        <textarea
          name="justificacion"
          placeholder="Justificación (dejar vacío para no modificar)"
          rows={4}
          value={form.justificacion}
          onChange={handleChange}
          className="border p-2 w-full text-sm"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}