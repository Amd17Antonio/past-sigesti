import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearSolicitud } from '../services/solicitudService';

export default function SolicitudNueva() {
  const [form, setForm] = useState({
    solicitante: '',
    extension: '',
    descripcion: '',
    prioridad: 'normal',
    edificio: '',
    nivel: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.solicitante || !form.extension || !form.descripcion) {
      setError('Nombre, extensión y descripción son obligatorios.');
      return;
    }
    setError('');
    setMensaje('');
    setEnviando(true);
    try {
      await crearSolicitud({
        solicitante: form.solicitante,
        extension: Number(form.extension),
        descripcion: form.descripcion,
        prioridad: form.prioridad,
        edificio: form.edificio ? Number(form.edificio) : undefined,
        nivel: form.nivel || undefined,
        id_area: 0,
      } as any);
      setMensaje('Tu solicitud fue enviada correctamente.');
      setForm({ solicitante: '', extension: '', descripcion: '', prioridad: 'normal', edificio: '', nivel: '' });
      setTimeout(() => navigate('/pendientes'), 1200);
    } catch {
      setError('No se pudo enviar la solicitud. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-sm border border-blue-100 p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Solicitud de Soporte</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nombre:</label>
            <input
              name="solicitante" placeholder="Ingrese su nombre"
              value={form.solicitante} onChange={handleChange}
              className="border border-blue-200 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Extensión de quien necesita el soporte o servicio:</label>
            <input
              name="extension" placeholder="Ingresa la Extensión"
              value={form.extension} onChange={handleChange}
              className="border border-blue-200 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Descripción del problema:</label>
            <textarea
              name="descripcion" placeholder="Anote sus observaciones y declaraciones"
              value={form.descripcion} onChange={handleChange}
              rows={6} className="border border-blue-200 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">¿Prioridad?:</label>
            <select 
              name="prioridad" value={form.prioridad} onChange={handleChange} 
              className="border border-blue-200 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Edificio <span className="text-red-400 text-xs">(Opcional)</span>:
              </label>
              <select 
                name="edificio" value={form.edificio} onChange={handleChange} 
                className="border border-blue-200 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">--Seleccionar--</option>
                {['2', '3', '4', '6'].map((e) => <option key={e} value={e}>Edificio {e}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Nivel <span className="text-red-400 text-xs">(Opcional)</span>:
              </label>
              <select 
                name="nivel" value={form.nivel} onChange={handleChange} 
                className="border border-blue-200 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">--Seleccionar--</option>
                {['PB', '1', '2', '3'].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm text-center">{mensaje}</p>}

          <div className="text-center pt-2">
            <button
              type="submit" disabled={enviando}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded text-sm font-medium disabled:opacity-50 transition shadow-sm"
            >
              {enviando ? 'Enviando...' : 'Solicitar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}