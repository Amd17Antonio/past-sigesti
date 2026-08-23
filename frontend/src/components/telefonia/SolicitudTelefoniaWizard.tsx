import { useEffect, useMemo, useState } from 'react';
import { TRAMITES } from './TramitesConfig';
import BuscarPorExtension from './BuscarPorExtension';
import ResumenUsuarioTelefonia from './ResumenUsuarioTelefonia';
import { getCatalogo } from '../../services/catalogoService';

import {
  getCategoriasTelefonia, crearSolicitudTelefonia,
} from '../../services/solicitudTelefoniaService';

interface Props {
  onClose: () => void;
  onCreado: () => void;
  onBack: () => void;
}

interface Autoriza { id: number; nombre: string; cargo?: string; correo?: string }

// TODO: reemplazar por catálogo real (getCatalogo('complejos')) cuando exista en backend.
const COMPLEJOS = [
  'Complejo Administrativo',
  'Complejo Judicial',
];

function ResumenActualCambioUsuario({ usuario }: { usuario: any }) {
  const nombreCompleto = [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno]
    .filter(Boolean).join(' ');
  return (
    <div className="border rounded overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-semibold text-sm text-gray-700 border-b">
        Datos del Usuario Actual
      </div>
      <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-white">
        <CampoLectura label="Nombre Usuario" value={nombreCompleto || '-'} />
        <CampoLectura label="No. de Extensión" value={usuario.extension} />
        <CampoLectura label="Dependencia" value={usuario.direccion || usuario.puesto} />
        <CampoLectura label="Equipo (Tipo)" value={usuario.modelo} />
        <CampoLectura label="Edificio" value={usuario.edificio} />
        <CampoLectura label="Nivel" value={usuario.nivel} />
      </div>
    </div>
  );
}

function ResumenPersonaTelefonia({ titulo, usuario }: { titulo: string; usuario: any }) {
  const nombreCompleto = [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno]
    .filter(Boolean).join(' ');
  return (
    <div className="border rounded overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-semibold text-sm text-gray-700 border-b">
        {titulo}
      </div>
      <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-white">
        <CampoLectura label="Nombre Usuario" value={nombreCompleto || '-'} />
        <CampoLectura label="No. de Extensión" value={usuario.extension} />
        <CampoLectura label="Dependencia" value={usuario.direccion || usuario.puesto} />
        <CampoLectura label="Equipo (Tipo)" value={usuario.modelo} />
        <CampoLectura label="Edificio" value={usuario.edificio} />
        <CampoLectura label="Nivel" value={usuario.nivel} />
      </div>
    </div>
  );
}

