import { useEffect, useState } from 'react';
import { getSolicitudVpnDetalle, actualizarSolicitudVpn } from '../../services/solicitudVpnService';
import { getAreas, type Area } from '../../services/areaService';

export default function EditarSolicitudVpnModal({
  idSolicitud, onClose, onSaved,
}: { idSolicitud: number; onClose: () => void; onSaved: () => void }) {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);

  const [form, setForm] = useState({
    nombre_usuario: '', puesto: '', id_area: '', dependencia: '',
    correo_institucional: '', telefono: '', extension: '',
    tipo_acceso: 'link' as 'link' | 'ip_puerto',
    link_sistema: '', ip_puerto: '',
    justificacion_uso: '', fecha_inicio: '', fecha_fin: '',
    num_ticket: '', estatus: 'generada',
  });

  useEffect(() => {
    getAreas().then(setAreas);

    getSolicitudVpnDetalle(idSolicitud).then(({ solicitud }) => {
      setForm({
        nombre_usuario: solicitud.nombre_usuario ?? '',
        puesto: solicitud.puesto ?? '',
        id_area: solicitud.id_area ? String(solicitud.id_area) : '',
        dependencia: solicitud.dependencia ?? '',
        correo_institucional: solicitud.correo_institucional ?? '',
        telefono: solicitud.telefono ?? '',
        extension: solicitud.extension ?? '',
        tipo_acceso: solicitud.tipo_acceso,
        link_sistema: solicitud.link_sistema ?? '',
        ip_puerto: solicitud.ip_puerto ?? '',
        justificacion_uso: solicitud.justificacion_uso ?? '',
        fecha_inicio: solicitud.fecha_inicio ?? '',
        fecha_fin: solicitud.fecha_fin ?? '',
        num_ticket: solicitud.num_ticket ?? '',
        estatus: solicitud.estatus,
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
      await actualizarSolicitudVpn(idSolicitud, {
        nombre_usuario: form.nombre_usuario,
        puesto: form.puesto || null,
        id_area: form.id_area ? Number(form.id_area) : null,
        dependencia: form.dependencia || null,
        correo_institucional: form.correo_institucional || null,
        telefono: form.telefono || null,
        extension: form.extension || null,
        tipo_acceso: form.tipo_acceso,
        link_sistema: form.tipo_acceso === 'link' ? form.link_sistema || null : null,
        ip_puerto: form.tipo_acceso === 'ip_puerto' ? form.ip_puerto || null : null,
        justificacion_uso: form.justificacion_uso || null,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
        num_ticket: form.num_ticket || null,
        estatus: form.estatus as any,
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
        <h2 className="text-lg font-semibold mb-4">Editar solicitud de VPN</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm mb-1">Nombre del usuario</label>
            <input className="border rounded w-full px-2 py-1" value={form.nombre_usuario}
              onChange={(e) => handleChange('nombre_usuario', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Puesto</label>
            <input className="border rounded w-full px-2 py-1" value={form.puesto}
              onChange={(e) => handleChange('puesto', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Área de adscripción</label>
            <select className="border rounded w-full px-2 py-1" value={form.id_area}
              onChange={(e) => handleChange('id_area', e.target.value)}>
              <option value="">--Seleccionar--</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Correo institucional</label>
            <input className="border rounded w-full px-2 py-1" value={form.correo_institucional}
              onChange={(e) => handleChange('correo_institucional', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono / Extensión</label>
            <div className="flex gap-2">
              <input className="border rounded w-1/2 px-2 py-1" placeholder="Teléfono" value={form.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)} />
              <input className="border rounded w-1/2 px-2 py-1" placeholder="Ext." value={form.extension}
                onChange={(e) => handleChange('extension', e.target.value)} />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Tipo de acceso</label>
            <select className="border rounded w-full px-2 py-1" value={form.tipo_acceso}
              onChange={(e) => handleChange('tipo_acceso', e.target.value)}>
              <option value="link">Link del sistema</option>
              <option value="ip_puerto">IP y puerto del servidor</option>
            </select>
          </div>

          {form.tipo_acceso === 'link' ? (
            <div className="col-span-2">
              <label className="block text-sm mb-1">Link del sistema</label>
              <input className="border rounded w-full px-2 py-1" value={form.link_sistema}
                onChange={(e) => handleChange('link_sistema', e.target.value)} />
            </div>
          ) : (
            <div className="col-span-2">
              <label className="block text-sm mb-1">IP y puerto del servidor</label>
              <input className="border rounded w-full px-2 py-1" value={form.ip_puerto}
                onChange={(e) => handleChange('ip_puerto', e.target.value)} />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Fecha inicial</label>
            <input type="date" className="border rounded w-full px-2 py-1" value={form.fecha_inicio}
              onChange={(e) => handleChange('fecha_inicio', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha final</label>
            <input type="date" className="border rounded w-full px-2 py-1" value={form.fecha_fin}
              onChange={(e) => handleChange('fecha_fin', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Justificación de uso</label>
            <textarea className="border rounded w-full px-2 py-1" rows={3} value={form.justificacion_uso}
              onChange={(e) => handleChange('justificacion_uso', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Núm. de Ticket</label>
            <input className="border rounded w-full px-2 py-1" value={form.num_ticket}
              onChange={(e) => handleChange('num_ticket', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Estatus</label>
            <select className="border rounded w-full px-2 py-1" value={form.estatus}
              onChange={(e) => handleChange('estatus', e.target.value)}>
              <option value="generada">Generada</option>
              <option value="en_proceso">En proceso</option>
              <option value="autorizada">Autorizada</option>
              <option value="rechazada">Rechazada</option>
              <option value="finalizada">Finalizada</option>
            </select>
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
