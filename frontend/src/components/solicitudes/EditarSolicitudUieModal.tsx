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
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg p-6">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Editar solicitud</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm mb-1">Solicitante</label>
            <input className="border rounded w-full px-2 py-1" value={form.solicitante}
              onChange={(e) => handleChange('solicitante', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Puesto</label>
            <input className="border rounded w-full px-2 py-1" value={form.puesto}
              onChange={(e) => handleChange('puesto', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Extensión</label>
            <input className="border rounded w-full px-2 py-1" value={form.extension}
              onChange={(e) => handleChange('extension', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Área</label>
            <select className="border rounded w-full px-2 py-1" value={form.id_area}
              onChange={(e) => handleChange('id_area', e.target.value)}>
              <option value="">--Seleccionar--</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Número de Documento</label>
            <input className="border rounded w-full px-2 py-1" value={form.num_documento}
              onChange={(e) => handleChange('num_documento', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Problema</label>
            <textarea className="border rounded w-full px-2 py-1" rows={3} value={form.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Prioridad</label>
            <select className="border rounded w-full px-2 py-1" value={form.prioridad}
              onChange={(e) => handleChange('prioridad', e.target.value)}>
              <option value="NORMAL">NORMAL</option>
              <option value="ALTA">ALTA</option>
              <option value="BAJA">BAJA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Edificio</label>
            <input className="border rounded w-full px-2 py-1" value={form.edificio}
              onChange={(e) => handleChange('edificio', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Nivel</label>
            <input className="border rounded w-full px-2 py-1" value={form.nivel}
              onChange={(e) => handleChange('nivel', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Seguimiento</label>
            <textarea className="border rounded w-full px-2 py-1" rows={2} value={form.seguimiento}
              onChange={(e) => handleChange('seguimiento', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Respuesta</label>
            <textarea className="border rounded w-full px-2 py-1" rows={2} value={form.observaciones}
              onChange={(e) => handleChange('observaciones', e.target.value)} />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}