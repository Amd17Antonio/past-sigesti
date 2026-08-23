import { useEffect, useState } from 'react';
import { getSolicitudVpnDetalle, actualizarSolicitudVpn } from '../../services/solicitudVpnService';
import { getAreas, type Area } from '../../services/areaService';
import { getCatalogo } from '../../services/catalogoService';

interface Autoriza { id: number; nombre: string; cargo?: string; correo?: string }

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^[0-9]{7,15}$/;
const REGEX_EXTENSION = /^[0-9]{1,10}$/;
const REGEX_URL = /^https?:\/\/[^\s]+$/i;
const REGEX_IP_PUERTO = /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?(,\d{1,5})*$/;

export default function EditarSolicitudVpnModal({
  idSolicitud, onClose, onSaved,
}: { idSolicitud: number; onClose: () => void; onSaved: () => void }) {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [autorizantes, setAutorizantes] = useState<Autoriza[]>([]);

  const [form, setForm] = useState({
    nombre_usuario: '', puesto: '', id_area: '', dependencia: '',
    correo_institucional: '', telefono: '', extension: '',
    id_autoriza: '',
    link_sistema: '', ip_puerto: '',
    justificacion_uso: '', fecha_inicio: '', fecha_fin: '',
    num_ticket: '', estatus: 'generada',
  });

  useEffect(() => {
    getAreas().then(setAreas);
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros as Autoriza[]));

    getSolicitudVpnDetalle(idSolicitud).then(({ solicitud }) => {
      setForm({
        nombre_usuario: solicitud.nombre_usuario ?? '',
        puesto: solicitud.puesto ?? '',
        id_area: solicitud.id_area ? String(solicitud.id_area) : '',
        dependencia: solicitud.dependencia ?? '',
        correo_institucional: solicitud.correo_institucional ?? '',
        telefono: solicitud.telefono ?? '',
        extension: solicitud.extension ?? '',
        id_autoriza: solicitud.id_autoriza ? String(solicitud.id_autoriza) : '',
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

  const autorizaSeleccionado = autorizantes.find((a) => a.id === Number(form.id_autoriza));

  const validar = (): string[] => {
    const errs: string[] = [];

    if (!form.nombre_usuario.trim()) errs.push('El nombre del usuario es obligatorio.');
    if (!form.puesto.trim()) errs.push('El puesto es obligatorio.');
    if (!form.id_area) errs.push('El área de adscripción es obligatoria.');
    if (!form.dependencia.trim()) errs.push('La dependencia o entidad es obligatoria.');
    if (!form.id_autoriza) errs.push('La persona que autoriza es obligatoria.');

    if (!form.correo_institucional.trim()) {
      errs.push('El correo institucional es obligatorio.');
    } else if (!REGEX_EMAIL.test(form.correo_institucional.trim())) {
      errs.push('El correo institucional no tiene un formato válido.');
    }

    if (!form.telefono.trim()) {
      errs.push('El teléfono es obligatorio.');
    } else if (!REGEX_TELEFONO.test(form.telefono.trim())) {
      errs.push('El teléfono debe contener solo dígitos (7 a 15).');
    }

    if (!form.extension.trim()) {
      errs.push('La extensión es obligatoria.');
    } else if (!REGEX_EXTENSION.test(form.extension.trim())) {
      errs.push('La extensión debe contener solo dígitos.');
    }

    if (!form.link_sistema.trim()) {
      errs.push('El link del sistema es obligatorio.');
    } else if (!REGEX_URL.test(form.link_sistema.trim())) {
      errs.push('El link del sistema debe ser una URL válida (debe iniciar con http:// o https://).');
    }

    if (!form.ip_puerto.trim()) {
      errs.push('La IP y puerto del servidor son obligatorios.');
    } else if (!REGEX_IP_PUERTO.test(form.ip_puerto.trim())) {
      errs.push('La IP y puerto no tienen un formato válido. Ejemplo: 192.168.1.100:8080');
    }

    if (!form.justificacion_uso.trim()) {
      errs.push('La justificación de uso es obligatoria.');
    } else if (form.justificacion_uso.trim().length < 10) {
      errs.push('La justificación de uso debe tener al menos 10 caracteres.');
    }

    if (!form.fecha_inicio) errs.push('La fecha inicial es obligatoria.');
    if (!form.fecha_fin) errs.push('La fecha final es obligatoria.');
    if (form.fecha_inicio && form.fecha_fin && form.fecha_fin < form.fecha_inicio) {
      errs.push('La fecha final no puede ser anterior a la fecha inicial.');
    }

    return errs;
  };

  const guardar = async () => {
    const erroresValidacion = validar();
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    setGuardando(true);
    setErrores([]);
    try {
      await actualizarSolicitudVpn(idSolicitud, {
        nombre_usuario: form.nombre_usuario.trim(),
        puesto: form.puesto.trim() || null,
        id_area: form.id_area ? Number(form.id_area) : null,
        id_autoriza: form.id_autoriza ? Number(form.id_autoriza) : null,
        dependencia: form.dependencia.trim() || null,
        correo_institucional: form.correo_institucional.trim() || null,
        telefono: form.telefono.trim() || null,
        extension: form.extension.trim() || null,
        tipo_acceso: 'ambos',
        link_sistema: form.link_sistema.trim() || null,
        ip_puerto: form.ip_puerto.trim() || null,
        justificacion_uso: form.justificacion_uso.trim() || null,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null,
        num_ticket: form.num_ticket.trim() || null,
        estatus: form.estatus as any,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      const camposErrores = e?.response?.data?.errors;
      if (camposErrores) {
        setErrores(Object.values(camposErrores).flat() as string[]);
      } else {
        setErrores([e?.response?.data?.message ?? 'Error al guardar los cambios']);
      }
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded shadow-lg w-[42rem] max-w-[95vw] overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          Editar Solicitud de VPN
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Datos del usuario */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Datos del Usuario</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Nombre del usuario *</label>
                <input className="border p-2 w-full mt-1" value={form.nombre_usuario}
                  onChange={(e) => handleChange('nombre_usuario', e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Puesto *</label>
                <input className="border p-2 w-full mt-1" value={form.puesto}
                  onChange={(e) => handleChange('puesto', e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Área de adscripción *</label>
                <select className="border p-2 w-full mt-1" value={form.id_area}
                  onChange={(e) => handleChange('id_area', e.target.value)}>
                  <option value="">--Seleccionar--</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Dependencia o Entidad *</label>
                <input className="border p-2 w-full mt-1" value={form.dependencia}
                  onChange={(e) => handleChange('dependencia', e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Correo institucional *</label>
                <input className="border p-2 w-full mt-1" value={form.correo_institucional}
                  onChange={(e) => handleChange('correo_institucional', e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Teléfono / Extensión *</label>
                <div className="flex gap-2 mt-1">
                  <input className="border p-2 w-1/2" placeholder="Teléfono" value={form.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)} />
                  <input className="border p-2 w-1/2" placeholder="Ext." value={form.extension}
                    onChange={(e) => handleChange('extension', e.target.value)} />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Persona que autoriza *</label>
                <select className="border p-2 w-full mt-1" value={form.id_autoriza}
                  onChange={(e) => handleChange('id_autoriza', e.target.value)}>
                  <option value="">--Seleccionar--</option>
                  {autorizantes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>

              {autorizaSeleccionado && (
                <p className="text-xs text-gray-500 col-span-2">
                  Cargo: {autorizaSeleccionado.cargo} — Correo: {autorizaSeleccionado.correo}
                </p>
              )}
            </div>
          </div>

          {/* Datos del acceso remoto */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Datos del Acceso Remoto</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Link del sistema *</label>
                <input className="border p-2 w-full mt-1" placeholder="https://sistema.oaxaca.gob.mx/"
                  value={form.link_sistema} onChange={(e) => handleChange('link_sistema', e.target.value)} />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">IP y puerto del servidor *</label>
                <input className="border p-2 w-full mt-1" placeholder="192.168.1.100:8080,443"
                  value={form.ip_puerto} onChange={(e) => handleChange('ip_puerto', e.target.value)} />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: IP:puerto (sin espacios). Ejemplo: 172.15.15.15:445
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Fecha inicial *</label>
                <input type="date" className="border p-2 w-full mt-1" value={form.fecha_inicio}
                  onChange={(e) => handleChange('fecha_inicio', e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Fecha final *</label>
                <input type="date" className="border p-2 w-full mt-1" value={form.fecha_fin}
                  onChange={(e) => handleChange('fecha_fin', e.target.value)} />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Justificación de uso * (mínimo 10 caracteres)</label>
                <textarea className="border p-2 w-full mt-1" rows={3} value={form.justificacion_uso}
                  onChange={(e) => handleChange('justificacion_uso', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Estatus / Ticket */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Seguimiento</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Núm. de Ticket</label>
                <input className="border p-2 w-full mt-1" value={form.num_ticket}
                  onChange={(e) => handleChange('num_ticket', e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Estatus</label>
                <select className="border p-2 w-full mt-1" value={form.estatus}
                  onChange={(e) => handleChange('estatus', e.target.value)}>
                  <option value="generada">Generada</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="autorizada">Autorizada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>
            </div>
          </div>

          {errores.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <ul className="text-red-600 text-sm list-disc pl-4 space-y-0.5">
                {errores.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border rounded">✕ Cancelar</button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            💾 {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}