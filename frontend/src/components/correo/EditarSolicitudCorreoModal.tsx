import { useEffect, useState } from 'react';
import { getSolicitudCorreoDetalle, actualizarSolicitudCorreo } from '../../services/solicitudCorreoService';
import { getAreas, type Area } from '../../services/areaService';

export default function EditarSolicitudCorreoModal({
  idSolicitud, onClose, onSaved,
}: { idSolicitud: number; onClose: () => void; onSaved: () => void }) {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);

  const [form, setForm] = useState({
    tipo_solicitud: 'alta' as 'alta' | 'baja',
    nombre: '', puesto: '', id_area: '', area_interna: '',
    correo_secundario: '', telefono_contacto: '',
    correo_institucional: '', usuario_generado: '', motivo_baja: '',
    estatus: 'generada',
  });

  useEffect(() => {
    getAreas().then(setAreas);

    getSolicitudCorreoDetalle(idSolicitud).then(({ solicitud }) => {
      setForm({
        tipo_solicitud: solicitud.tipo_solicitud,
        nombre: solicitud.nombre ?? '',
        puesto: solicitud.puesto ?? '',
        id_area: (solicitud as any).id_area ? String((solicitud as any).id_area) : '',
        area_interna: solicitud.area_interna ?? '',
        correo_secundario: solicitud.correo_secundario ?? '',
        telefono_contacto: solicitud.telefono_contacto ?? '',
        correo_institucional: solicitud.correo_institucional ?? '',
        usuario_generado: solicitud.usuario_generado ?? '',
        motivo_baja: solicitud.motivo_baja ?? '',
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
      await actualizarSolicitudCorreo(idSolicitud, {
        tipo_solicitud: form.tipo_solicitud,
        nombre: form.nombre,
        puesto: form.puesto || null,
        id_area: form.id_area ? Number(form.id_area) : null,
        area_interna: form.area_interna || null,
        correo_secundario: form.correo_secundario || null,
        telefono_contacto: form.telefono_contacto || null,
        correo_institucional: form.correo_institucional || null,
        usuario_generado: form.usuario_generado || null,
        motivo_baja: form.motivo_baja || null,
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

  const esAlta = form.tipo_solicitud === 'alta';

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
        <h2 className="text-lg font-semibold mb-4">Editar solicitud de correo</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm mb-1">Tipo de solicitud</label>
            <select className="border rounded w-full px-2 py-1" value={form.tipo_solicitud}
              onChange={(e) => handleChange('tipo_solicitud', e.target.value)}>
              <option value="alta">Alta de correo</option>
              <option value="baja">Baja de correo</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Nombre</label>
            <input className="border rounded w-full px-2 py-1" value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)} />
          </div>

          {esAlta && (
            <>
              <div>
                <label className="block text-sm mb-1">Puesto</label>
                <input className="border rounded w-full px-2 py-1" value={form.puesto}
                  onChange={(e) => handleChange('puesto', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Área interna</label>
                <input className="border rounded w-full px-2 py-1" value={form.area_interna}
                  onChange={(e) => handleChange('area_interna', e.target.value)} />
              </div>
            </>
          )}

          <div className={esAlta ? '' : 'col-span-2'}>
            <label className="block text-sm mb-1">Dependencia / Área</label>
            <select className="border rounded w-full px-2 py-1" value={form.id_area}
              onChange={(e) => handleChange('id_area', e.target.value)}>
              <option value="">--Seleccionar--</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
            </select>
          </div>

          {esAlta ? (
            <>
              <div>
                <label className="block text-sm mb-1">Correo secundario</label>
                <input className="border rounded w-full px-2 py-1" value={form.correo_secundario}
                  onChange={(e) => handleChange('correo_secundario', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Teléfono de contacto</label>
                <input className="border rounded w-full px-2 py-1" value={form.telefono_contacto}
                  onChange={(e) => handleChange('telefono_contacto', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Correo institucional asignado</label>
                <input className="border rounded w-full px-2 py-1" value={form.correo_institucional}
                  onChange={(e) => handleChange('correo_institucional', e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Correo institucional a dar de baja</label>
                <input className="border rounded w-full px-2 py-1" value={form.correo_institucional}
                  onChange={(e) => handleChange('correo_institucional', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Motivo de baja</label>
                <textarea className="border rounded w-full px-2 py-1" rows={3} value={form.motivo_baja}
                  onChange={(e) => handleChange('motivo_baja', e.target.value)} />
              </div>
            </>
          )}

          <div className="col-span-2">
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
