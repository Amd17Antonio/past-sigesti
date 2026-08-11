import { useEffect, useState } from 'react';
import { crearSolicitudVpn } from '../../services/solicitudVpnService';
import { getAreas, type Area } from '../../services/areaService';
import { getCatalogo } from '../../services/catalogoService';

interface Cargo { id: number; cargo: string }

export default function NuevaSolicitudVpnModal({
  onClose, onCreado,
}: { onClose: () => void; onCreado: () => void }) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const [form, setForm] = useState({
    nombre_usuario: '', puesto: '', id_area: '', dependencia: '',
    correo_institucional: '', telefono: '', extension: '',
    tipo_acceso: 'link' as 'link' | 'ip_puerto',
    link_sistema: '', ip_puerto: '',
    justificacion_uso: '', fecha_inicio: '', fecha_fin: '',
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
      await crearSolicitudVpn({
        nombre_usuario: form.nombre_usuario,
        puesto: form.puesto || undefined,
        id_area: form.id_area ? Number(form.id_area) : undefined,
        dependencia: form.dependencia || undefined,
        correo_institucional: form.correo_institucional || undefined,
        telefono: form.telefono || undefined,
        extension: form.extension || undefined,
        tipo_acceso: form.tipo_acceso,
        link_sistema: form.tipo_acceso === 'link' ? form.link_sistema || undefined : undefined,
        ip_puerto: form.tipo_acceso === 'ip_puerto' ? form.ip_puerto || undefined : undefined,
        justificacion_uso: form.justificacion_uso || undefined,
        fecha_inicio: form.fecha_inicio || undefined,
        fecha_fin: form.fecha_fin || undefined,
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

  const formCompleto = !!(
    form.nombre_usuario && form.puesto && form.id_area && form.dependencia &&
    form.correo_institucional && form.telefono && form.extension &&
    (form.tipo_acceso === 'link' ? form.link_sistema : form.ip_puerto) &&
    form.justificacion_uso && form.fecha_inicio && form.fecha_fin
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Nueva solicitud de acceso remoto (VPN)</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-sm mb-1">Nombre del usuario *</label>
            <input className="border rounded w-full px-2 py-1" value={form.nombre_usuario}
              onChange={(e) => handleChange('nombre_usuario', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Puesto *</label>
            <select className="border rounded w-full px-2 py-1" value={form.puesto}
              onChange={(e) => handleChange('puesto', e.target.value)}>
              <option value="">--Seleccionar--</option>
              {cargos.map((c) => <option key={c.id} value={c.cargo}>{c.cargo}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Área de adscripción *</label>
            <select className="border rounded w-full px-2 py-1" value={form.id_area}
              onChange={(e) => handleChange('id_area', e.target.value)}>
              <option value="">--Seleccionar--</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Dependencia o Entidad *</label>
            <input className="border rounded w-full px-2 py-1" value={form.dependencia}
              onChange={(e) => handleChange('dependencia', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Correo institucional *</label>
            <input type="email" className="border rounded w-full px-2 py-1" value={form.correo_institucional}
              onChange={(e) => handleChange('correo_institucional', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono / Extensión *</label>
            <div className="flex gap-2">
              <input className="border rounded w-1/2 px-2 py-1" placeholder="Teléfono" value={form.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)} />
              <input className="border rounded w-1/2 px-2 py-1" placeholder="Ext." value={form.extension}
                onChange={(e) => handleChange('extension', e.target.value)} />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Tipo de acceso *</label>
            <select className="border rounded w-full px-2 py-1" value={form.tipo_acceso}
              onChange={(e) => handleChange('tipo_acceso', e.target.value)}>
              <option value="link">Link del sistema</option>
              <option value="ip_puerto">IP y puerto del servidor</option>
            </select>
          </div>

          {form.tipo_acceso === 'link' ? (
            <div className="col-span-2">
              <label className="block text-sm mb-1">Link del sistema *</label>
              <input className="border rounded w-full px-2 py-1" placeholder="https://sistema.oaxaca.gob.mx/"
                value={form.link_sistema} onChange={(e) => handleChange('link_sistema', e.target.value)} />
            </div>
          ) : (
            <div className="col-span-2">
              <label className="block text-sm mb-1">IP y puerto del servidor *</label>
              <input className="border rounded w-full px-2 py-1" placeholder="192.168.1.100:8080,443"
                value={form.ip_puerto} onChange={(e) => handleChange('ip_puerto', e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">
                Formato: IP:puerto (sin espacios). Ejemplo: 172.15.15.15:445
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Fecha inicial *</label>
            <input type="date" className="border rounded w-full px-2 py-1" value={form.fecha_inicio}
              onChange={(e) => handleChange('fecha_inicio', e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha final *</label>
            <input type="date" className="border rounded w-full px-2 py-1" value={form.fecha_fin}
              onChange={(e) => handleChange('fecha_fin', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-1">Justificación de uso * (mínimo 10 caracteres)</label>
            <textarea className="border rounded w-full px-2 py-1" rows={3} value={form.justificacion_uso}
              onChange={(e) => handleChange('justificacion_uso', e.target.value)} />
          </div>
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