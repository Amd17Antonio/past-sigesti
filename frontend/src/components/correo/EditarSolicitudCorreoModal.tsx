import { useEffect, useState } from 'react';
import { getSolicitudCorreoDetalle, actualizarSolicitudCorreo } from '../../services/solicitudCorreoService';
import { getAreas, type Area } from '../../services/areaService';
import { getCatalogo } from '../../services/catalogoService';

interface Autoriza { id: number; nombre: string; cargo?: string; correo?: string }

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONO = /^[0-9]{7,15}$/;
const REGEX_EXTENSION = /^[0-9]{1,10}$/;

export default function EditarSolicitudCorreoModal({
  idSolicitud, onClose, onSaved,
}: { idSolicitud: number; onClose: () => void; onSaved: () => void }) {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [autorizantes, setAutorizantes] = useState<Autoriza[]>([]);

  const [form, setForm] = useState({
    tipo_solicitud: 'alta' as 'alta' | 'baja',
    nombre: '', puesto: '', id_area: '', area_interna: '',
    correo_secundario: '', telefono_contacto: '', extension: '',
    correo_institucional: '', usuario_generado: '', motivo_baja: '',
    id_autoriza: '',
    estatus: 'generada',
  });

  useEffect(() => {
    getAreas().then(setAreas);
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros as Autoriza[]));

    getSolicitudCorreoDetalle(idSolicitud).then(({ solicitud }) => {
      setForm({
        tipo_solicitud: solicitud.tipo_solicitud,
        nombre: solicitud.nombre ?? '',
        puesto: solicitud.puesto ?? '',
        id_area: (solicitud as any).id_area ? String((solicitud as any).id_area) : '',
        area_interna: solicitud.area_interna ?? '',
        correo_secundario: solicitud.correo_secundario ?? '',
        telefono_contacto: solicitud.telefono_contacto ?? '',
        extension: (solicitud as any).extension ?? '',
        correo_institucional: solicitud.correo_institucional ?? '',
        usuario_generado: solicitud.usuario_generado ?? '',
        motivo_baja: solicitud.motivo_baja ?? '',
        id_autoriza: (solicitud as any).id_autoriza ? String((solicitud as any).id_autoriza) : '',
        estatus: solicitud.estatus,
      });
      setCargando(false);
    });
  }, [idSolicitud]);

  const handleChange = (campo: string, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const esAlta = form.tipo_solicitud === 'alta';
  const autorizaSeleccionado = autorizantes.find((a) => a.id === Number(form.id_autoriza));

  const validar = (): string[] => {
    const errs: string[] = [];

    if (!form.nombre.trim()) errs.push('El nombre es obligatorio.');
    if (!form.id_area) errs.push('La dependencia / área es obligatoria.');
    if (!form.id_autoriza) errs.push('La persona que autoriza es obligatoria.');

    if (!form.correo_institucional.trim()) {
      errs.push(esAlta ? 'El correo solicitado es obligatorio.' : 'El correo a dar de baja es obligatorio.');
    } else if (!REGEX_EMAIL.test(form.correo_institucional.trim())) {
      errs.push('El correo institucional no tiene un formato válido.');
    }

    if (form.usuario_generado.trim() && !REGEX_EMAIL.test(form.usuario_generado.trim())) {
      errs.push('El usuario generado debe tener formato de correo válido.');
    }

    if (esAlta) {
      if (!form.puesto.trim()) errs.push('El puesto es obligatorio.');
      if (!form.area_interna.trim()) errs.push('El área interna es obligatoria.');

      if (!form.correo_secundario.trim()) {
        errs.push('El correo secundario es obligatorio.');
      } else if (!REGEX_EMAIL.test(form.correo_secundario.trim())) {
        errs.push('El correo secundario no tiene un formato válido.');
      }

      if (!form.telefono_contacto.trim()) {
        errs.push('El teléfono de contacto es obligatorio.');
      } else if (!REGEX_TELEFONO.test(form.telefono_contacto.trim())) {
        errs.push('El teléfono de contacto debe contener solo dígitos (7 a 15).');
      }

      if (!form.extension.trim()) {
        errs.push('La extensión es obligatoria.');
      } else if (!REGEX_EXTENSION.test(form.extension.trim())) {
        errs.push('La extensión debe contener solo dígitos.');
      }
    } else {
      if (!form.motivo_baja.trim()) {
        errs.push('El motivo de baja es obligatorio.');
      } else if (form.motivo_baja.trim().length < 10) {
        errs.push('El motivo de baja debe tener al menos 10 caracteres.');
      }
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
      await actualizarSolicitudCorreo(idSolicitud, {
        tipo_solicitud: form.tipo_solicitud,
        nombre: form.nombre.trim(),
        puesto: form.puesto.trim() || null,
        id_area: form.id_area ? Number(form.id_area) : null,
        id_autoriza: form.id_autoriza ? Number(form.id_autoriza) : null,
        area_interna: form.area_interna.trim() || null,
        correo_secundario: form.correo_secundario.trim() || null,
        telefono_contacto: form.telefono_contacto.trim() || null,
        extension: form.extension.trim() || null,
        correo_institucional: form.correo_institucional.trim() || null,
        usuario_generado: form.usuario_generado.trim() || null,
        motivo_baja: form.motivo_baja.trim() || null,
        estatus: form.estatus as any,
      } as any);
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-blue-100 text-gray-600 text-sm font-medium">Cargando información...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-[42rem] max-w-[95vw] border border-blue-100 overflow-hidden flex flex-col my-6">
        <div className="bg-blue-900 border-b border-blue-800 text-white px-6 py-4 font-bold flex justify-between items-center">
          <span>Editar Solicitud de Correo Institucional</span>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto bg-white">
          {/* Tipo de solicitud */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Tipo de Solicitud</div>
            <div className="p-4 bg-blue-50/10">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de solicitud</label>
              <select 
                className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={form.tipo_solicitud}
                onChange={(e) => handleChange('tipo_solicitud', e.target.value)}
              >
                <option value="alta">Alta de correo</option>
                <option value="baja">Baja de correo</option>
              </select>
            </div>
          </div>

          {/* Datos del usuario */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Datos del Usuario</div>
            <div className="p-4 grid grid-cols-2 gap-3.5 bg-blue-50/10">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
                <input 
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)} 
                />
              </div>

              {esAlta && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Puesto <span className="text-red-500">*</span></label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={form.puesto}
                      onChange={(e) => handleChange('puesto', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Área interna <span className="text-red-500">*</span></label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={form.area_interna}
                      onChange={(e) => handleChange('area_interna', e.target.value)} 
                    />
                  </div>
                </>
              )}

              <div className={esAlta ? '' : 'col-span-2'}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Dependencia / Área <span className="text-red-500">*</span></label>
                <select 
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={form.id_area}
                  onChange={(e) => handleChange('id_area', e.target.value)}
                >
                  <option value="">--Seleccionar--</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Persona que autoriza <span className="text-red-500">*</span></label>
                <select 
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={form.id_autoriza}
                  onChange={(e) => handleChange('id_autoriza', e.target.value)}
                >
                  <option value="">--Seleccionar--</option>
                  {autorizantes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>

              {autorizaSeleccionado && (
                <div className="col-span-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-900 font-medium">
                    Cargo: {autorizaSeleccionado.cargo} — Correo: {autorizaSeleccionado.correo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contacto / cuenta */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">
              {esAlta ? 'Datos de Contacto y Cuenta' : 'Datos de la Cuenta a Dar de Baja'}
            </div>
            <div className="p-4 grid grid-cols-2 gap-3.5 bg-blue-50/10">
              {esAlta ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Correo secundario <span className="text-red-500">*</span></label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={form.correo_secundario}
                      onChange={(e) => handleChange('correo_secundario', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono de contacto <span className="text-red-500">*</span></label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                      placeholder="Solo dígitos" 
                      value={form.telefono_contacto}
                      onChange={(e) => handleChange('telefono_contacto', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Extensión <span className="text-red-500">*</span></label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                      placeholder="Solo dígitos" 
                      value={form.extension}
                      onChange={(e) => handleChange('extension', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Correo solicitado <span className="text-red-500">*</span></label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                      placeholder="ale.lopez@oaxaca.gob.mx" 
                      value={form.correo_institucional}
                      onChange={(e) => handleChange('correo_institucional', e.target.value)} 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Usuario generado</label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                      placeholder="usuario@oaxaca.gob.mx" 
                      value={form.usuario_generado}
                      onChange={(e) => handleChange('usuario_generado', e.target.value)} 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Correo institucional a dar de baja <span className="text-red-500">*</span></label>
                    <input 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={form.correo_institucional}
                      onChange={(e) => handleChange('correo_institucional', e.target.value)} 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Motivo de baja <span className="text-red-500">*</span> (mínimo 10 caracteres)</label>
                    <textarea 
                      className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
                      rows={3} 
                      value={form.motivo_baja}
                      onChange={(e) => handleChange('motivo_baja', e.target.value)} 
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Estatus */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Seguimiento</div>
            <div className="p-4 bg-blue-50/10">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Estatus</label>
              <select 
                className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={form.estatus}
                onChange={(e) => handleChange('estatus', e.target.value)}
              >
                <option value="generada">Generada</option>
                <option value="en_proceso">En proceso</option>
                <option value="autorizada">Autorizada</option>
                <option value="rechazada">Rechazada</option>
                <option value="finalizada">Finalizada</option>
              </select>
            </div>
          </div>

          {errores.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 shadow-xs">
              <ul className="text-red-700 text-sm list-disc pl-4 space-y-1 font-medium">
                {errores.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-blue-100 bg-blue-50/20">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
          >
            ✕ Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition shadow-sm"
          >
            💾 {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}