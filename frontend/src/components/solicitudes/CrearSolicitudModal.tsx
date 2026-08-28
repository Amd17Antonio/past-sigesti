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

  const validar = (): string | null => {
    const faltantes: string[] = [];
    if (!form.solicitante) faltantes.push('Solicitante');
    if (!form.id_area) faltantes.push('Área');
    if (!form.id_soporte) faltantes.push('Técnico');
    if (!form.descripcion) faltantes.push('Descripción del problema');
    if (!form.prioridad) faltantes.push('Prioridad');
    if (!form.extension) faltantes.push('Extensión');

    if (faltantes.length > 0) {
      return `Completa los siguientes campos obligatorios: ${faltantes.join(', ')}.`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const mensajeError = validar();
    if (mensajeError) {
      setError(mensajeError);
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
        prioridad: form.prioridad,
        extension: Number(form.extension),
        edificio: form.edificio ? Number(form.edificio) : undefined,
        nivel: form.nivel || undefined,
        id_soporte: Number(form.id_soporte),
      });
      onCreado();
      onClose();
    } catch (err: any) {
      const errores = err?.response?.data?.errors;
      if (errores) {
        const detalle = Object.entries(errores)
          .map(([campo, mensajes]) => `${campo}: ${(mensajes as string[]).join(', ')}`)
          .join(' | ');
        setError(detalle);
      } else {
        setError(err?.response?.data?.message ?? 'No se pudo crear la solicitud.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded-lg shadow-xl w-[52rem] max-w-[95vw] overflow-hidden border border-blue-100">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span className="text-base">Nueva Solicitud</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          {/* Datos del Solicitante */}
          <div className="border border-blue-100 rounded-md overflow-hidden">
            <div className="bg-blue-50/70 px-3 py-2 font-semibold text-blue-900 border-b border-blue-100">Datos del Solicitante</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700">Solicitante:</label>
                <input
                  name="solicitante"
                  placeholder="Ejemplo: C.P. Omar Pérez"
                  value={form.solicitante}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Puesto <span className="text-slate-400">(Opcional)</span>:
                </label>
                <input
                  name="puesto"
                  placeholder="Ingresa el puesto"
                  value={form.puesto}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  Tipo documento <span className="text-slate-400">(Opcional)</span>:
                </label>
                <select
                  name="tipo_documento"
                  value={form.tipo_documento}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">-- Seleccionar --</option>
                  {TIPOS_DOCUMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">
                  No. Documento <span className="text-slate-400">(Opcional)</span>:
                </label>
                <input
                  name="num_documento"
                  value={form.num_documento}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">
                  Fecha de memorándum <span className="text-slate-400">(Opcional)</span>:
                </label>
                <input
                  type="date"
                  name="fecha_memo"
                  value={form.fecha_memo}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Fecha recibido <span className="text-slate-400">(Opcional)</span>:
                </label>
                <input
                  type="date"
                  name="fecha_memo_recibido"
                  value={form.fecha_memo_recibido}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Asignación */}
          <div className="border border-blue-100 rounded-md overflow-hidden">
            <div className="bg-blue-50/70 px-3 py-2 font-semibold text-blue-900 border-b border-blue-100">Asignación</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700">Área:</label>
                <select
                  name="id_area"
                  value={form.id_area}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">-- Seleccionar --</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Técnico:</label>
                <select
                  name="id_soporte"
                  value={form.id_soporte}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">-- Seleccionar --</option>
                  {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Detalles del Problema */}
          <div className="border border-blue-100 rounded-md overflow-hidden">
            <div className="bg-blue-50/70 px-3 py-2 font-semibold text-blue-900 border-b border-blue-100">Detalles del Problema</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-700">Descripción del problema:</label>
                <textarea
                  name="descripcion"
                  rows={3}
                  value={form.descripcion}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700">Prioridad:</label>
                <select
                  name="prioridad"
                  value={form.prioridad}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">Extensión:</label>
                <input
                  name="extension"
                  value={form.extension}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="border border-blue-100 rounded-md overflow-hidden">
            <div className="bg-blue-50/70 px-3 py-2 font-semibold text-blue-900 border-b border-blue-100">Ubicación</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Edificio <span className="text-slate-400">(Opcional)</span>:
                </label>
                <select
                  name="edificio"
                  value={form.edificio}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">-- Seleccionar --</option>
                  {['2', '3', '4', '6'].map((e) => <option key={e} value={e}>Edificio {e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700">
                  Nivel <span className="text-slate-400">(Opcional)</span>:
                </label>
                <select
                  name="nivel"
                  value={form.nivel}
                  onChange={handleChange}
                  className="border border-slate-300 p-2 w-full mt-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                >
                  <option value="">-- Seleccionar --</option>
                  {['PB', '1', '2', '3'].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm font-medium">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 border border-slate-300 rounded hover:bg-slate-100 transition text-sm"
          >
            ✕ Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={enviando}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 transition font-medium text-sm shadow-sm"
          >
            💾 {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}