function getUbicaciones(complejo: string): { value: string; label: string }[] {
  if (complejo === 'Complejo Administrativo') {
    return Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Edificio ${i + 1}` }));
  }
  if (complejo === 'Complejo Judicial') {
    return Array.from({ length: 16 }, (_, i) => ({ value: String(i + 1), label: `Edificio ${i + 1}` }));
  }
  return [];
}

// Lista genérica usada donde no hay un "complejo" seleccionable (ej. Modificar Datos),
// ya que ahí solo se edita la ubicación de un usuario ya existente.
const UBICACIONES = Array.from({ length: 16 }, (_, i) => ({ value: String(i + 1), label: `Edificio ${i + 1}` }));

const NIVELES = [
  { value: 'PB', label: 'Planta Baja' },
  { value: '1', label: 'Nivel 1' },
  { value: '2', label: 'Nivel 2' },
  { value: '3', label: 'Nivel 3' },
];

function formatearFechaHora(fecha: Date) {
  const dd = String(fecha.getDate()).padStart(2, '0');
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const yyyy = fecha.getFullYear();
  const hh = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  const ss = String(fecha.getSeconds()).padStart(2, '0');
  return { fecha: `${dd}/${mm}/${yyyy}`, hora: `${hh}:${min}:${ss}` };
}

// ---------- Shell reutilizable con el estilo de "Nueva Solicitud" ----------

function Shell({
  titulo, children, onClose, onBack, footer, mostrarFechaHora = false, accionDerecha,
}: {
  titulo: string;
  children: React.ReactNode;
  onClose: () => void;
  onBack: () => void;
  footer: React.ReactNode;
  mostrarFechaHora?: boolean;
  accionDerecha?: React.ReactNode;
}) {
  const [{ fecha, hora }] = useState(() => formatearFechaHora(new Date()));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded-lg shadow-xl w-[42rem] max-w-[95vw] max-h-[92vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white px-6 py-4 font-semibold text-lg flex justify-between items-center shrink-0">
          {titulo}
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="px-6 pt-3 shrink-0 flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
          >
            <span>«</span> Regresar al menú
          </button>
          {accionDerecha ?? (mostrarFechaHora && (
            <span className="text-xs text-gray-500">
              <strong className="text-gray-600">Fecha:</strong> {fecha} &nbsp; <strong className="text-gray-600">Hora:</strong> {hora}
            </span>
          ))}
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">{children}</div>

        <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t shrink-0">
          {footer}
        </div>
      </div>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="border rounded overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-semibold text-sm text-gray-700 border-b">
        {titulo}
      </div>
      <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
    </div>
  );
}

function Campo({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="text-xs text-gray-600 block mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'border rounded p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function BotonCancelar({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm inline-flex items-center gap-1">
      ✕ Cancelar
    </button>
  );
}

function BotonEnviar({ onClick, enviando, label = 'Enviar Solicitud' }: { onClick: () => void; enviando: boolean; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={enviando}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50 inline-flex items-center gap-1"
    >
      💾 {enviando ? 'Enviando...' : label}
    </button>
  );
}

// Selector reutilizable de "Persona que autoriza" (catálogo cat_autoriza_internet).
// Usado en los trámites que generan PDF firmado: SOLICITAR_TELEFONO, CAMBIO_PIN_CN,
// CAMBIO_USUARIO, CAMBIO_CATEGORIA y OTROS.
function SelectAutoriza({
  autorizantes, value, onChange,
}: { autorizantes: Autoriza[]; value: string; onChange: (v: string) => void }) {
  const seleccionado = autorizantes.find((a) => a.id === Number(value));
  return (
    <Campo label="Persona que autoriza:" full>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">--Seleccionar--</option>
        {autorizantes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
      </select>
      {seleccionado && (
        <p className="text-xs text-gray-500 mt-1">
          Cargo: {seleccionado.cargo} — Correo: {seleccionado.correo}
        </p>
      )}
    </Campo>
  );
}

// ---------- 1. Solicitar Teléfono ----------

function FormSolicitarTelefono({ onClose, onCreado, onBack }: Props) {
  const [form, setForm] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '', rfc: '', curp: '',
    clave_puesto: '', puesto: '', correo_institucional: '', direccion: '',
    complejo: '', ubicacion: '', nivel: '',
    equipo_computo: 'Si', internet: 'Si', nodo: '',
    arreglo_jefe_secretaria: 'No',
    extension: '',
    nombre_jefe: '', extension_jefe: '',
    nombre_secretaria: '', extension_secretaria: '',
    observaciones: '',
  });
  const [idAutoriza, setIdAutoriza] = useState('');
  const [autorizantes, setAutorizantes] = useState<Autoriza[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros as Autoriza[]));
  }, []);

  const esArregloJefeSecretaria = form.arreglo_jefe_secretaria === 'Si';

  const ubicacionesDisponibles = useMemo(() => getUbicaciones(form.complejo), [form.complejo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'complejo') {
      // Al cambiar de complejo, la ubicación anterior ya no aplica.
      setForm({ ...form, complejo: e.target.value, ubicacion: '' });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Cuando hay arreglo Jefe-Secretaria, la extensión principal del registro es la del Jefe
    const extensionPrincipal = esArregloJefeSecretaria ? form.extension_jefe : form.extension;

    if (!form.nombre || !extensionPrincipal) {
      setError(esArregloJefeSecretaria
        ? 'Nombre y Extensión Jefe son obligatorios.'
        : 'Nombre y Extensión son obligatorios.');
      return;
    }
    if (esArregloJefeSecretaria && (!form.nombre_jefe || !form.nombre_secretaria || !form.extension_secretaria)) {
      setError('Completa Nombre Jefe, Nombre Secretaria y Extensión Secretaria.');
      return;
    }
    if (!idAutoriza) {
      setError('La persona que autoriza es obligatoria.');
      return;
    }
    if (!form.observaciones.trim() || form.observaciones.trim().length < 10) {
      setError('La justificación (observaciones) es obligatoria, mínimo 10 caracteres.');
      return;
    }

    setEnviando(true);
    setError('');
    try {
      const { registrarUsuarioTelefonia } = await import('../../services/solicitudTelefoniaService');
      const nuevo = await registrarUsuarioTelefonia({
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        apellido_materno: form.apellido_materno,
        rfc: form.rfc,
        curp: form.curp,
        clave_puesto: form.clave_puesto,
        puesto: form.puesto,
        correo_institucional: form.correo_institucional,
        direccion: form.direccion,
        ubicacion: form.ubicacion,
        nivel: form.nivel,
        nodo: form.nodo,
        internet: form.internet === 'Si',
        equipo_computo: form.equipo_computo === 'Si',
        extension: extensionPrincipal,
      });

      await crearSolicitudTelefonia({
        usuario_id: nuevo.id,
        tipo_tramite: 'SOLICITAR_TELEFONO',
        id_autoriza: Number(idAutoriza),
        observaciones: form.observaciones,
        detalle: {
          complejo: form.complejo || undefined,
          arreglo_jefe_secretaria: esArregloJefeSecretaria,
          ...(esArregloJefeSecretaria && {
            nombre_jefe: form.nombre_jefe,
            extension_jefe: form.extension_jefe,
            nombre_secretaria: form.nombre_secretaria,
            extension_secretaria: form.extension_secretaria,
          }),
        },
      });

      onCreado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Shell
      titulo="Solicitud de Teléfono"
      onClose={onClose}
      onBack={onBack}
      mostrarFechaHora
      footer={<><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></>}
    >
      <Seccion titulo="Datos Personales">
        <Campo label="Nombre:"><input name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Correo Electrónico:"><input name="correo_institucional" value={form.correo_institucional} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Apellido Paterno:"><input name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Dirección:"><input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Apellido Materno:"><input name="apellido_materno" value={form.apellido_materno} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Complejo:">
          <select name="complejo" value={form.complejo} onChange={handleChange} className={inputClass}>
            <option value="">Elegir un Complejo...</option>
            {COMPLEJOS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Campo>
        <Campo label="RFC:"><input name="rfc" value={form.rfc} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Ubicación:">
          <select
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            disabled={!form.complejo}
            className={inputClass}
          >
            <option value="">{form.complejo ? 'Selecciona opción...' : 'Elige un complejo primero'}</option>
            {ubicacionesDisponibles.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
        </Campo>
        <Campo label="CURP:"><input name="curp" value={form.curp} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Nivel:">
          <select name="nivel" value={form.nivel} onChange={handleChange} className={inputClass}>
            <option value="">Selecciona opción...</option>
            {NIVELES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>
        </Campo>
        <Campo label="Clave de Puesto:"><input name="clave_puesto" value={form.clave_puesto} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Equipo de Cómputo:">
          <select name="equipo_computo" value={form.equipo_computo} onChange={handleChange} className={inputClass}>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
        </Campo>
        <Campo label="Puesto:"><input name="puesto" value={form.puesto} onChange={handleChange} className={inputClass} /></Campo>
        <Campo label="Internet:">
          <select name="internet" value={form.internet} onChange={handleChange} className={inputClass}>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
        </Campo>
      </Seccion>

      <Seccion titulo="Datos de Red y Jefe - Secretaria">
        <Campo label="Arreglo Jefe - Secretaria:">
          <select name="arreglo_jefe_secretaria" value={form.arreglo_jefe_secretaria} onChange={handleChange} className={inputClass}>
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
        </Campo>
        <Campo label="Nodo:"><input name="nodo" value={form.nodo} onChange={handleChange} className={inputClass} /></Campo>

        {esArregloJefeSecretaria ? (
          <>
            <Campo label="Nombre Jefe:"><input name="nombre_jefe" value={form.nombre_jefe} onChange={handleChange} className={inputClass} /></Campo>
            <Campo label="Extensión Jefe:"><input name="extension_jefe" value={form.extension_jefe} onChange={handleChange} className={inputClass} /></Campo>
            <Campo label="Nombre Secretaria:"><input name="nombre_secretaria" value={form.nombre_secretaria} onChange={handleChange} className={inputClass} /></Campo>
            <Campo label="Extensión Secretaria:"><input name="extension_secretaria" value={form.extension_secretaria} onChange={handleChange} className={inputClass} /></Campo>
          </>
        ) : (
          <Campo label="Extensión:"><input name="extension" value={form.extension} onChange={handleChange} className={inputClass} /></Campo>
        )}

        <SelectAutoriza autorizantes={autorizantes} value={idAutoriza} onChange={setIdAutoriza} />

        <Campo label="Observaciones:" full>
          <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={3} className={inputClass} />
        </Campo>
      </Seccion>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- 2. Cambio clave PIN o CN ----------

// Fila de solo lectura con estilo tipo "formato viejo" (etiqueta arriba, valor abajo)
function CampoLectura({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs text-gray-500 block">{label}:</span>
      <span className="text-sm text-gray-800 font-medium">{value ?? '-'}</span>
    </div>
  );
}

function FormCambioPinCn({ onClose, onCreado, onBack }: Props) {
  const [usuario, setUsuario] = useState<any>(null);
  const [correo, setCorreo] = useState('');
  const [motivo, setMotivo] = useState('Extravío');
  const [observaciones, setObservaciones] = useState('');
  const [idAutoriza, setIdAutoriza] = useState('');
  const [autorizantes, setAutorizantes] = useState<Autoriza[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros as Autoriza[]));
  }, []);

  const handleEncontrado = (u: any) => {
    setUsuario(u);
    // Precarga el correo institucional del usuario; sigue siendo editable.
    setCorreo(u.correo_institucional ?? '');
  };

  const handleBuscarOtro = () => {
    setUsuario(null);
    setCorreo('');
    setMotivo('Extravío');
    setObservaciones('');
    setIdAutoriza('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!usuario) { setError('Busca primero al usuario por extensión.'); return; }
    if (!correo) { setError('El correo electrónico es obligatorio.'); return; }
    if (!idAutoriza) { setError('La persona que autoriza es obligatoria.'); return; }
    if (!observaciones.trim() || observaciones.trim().length < 10) {
      setError('La justificación (observaciones) es obligatoria, mínimo 10 caracteres.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: usuario.id,
        tipo_tramite: 'CAMBIO_PIN_CN',
        id_autoriza: Number(idAutoriza),
        observaciones,
        detalle: { tipo_clave: usuario.tipo_clave, motivo_cambio: motivo, correo_notificacion: correo || undefined },
      });
      onCreado();
      onClose();
    } catch {
      setError('No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  const nombreCompleto = usuario
    ? [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno].filter(Boolean).join(' ')
    : '';

  return (
    <Shell
      titulo="Cambio de clave, PIN o CN"
      onClose={onClose}
      onBack={onBack}
      accionDerecha={usuario && (
        <button
          type="button"
          onClick={handleBuscarOtro}
          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
        >
          Buscar otro usuario <span>»</span>
        </button>
      )}
      footer={usuario ? <><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></> : <BotonCancelar onClick={onClose} />}
    >
      {!usuario ? (
        <Seccion titulo="Buscar Usuario">
          <div className="col-span-2"><BuscarPorExtension onEncontrado={handleEncontrado} /></div>
        </Seccion>
      ) : (
        <>
          <div className="border rounded overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2 font-semibold text-sm">
              Cambio de clave, PIN o CN
            </div>
            <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-white">
              <CampoLectura label="Nombre Usuario" value={nombreCompleto || '-'} />
              <CampoLectura label="No. de Extensión" value={usuario.extension} />
              <CampoLectura label="Dependencia" value={usuario.direccion || usuario.puesto} />
              <CampoLectura label="Equipo (Tipo)" value={usuario.modelo} />
              <CampoLectura label="Edificio" value={usuario.edificio} />
              <CampoLectura label="Nivel" value={usuario.nivel} />
              <CampoLectura label="Clave (Tipo)" value={usuario.tipo_clave} />
            </div>
          </div>

          <Seccion titulo="Datos del Cambio">
            <Campo label="Correo Electrónico:">
              <input value={correo} onChange={(e) => setCorreo(e.target.value)} className={inputClass} />
            </Campo>
            <Campo label="Motivo del Cambio:">
              <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={inputClass}>
                <option value="Extravío">Extravío</option>
                <option value="Olvido">Olvido</option>
                <option value="Otro">Otro</option>
              </select>
            </Campo>
            <SelectAutoriza autorizantes={autorizantes} value={idAutoriza} onChange={setIdAutoriza} />
            <Campo label="Observaciones:" full>
              <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className={inputClass} />
            </Campo>
          </Seccion>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- 3. Cambio de Usuario ----------
function FormCambioUsuario({ onClose, onCreado, onBack }: Props) {
  const [actual, setActual] = useState<any>(null);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [nuevo, setNuevo] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '', rfc: '', curp: '',
    clave_puesto: '', correo_institucional: '', direccion: '',
    ubicacion: '', nivel: '',
    equipo_computo: 'Si', internet: 'Si', nodo: '',
    arreglo_jefe_secretaria: 'No',
    nombre_jefe: '', extension_jefe: '',
    nombre_secretaria: '', extension_secretaria: '',
  });
  const [observaciones, setObservaciones] = useState('');
  const [idAutoriza, setIdAutoriza] = useState('');
  const [autorizantes, setAutorizantes] = useState<Autoriza[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros as Autoriza[]));
  }, []);

  const esArregloJefeSecretaria = nuevo.arreglo_jefe_secretaria === 'Si';

  const handleEncontrado = (u: any) => {
    setActual(u);
    setPaso(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!actual || !nuevo.nombre) { setError('Captura al menos el nombre del nuevo usuario.'); return; }
    if (esArregloJefeSecretaria && (!nuevo.nombre_jefe || !nuevo.extension_jefe || !nuevo.nombre_secretaria || !nuevo.extension_secretaria)) {
      setError('Completa Nombre Jefe, Extensión Jefe, Nombre Secretaria y Extensión Secretaria.');
      return;
    }
    if (!idAutoriza) { setError('La persona que autoriza es obligatoria.'); return; }
    if (!observaciones.trim() || observaciones.trim().length < 10) {
      setError('La justificación (observaciones) es obligatoria, mínimo 10 caracteres.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: actual.id,
        tipo_tramite: 'CAMBIO_USUARIO',
        id_autoriza: Number(idAutoriza),
        observaciones,
        detalle: { nuevo_usuario: nuevo },
      });
      onCreado();
      onClose();
    } catch {
      setError('No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  const footer = paso === 1
    ? (
      <>
        <BotonCancelar onClick={onClose} />
        {actual && (
          <button
            onClick={() => setPaso(2)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm inline-flex items-center gap-1"
          >
            Cambiar Usuario »
          </button>
        )}
      </>
    )
    : <><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></>;

  return (
    <Shell
      titulo="Cambio de Usuario"
      onClose={onClose}
      onBack={onBack}
      mostrarFechaHora={paso === 2}
      footer={footer}
    >
      <Seccion titulo="Usuario Actual">
        <div className="col-span-2"><BuscarPorExtension onEncontrado={handleEncontrado} /></div>
      </Seccion>

      {actual && <ResumenActualCambioUsuario usuario={actual} />}

      {actual && paso === 2 && (
        <Seccion titulo="Datos del Nuevo Usuario">
          <Campo label="Nombre:"><input name="nombre" value={nuevo.nombre} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Correo Electrónico:"><input name="correo_institucional" value={nuevo.correo_institucional} onChange={handleChange} className={inputClass} /></Campo>

          <Campo label="Apellido Paterno:"><input name="apellido_paterno" value={nuevo.apellido_paterno} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Dirección:"><input name="direccion" value={nuevo.direccion} onChange={handleChange} className={inputClass} /></Campo>

          <Campo label="Apellido Materno:"><input name="apellido_materno" value={nuevo.apellido_materno} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Ubicación:">
            <select name="ubicacion" value={nuevo.ubicacion} onChange={handleChange} className={inputClass}>
              <option value="">-- Ubicación --</option>
              {UBICACIONES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </Campo>

          <Campo label="RFC:"><input name="rfc" value={nuevo.rfc} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Nivel:">
            <select name="nivel" value={nuevo.nivel} onChange={handleChange} className={inputClass}>
              <option value="">-- Nivel --</option>
              {NIVELES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>
          </Campo>

          <Campo label="CURP:"><input name="curp" value={nuevo.curp} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Equipo de Cómputo:">
            <select name="equipo_computo" value={nuevo.equipo_computo} onChange={handleChange} className={inputClass}>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </Campo>

          <Campo label="Clave de Puesto:"><input name="clave_puesto" value={nuevo.clave_puesto} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Internet:">
            <select name="internet" value={nuevo.internet} onChange={handleChange} className={inputClass}>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </Campo>

          <Campo label="Arreglo Jefe - Secretaria:">
            <select name="arreglo_jefe_secretaria" value={nuevo.arreglo_jefe_secretaria} onChange={handleChange} className={inputClass}>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </Campo>
          <Campo label="Nodo:"><input name="nodo" value={nuevo.nodo} onChange={handleChange} className={inputClass} /></Campo>

          {esArregloJefeSecretaria && (
            <>
              <Campo label="Nombre Jefe:"><input name="nombre_jefe" value={nuevo.nombre_jefe} onChange={handleChange} className={inputClass} /></Campo>
              <Campo label="Extensión Jefe:"><input name="extension_jefe" value={nuevo.extension_jefe} onChange={handleChange} className={inputClass} /></Campo>
              <Campo label="Nombre Secretaria:"><input name="nombre_secretaria" value={nuevo.nombre_secretaria} onChange={handleChange} className={inputClass} /></Campo>
              <Campo label="Extensión Secretaria:"><input name="extension_secretaria" value={nuevo.extension_secretaria} onChange={handleChange} className={inputClass} /></Campo>
            </>
          )}

          <SelectAutoriza autorizantes={autorizantes} value={idAutoriza} onChange={setIdAutoriza} />

          <Campo label="Observaciones:" full>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className={inputClass} />
          </Campo>
        </Seccion>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- 4. Modificar Datos ----------
const CAMPOS_REQUERIDOS_MODIFICAR: { key: string; label: string }[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido_paterno', label: 'Apellido Paterno' },
  { key: 'apellido_materno', label: 'Apellido Materno' },
  { key: 'rfc', label: 'RFC' },
  { key: 'curp', label: 'CURP' },
  { key: 'clave_puesto', label: 'Clave de Puesto' },
  { key: 'puesto', label: 'Puesto' },
  { key: 'correo_institucional', label: 'Correo Electrónico' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'ubicacion', label: 'Ubicación' },
  { key: 'nivel', label: 'Nivel' },
];

function FormModificarDatos({ onClose, onCreado, onBack }: Props) {
  const [usuario, setUsuario] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleEncontrado = (u: any) => {
    setUsuario(u);
    setForm({
      nombre: u.nombre ?? '',
      apellido_paterno: u.apellido_paterno ?? '',
      apellido_materno: u.apellido_materno ?? '',
      rfc: u.rfc ?? '',
      curp: u.curp ?? '',
      clave_puesto: u.clave_puesto ?? '',
      puesto: u.puesto ?? '',
      correo_institucional: u.correo_institucional ?? '',
      direccion: u.direccion ?? '',
      ubicacion: u.ubicacion ?? '',
      nivel: u.nivel ?? '',
      equipo_computo: u.equipo_computo ? 'Si' : 'No',
      internet: u.internet ? 'Si' : 'No',
      nodo: u.nodo ?? '',
      extension_jefe: u.extension_jefe ?? '',
      extension_secretaria: u.extension_secretaria ?? '',
      observaciones: '',
    });
    setError('');
  };

  const handleBuscarOtro = () => {
    setUsuario(null);
    setForm(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!usuario) { setError('Busca primero al usuario por extensión.'); return; }

    const faltantes = CAMPOS_REQUERIDOS_MODIFICAR.filter(({ key }) => !String(form[key] ?? '').trim());
    if (faltantes.length > 0) {
      setError(`Completa los siguientes campos: ${faltantes.map((f) => f.label).join(', ')}.`);
      return;
    }

    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: usuario.id,
        tipo_tramite: 'MODIFICAR_DATOS',
        observaciones: form.observaciones || undefined,
        detalle: {
          campos_modificados: {
            ...form,
            equipo_computo: form.equipo_computo === 'Si',
            internet: form.internet === 'Si',
          },
        },
      });
      onCreado();
      onClose();
    } catch {
      setError('No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Shell
      titulo="Modificar Datos"
      onClose={onClose}
      onBack={onBack}
      mostrarFechaHora={!!usuario}
      accionDerecha={usuario && (
        <button
          type="button"
          onClick={handleBuscarOtro}
          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
        >
          Buscar otro usuario <span>»</span>
        </button>
      )}
      footer={usuario ? <><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></> : <BotonCancelar onClick={onClose} />}
    >
      {!usuario ? (
        <Seccion titulo="Buscar Usuario">
          <div className="col-span-2"><BuscarPorExtension onEncontrado={handleEncontrado} /></div>
        </Seccion>
      ) : (
        <Seccion titulo="Datos a Modificar">
          <Campo label="Nombre:"><input name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Correo Electrónico:"><input name="correo_institucional" value={form.correo_institucional} onChange={handleChange} className={inputClass} /></Campo>

          <Campo label="Apellido Paterno:"><input name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Dirección:"><input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass} /></Campo>

          <Campo label="Apellido Materno:"><input name="apellido_materno" value={form.apellido_materno} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Ubicación:">
            <select name="ubicacion" value={form.ubicacion} onChange={handleChange} className={inputClass}>
              <option value="">-- Ubicación --</option>
              {UBICACIONES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </Campo>

          <Campo label="RFC:"><input name="rfc" value={form.rfc} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Nivel:">
            <select name="nivel" value={form.nivel} onChange={handleChange} className={inputClass}>
              <option value="">-- Nivel --</option>
              {NIVELES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>
          </Campo>

          <Campo label="CURP:"><input name="curp" value={form.curp} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Equipo de Cómputo:">
            <select name="equipo_computo" value={form.equipo_computo} onChange={handleChange} className={inputClass}>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </Campo>

          <Campo label="Clave de Puesto:"><input name="clave_puesto" value={form.clave_puesto} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Internet:">
            <select name="internet" value={form.internet} onChange={handleChange} className={inputClass}>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </Campo>

          <Campo label="Puesto:"><input name="puesto" value={form.puesto} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Nodo:"><input name="nodo" value={form.nodo} onChange={handleChange} className={inputClass} /></Campo>

          <Campo label="Extensión Jefe:"><input name="extension_jefe" value={form.extension_jefe} onChange={handleChange} className={inputClass} /></Campo>
          <Campo label="Extensión Secretaria:"><input name="extension_secretaria" value={form.extension_secretaria} onChange={handleChange} className={inputClass} /></Campo>

          <Campo label="Observaciones:" full>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={2} className={inputClass} />
          </Campo>
        </Seccion>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- 5. Arreglo Jefe - Secretaria ----------
// Datos identificatorios editables (nombre, apellidos, extensión) de una persona
function DatosPersonaEditable({
  titulo, datos, onChange,
}: {
  titulo: string;
  datos: { nombre: string; apellido_paterno: string; apellido_materno: string; extension: string };
  onChange: (campo: string, valor: string) => void;
}) {
  return (
    <div className="border rounded overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-2 font-semibold text-sm">{titulo}</div>
      <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-white">
        <Campo label="Nombre:">
          <input value={datos.nombre} onChange={(e) => onChange('nombre', e.target.value)} className={inputClass} />
        </Campo>
        <Campo label="Extensión:">
          <input value={datos.extension} onChange={(e) => onChange('extension', e.target.value)} className={inputClass} />
        </Campo>
        <Campo label="Apellido Paterno:">
          <input value={datos.apellido_paterno} onChange={(e) => onChange('apellido_paterno', e.target.value)} className={inputClass} />
        </Campo>
        <Campo label="Apellido Materno:">
          <input value={datos.apellido_materno} onChange={(e) => onChange('apellido_materno', e.target.value)} className={inputClass} />
        </Campo>
      </div>
    </div>
  );
}

// Datos de solo lectura (dependencia, equipo, edificio, nivel) - fijos de la base
function DatosLecturaTelefonia({ usuario }: { usuario: any }) {
  return (
    <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-gray-50 border rounded">
      <CampoLectura label="Dependencia" value={usuario.direccion || usuario.puesto} />
      <CampoLectura label="Equipo (Tipo)" value={usuario.modelo} />
      <CampoLectura label="Edificio" value={usuario.edificio} />
      <CampoLectura label="Nivel" value={usuario.nivel} />
    </div>
  );
}

function FormJefeSecretaria({ onClose, onCreado, onBack }: Props) {
  const [jefeBase, setJefeBase] = useState<any>(null);
  const [secretariaBase, setSecretariaBase] = useState<any>(null);

  const [datosJefe, setDatosJefe] = useState({ nombre: '', apellido_paterno: '', apellido_materno: '', extension: '' });
  const [datosSecretaria, setDatosSecretaria] = useState({ nombre: '', apellido_paterno: '', apellido_materno: '', extension: '' });

  const [mismosPrivilegios, setMismosPrivilegios] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleEncontradoJefe = (u: any) => {
    setJefeBase(u);
    setDatosJefe({
      nombre: u.nombre ?? '',
      apellido_paterno: u.apellido_paterno ?? '',
      apellido_materno: u.apellido_materno ?? '',
      extension: u.extension ?? '',
    });
  };

  const handleEncontradaSecretaria = (u: any) => {
    setSecretariaBase(u);
    setDatosSecretaria({
      nombre: u.nombre ?? '',
      apellido_paterno: u.apellido_paterno ?? '',
      apellido_materno: u.apellido_materno ?? '',
      extension: u.extension ?? '',
    });
  };

  const handleChangeJefe = (campo: string, valor: string) => setDatosJefe({ ...datosJefe, [campo]: valor });
  const handleChangeSecretaria = (campo: string, valor: string) => setDatosSecretaria({ ...datosSecretaria, [campo]: valor });

  const validar = (datos: typeof datosJefe, etiqueta: string): string[] => {
    const faltantes: string[] = [];
    if (!datos.nombre.trim()) faltantes.push(`Nombre (${etiqueta})`);
    if (!datos.apellido_paterno.trim()) faltantes.push(`Apellido Paterno (${etiqueta})`);
    if (!datos.apellido_materno.trim()) faltantes.push(`Apellido Materno (${etiqueta})`);
    if (!datos.extension.trim()) faltantes.push(`Extensión (${etiqueta})`);
    return faltantes;
  };

  const handleSubmit = async () => {
    if (!jefeBase || !secretariaBase) {
      setError('Busca ambas extensiones (jefe y secretaria) antes de enviar.');
      return;
    }

    const faltantes = [...validar(datosJefe, 'Jefe'), ...validar(datosSecretaria, 'Secretaria')];
    if (faltantes.length > 0) {
      setError(`Completa los siguientes datos: ${faltantes.join(', ')}.`);
      return;
    }

    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: jefeBase.id,
        tipo_tramite: 'JEFE_SECRETARIA',
        observaciones: observaciones || undefined,
        detalle: {
          jefe_usuario_id: jefeBase.id,
          secretaria_usuario_id: secretariaBase.id,

          nombre_jefe: datosJefe.nombre,
          apellido_paterno_jefe: datosJefe.apellido_paterno,
          apellido_materno_jefe: datosJefe.apellido_materno,
          extension_jefe: datosJefe.extension,

          nombre_secretaria: datosSecretaria.nombre,
          apellido_paterno_secretaria: datosSecretaria.apellido_paterno,
          apellido_materno_secretaria: datosSecretaria.apellido_materno,
          extension_secretaria: datosSecretaria.extension,

          mismos_privilegios: mismosPrivilegios,
        },
      });
      onCreado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Shell
      titulo="Solicitud arreglo Jefe - Secretaria"
      onClose={onClose}
      onBack={onBack}
      mostrarFechaHora
      footer={<><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></>}
    >
      <Seccion titulo="Buscar Jefe">
        <div className="col-span-2"><BuscarPorExtension label="Extensión Jefe" onEncontrado={handleEncontradoJefe} /></div>
      </Seccion>
      {jefeBase && (
        <>
          <DatosPersonaEditable titulo="Datos del Jefe" datos={datosJefe} onChange={handleChangeJefe} />
          <DatosLecturaTelefonia usuario={jefeBase} />
        </>
      )}

      <Seccion titulo="Buscar Secretaria">
        <div className="col-span-2"><BuscarPorExtension label="Extensión Secretaria" onEncontrado={handleEncontradaSecretaria} /></div>
      </Seccion>
      {secretariaBase && (
        <>
          <DatosPersonaEditable titulo="Datos de la Secretaria" datos={datosSecretaria} onChange={handleChangeSecretaria} />
          <DatosLecturaTelefonia usuario={secretariaBase} />
        </>
      )}

      <Seccion titulo="Detalles">
        <label className="col-span-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={mismosPrivilegios} onChange={(e) => setMismosPrivilegios(e.target.checked)} />
          Mismos Privilegios
        </label>
        <Campo label="Observación:" full>
          <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className={inputClass} />
        </Campo>
      </Seccion>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- 6. Cambio de DID ----------
function FormCambioDid({ onClose, onCreado, onBack }: Props) {
  const [usuario, setUsuario] = useState<any>(null);
  const [nuevaExtension, setNuevaExtension] = useState('');
  const [numeroDid, setNumeroDid] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async () => {
    if (!usuario || !nuevaExtension || !numeroDid || !justificacion) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: usuario.id,
        tipo_tramite: 'CAMBIO_DID',
        observaciones: justificacion,
        detalle: { extension_actual: usuario.extension, nueva_extension: nuevaExtension, numero_did: numeroDid, justificacion },
      });
      onCreado();
      onClose();
    } catch {
      setError('No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Shell
      titulo="Cambio de DID"
      onClose={onClose}
      onBack={onBack}
      footer={<><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></>}
    >
      <Seccion titulo="Extensión Actual">
        <div className="col-span-2"><BuscarPorExtension label="Extensión Actual" onEncontrado={setUsuario} /></div>
        {usuario && <div className="col-span-2"><ResumenUsuarioTelefonia usuario={usuario} /></div>}
      </Seccion>

      <Seccion titulo="Datos del Cambio">
        <Campo label="Nueva Extensión:"><input value={nuevaExtension} onChange={(e) => setNuevaExtension(e.target.value)} className={inputClass} /></Campo>
        <Campo label="Número DID:"><input value={numeroDid} onChange={(e) => setNumeroDid(e.target.value)} className={inputClass} /></Campo>
        <Campo label="Justificación:" full>
          <textarea value={justificacion} onChange={(e) => setJustificacion(e.target.value)} rows={3} className={inputClass} />
        </Campo>
      </Seccion>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- 7. Cambio de Categoría ----------
function FormCambioCategoria({ onClose, onCreado, onBack }: Props) {
  const [usuario, setUsuario] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [puesto, setPuesto] = useState('');
  const [correo, setCorreo] = useState('');
  const [clavePuesto, setClavePuesto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [idAutoriza, setIdAutoriza] = useState('');
  const [autorizantes, setAutorizantes] = useState<Autoriza[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { getCategoriasTelefonia().then(setCategorias); }, []);
  useEffect(() => {
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros as Autoriza[]));
  }, []);

  const handleEncontrado = (u: any) => {
    setUsuario(u);
    setPuesto(u.puesto ?? '');
    setCorreo(u.correo_institucional ?? '');
    setClavePuesto(u.clave_puesto ?? '');
    setDireccion(u.direccion ?? '');
    setCategoriaId(u.categoria_id ? String(u.categoria_id) : '');
    setJustificacion('');
    setError('');
  };

  const handleBuscarOtro = () => {
    setUsuario(null);
    setPuesto('');
    setCorreo('');
    setClavePuesto('');
    setDireccion('');
    setCategoriaId('');
    setJustificacion('');
    setIdAutoriza('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!usuario) { setError('Busca primero al usuario por extensión.'); return; }
    if (!puesto || !correo || !clavePuesto || !direccion || !categoriaId || !justificacion) {
      setError('Completa todos los campos.');
      return;
    }
    if (!idAutoriza) { setError('La persona que autoriza es obligatoria.'); return; }
    if (justificacion.trim().length < 10) {
      setError('La justificación debe tener al menos 10 caracteres.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: usuario.id,
        tipo_tramite: 'CAMBIO_CATEGORIA',
        id_autoriza: Number(idAutoriza),
        observaciones: justificacion,
        detalle: {
          categoria_id: Number(categoriaId),
          puesto,
          correo_institucional: correo,
          clave_puesto: clavePuesto,
          direccion,
          justificacion,
        },
      });
      onCreado();
      onClose();
    } catch {
      setError('No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  const nombreCompleto = usuario
    ? [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno].filter(Boolean).join(' ')
    : '';

  return (
    <Shell
      titulo="Cambio de Categoría (privilegios)"
      onClose={onClose}
      onBack={onBack}
      mostrarFechaHora={!!usuario}
      accionDerecha={usuario && (
        <button
          type="button"
          onClick={handleBuscarOtro}
          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
        >
          Buscar otro usuario <span>»</span>
        </button>
      )}
      footer={usuario ? <><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></> : <BotonCancelar onClick={onClose} />}
    >
      {!usuario ? (
        <Seccion titulo="Buscar Usuario">
          <div className="col-span-2"><BuscarPorExtension onEncontrado={handleEncontrado} /></div>
        </Seccion>
      ) : (
        <>
          <div className="border rounded overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2 font-semibold text-sm">
              Cambio de Categoría (privilegios)
            </div>
            <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-white">
              <CampoLectura label="Nombre Usuario" value={nombreCompleto || '-'} />
              <CampoLectura label="No. de Extensión" value={usuario.extension} />
              <CampoLectura label="Dependencia" value={usuario.direccion || usuario.puesto} />
              <CampoLectura label="Equipo (Tipo)" value={usuario.modelo} />
              <CampoLectura label="Edificio" value={usuario.edificio} />
              <CampoLectura label="Nivel" value={usuario.nivel} />
            </div>
          </div>

          <Seccion titulo="Datos del Cambio">
            <Campo label="Clave de Puesto:"><input value={clavePuesto} onChange={(e) => setClavePuesto(e.target.value)} className={inputClass} /></Campo>
            <Campo label="Puesto:"><input value={puesto} onChange={(e) => setPuesto(e.target.value)} className={inputClass} /></Campo>

            <Campo label="Dirección:"><input value={direccion} onChange={(e) => setDireccion(e.target.value)} className={inputClass} /></Campo>
            <Campo label="Correo Electrónico:"><input value={correo} onChange={(e) => setCorreo(e.target.value)} className={inputClass} /></Campo>

            <Campo label="Categoría:">
              <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={inputClass}>
                <option value="">Seleccione</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.categoria}</option>)}
              </select>
            </Campo>

            <SelectAutoriza autorizantes={autorizantes} value={idAutoriza} onChange={setIdAutoriza} />

            <Campo label="Justificación:" full>
              <textarea value={justificacion} onChange={(e) => setJustificacion(e.target.value)} rows={3} className={inputClass} />
            </Campo>
          </Seccion>
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- 8. Otra Solicitud ----------
function FormOtros({ onClose, onCreado, onBack }: Props) {
  const [extensiones, setExtensiones] = useState('');
  const [nodos, setNodos] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [idAutoriza, setIdAutoriza] = useState('');
  const [autorizantes, setAutorizantes] = useState<Autoriza[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros as Autoriza[]));
  }, []);

  const handleSubmit = async () => {
    if (!descripcion) {
      setError('La descripción del problema es obligatoria.');
      return;
    }
    if (!idAutoriza) { setError('La persona que autoriza es obligatoria.'); return; }
    if (!observaciones.trim() || observaciones.trim().length < 10) {
      setError('La justificación (observaciones) es obligatoria, mínimo 10 caracteres.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        tipo_tramite: 'OTROS',
        id_autoriza: Number(idAutoriza),
        observaciones,
        detalle: {
          extensiones: extensiones || undefined,
          nodos: nodos || undefined,
          descripcion_problema: descripcion,
        },
      });
      onCreado();
      onClose();
    } catch {
      setError('No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Shell
      titulo="Otra Solicitud"
      onClose={onClose}
      onBack={onBack}
      footer={<><BotonCancelar onClick={onClose} /><BotonEnviar onClick={handleSubmit} enviando={enviando} /></>}
    >
      <Seccion titulo="Detalles de la Solicitud">
        <Campo label="Extensión (es):" full>
          <textarea value={extensiones} onChange={(e) => setExtensiones(e.target.value)} rows={2} className={inputClass} />
        </Campo>
        <Campo label="Nodo (s):" full>
          <textarea value={nodos} onChange={(e) => setNodos(e.target.value)} rows={2} className={inputClass} />
        </Campo>
        <Campo label="Descripción del problema:" full>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className={inputClass} />
        </Campo>

        <SelectAutoriza autorizantes={autorizantes} value={idAutoriza} onChange={setIdAutoriza} />

        <Campo label="Observaciones:" full>
          <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3} className={inputClass} />
        </Campo>
      </Seccion>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Shell>
  );
}

// ---------- Wizard principal (menú) ----------
export default function SolicitudTelefoniaWizard({ onClose, onCreado }: { onClose: () => void; onCreado: () => void }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);
  const volverAlMenu = () => setTipoSeleccionado(null);

  if (tipoSeleccionado === 'SOLICITAR_TELEFONO') return <FormSolicitarTelefono onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;
  if (tipoSeleccionado === 'CAMBIO_PIN_CN') return <FormCambioPinCn onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;
  if (tipoSeleccionado === 'CAMBIO_USUARIO') return <FormCambioUsuario onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;
  if (tipoSeleccionado === 'MODIFICAR_DATOS') return <FormModificarDatos onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;
  if (tipoSeleccionado === 'JEFE_SECRETARIA') return <FormJefeSecretaria onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;
  if (tipoSeleccionado === 'CAMBIO_DID') return <FormCambioDid onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;
  if (tipoSeleccionado === 'CAMBIO_CATEGORIA') return <FormCambioCategoria onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;
  if (tipoSeleccionado === 'OTROS') return <FormOtros onClose={onClose} onCreado={onCreado} onBack={volverAlMenu} />;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 font-semibold text-lg flex justify-between items-center">
          Seleccione el tipo de solicitud de telefonía
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none">✕</button>
        </div>
        <ul className="p-5 space-y-1">
          {TRAMITES.map((t) => (
            <li key={t.value}>
              <button
                onClick={() => setTipoSeleccionado(t.value)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded px-2 py-1.5 w-full text-left text-sm transition-colors"
              >
                » {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}