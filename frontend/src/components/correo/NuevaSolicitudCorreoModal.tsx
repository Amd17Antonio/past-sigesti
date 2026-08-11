import { useEffect, useState } from 'react';
import { crearSolicitudCorreo } from '../../services/solicitudCorreoService';
import { getAreas, type Area } from '../../services/areaService';
import { getCatalogo } from '../../services/catalogoService';

interface Cargo { id: number; cargo: string }

export default function NuevaSolicitudCorreoModal({
  onClose, onCreado,
}: { onClose: () => void; onCreado: () => void }) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const [form, setForm] = useState({
    tipo_solicitud: 'alta' as 'alta' | 'baja',
    nombre: '', puesto: '', id_area: '', area_interna: '',
    correo_secundario: '', telefono_contacto: '',
    correo_institucional: '', motivo_baja: '',
  });

  useEffect(() => {
    getAreas().then(setAreas);
    getCatalogo('cargos').then((r) => setCargos(r.registros as Cargo[]));
  }, []);

  const handleChange = (campo: string, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const guardar = async () => {
    setGuardando(true);
    setErrores([]);
    try {
      await crearSolicitudCorreo({
        tipo_solicitud: form.tipo_solicitud,
        nombre: form.nombre,
        puesto: form.puesto || undefined,
        id_area: form.id_area ? Number(form.id_area) : undefined,
        area_interna: form.area_interna || undefined,
        correo_secundario: form.correo_secundario || undefined,
        telefono_contacto: form.telefono_contacto || undefined,
        correo_institucional: form.correo_institucional || undefined,
        motivo_baja: form.motivo_baja || undefined,
      });
      onCreado();
      onClose();
    } catch (e: any) {
      const camposErrores = e?.response?.data?.errors;
      if (camposErrores) {
        setErrores(Object.values(camposErrores).flat() as string[]);
      } else {
        setErrores([e?.response?.data?.message ?? 'Error al crear la solicitud']);
      }
    } finally {
      setGuardando(false);
    }
  };

  const esAlta = form.tipo_solicitud === 'alta';

  // Validación en cliente para deshabilitar el botón (el backend valida de todos modos)
  const formCompleto = esAlta
    ? !!(form.nombre && form.puesto && form.id_area && form.area_interna && form.correo_secundario && form.telefono_contacto)
    : !!(form.nombre && form.id_area && form.correo_institucional && form.motivo_baja.length >= 10);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Nueva solicitud de correo institucional</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm mb-1">Tipo de solicitud *</label>
            <select className="border rounded w-full px-2 py-1" value={form.tipo_solicitud}
              onChange={(e) => handleChange('tipo_solicitud', e.target.value)}>
              <option value="alta">Alta de correo — Solicitud de cuenta de correo electrónico oficial</option>
              <option value="baja">Baja de correo — Formato de baja de correo institucional</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {esAlta
                ? 'Se generará el formato "Solicitud de cuenta de correo electrónico oficial".'
                : 'Se generará el "Formato de baja de correo institucional".'}
            </p>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Nombre *</label>
            <input className="border rounded w-full px-2 py-1" value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)} />
          </div>

          {esAlta && (
            <>
              <div>
                <label className="block text-sm mb-1">Puesto *</label>
                <select className="border rounded w-full px-2 py-1" value={form.puesto}
                  onChange={(e) => handleChange('puesto', e.target.value)}>
                  <option value="">--Seleccionar--</option>
                  {cargos.map((c) => <option key={c.id} value={c.cargo}>{c.cargo}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Área interna *</label>
                <input className="border rounded w-full px-2 py-1" value={form.area_interna}
                  onChange={(e) => handleChange('area_interna', e.target.value)} />
              </div>
            </>
          )}

          <div className={esAlta ? '' : 'col-span-2'}>
            <label className="block text-sm mb-1">Dependencia / Área *</label>
            <select className="border rounded w-full px-2 py-1" value={form.id_area}
              onChange={(e) => handleChange('id_area', e.target.value)}>
              <option value="">--Seleccionar--</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
            </select>
          </div>

          {esAlta ? (
            <>
              <div>
                <label className="block text-sm mb-1">Correo secundario *</label>
                <input type="email" className="border rounded w-full px-2 py-1" value={form.correo_secundario}
                  onChange={(e) => handleChange('correo_secundario', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Teléfono de contacto *</label>
                <input className="border rounded w-full px-2 py-1" placeholder="Solo dígitos"
                  value={form.telefono_contacto}
                  onChange={(e) => handleChange('telefono_contacto', e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Correo institucional a dar de baja *</label>
                <input type="email" className="border rounded w-full px-2 py-1" value={form.correo_institucional}
                  onChange={(e) => handleChange('correo_institucional', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Motivo de baja * (mínimo 10 caracteres)</label>
                <textarea className="border rounded w-full px-2 py-1" rows={3} value={form.motivo_baja}
                  onChange={(e) => handleChange('motivo_baja', e.target.value)} />
              </div>
            </>
          )}
        </div>

        {errores.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
            <ul className="text-red-600 text-sm list-disc pl-4 space-y-0.5">
              {errores.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
          <button
            onClick={guardar}
            disabled={guardando || !formCompleto}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}