import { useEffect, useState } from 'react';
import { getSolicitudUieDetalle, actualizarSolicitudUie } from '../../services/solicitudUieService';
import { getAreas, type Area } from '../../services/areaService';

export default function EditarSolicitudUieModal({
  idSolicitud, onClose, onSaved,
}: { idSolicitud: number; onClose: () => void; onSaved: () => void }) {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);

  const [form, setForm] = useState({
    solicitante: '', puesto: '', extension: '', id_area: '',
    descripcion: '', num_documento: '', prioridad: 'NORMAL',
    edificio: '', nivel: '', seguimiento: '', observaciones: '',
  });

  useEffect(() => {
    getAreas().then(setAreas);

    getSolicitudUieDetalle(idSolicitud).then(({ solicitud }) => {
      setForm({
        solicitante: solicitud.solicitante ?? '',
        puesto: solicitud.puesto ?? '',
        extension: solicitud.extension ? String(solicitud.extension) : '',
        id_area: solicitud.id_area ? String(solicitud.id_area) : '',
        descripcion: solicitud.descripcion ?? '',
        num_documento: solicitud.num_documento ?? '',
        prioridad: solicitud.prioridad ?? 'NORMAL',
        edificio: solicitud.edificio ? String(solicitud.edificio) : '',
        nivel: solicitud.nivel ?? '',
        seguimiento: solicitud.seguimiento ?? '',
        observaciones: solicitud.observaciones ?? '',
      });
      setCargando(false);
    });
  }, [idSolicitud]);

  const handleChange = (campo: string, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await actualizarSolicitudUie(idSolicitud, {
        solicitante: form.solicitante,
        puesto: form.puesto || null,
        extension: form.extension ? Number(form.extension) : null,
        id_area: form.id_area ? Number(form.id_area) : undefined,
        descripcion: form.descripcion || null,
        num_documento: form.num_documento || null,
        prioridad: form.prioridad || null,
        edificio: form.edificio ? Number(form.edificio) : null,
        nivel: form.nivel || null,
        seguimiento: form.seguimiento || null,
        observaciones: form.observaciones || null,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error al guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 shadow-xl border border-blue-100 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-slate-700 font-medium text-sm">Cargando solicitud...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden border border-blue-100 flex flex-col">
        {/* Cabecera del modal */}
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span className="text-base">Editar Solicitud</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition">✕</button>
        </div>

        {/* Contenido principal */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-sm">
          <div className="border border-blue-100 rounded-lg overflow-hidden bg-white shadow-sm p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Solicitante</label>
                <input 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.solicitante}
                  onChange={(e) => handleChange('solicitante', e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Puesto</label>
                <input 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.puesto}
                  onChange={(e) => handleChange('puesto', e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Extensión</label>
                <input 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.extension}
                  onChange={(e) => handleChange('extension', e.target.value)} 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Área</label>
                <select 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.id_area}
                  onChange={(e) => handleChange('id_area', e.target.value)}
                >
                  <option value="">-- Seleccionar --</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Número de Documento</label>
                <input 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.num_documento}
                  onChange={(e) => handleChange('num_documento', e.target.value)} 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Problema</label>
                <textarea 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  rows={3} 
                  value={form.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Prioridad</label>
                <select 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.prioridad}
                  onChange={(e) => handleChange('prioridad', e.target.value)}
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="ALTA">ALTA</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Edificio</label>
                <input 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.edificio}
                  onChange={(e) => handleChange('edificio', e.target.value)} 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Nivel</label>
                <input 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={form.nivel}
                  onChange={(e) => handleChange('nivel', e.target.value)} 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Seguimiento</label>
                <textarea 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  rows={2} 
                  value={form.seguimiento}
                  onChange={(e) => handleChange('seguimiento', e.target.value)} 
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Respuesta</label>
                <textarea 
                  className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  rows={2} 
                  value={form.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)} 
                />
              </div>
            </div>

            {error && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm font-medium mt-2">{error}</p>}
          </div>
        </div>

        {/* Pie del modal */}
        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition text-sm font-medium shadow-sm"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}