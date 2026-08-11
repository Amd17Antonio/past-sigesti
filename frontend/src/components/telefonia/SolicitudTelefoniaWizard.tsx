import { useEffect, useState } from 'react';
import { TRAMITES } from './TramitesConfig';
import BuscarPorExtension from './BuscarPorExtension';
import ResumenUsuarioTelefonia from './ResumenUsuarioTelefonia';
import RegistrarUsuarioTelefoniaModal from './RegistrarUsuarioTelefoniaModal';
import { formatMac, isValidMac } from '../../utils/mac';

import {
  getCategoriasTelefonia, crearSolicitudTelefonia,
} from '../../services/solicitudTelefoniaService';

interface Props {
  onClose: () => void;
  onCreado: () => void;
}

function Shell({ titulo, children, onClose }: { titulo: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded shadow-lg w-[36rem] max-w-[95vw] overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          {titulo}
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

// ---------- 1. Solicitar Teléfono ----------

function FormSolicitarTelefono({ onClose, onCreado }: Props) {
  const [form, setForm] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '', rfc: '', curp: '',
    clave_puesto: '', puesto: '', correo_institucional: '', direccion: '',
    ubicacion: '', nivel: '', extension: '', nodo: '', internet: 'Si', equipo_computo: 'Si',
    modelo: '', observaciones: '',
  });
  const [mac, setMac] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.extension) {
      setError('Nombre y Extensión son obligatorios.');
      return;
    }
    if (mac && !isValidMac(mac)) {
      setError('La MAC no tiene un formato válido (XX:XX:XX:XX:XX:XX).');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const { registrarUsuarioTelefonia } = await import('../../services/solicitudTelefoniaService');
      const nuevo = await registrarUsuarioTelefonia({
        ...form,
        internet: form.internet === 'Si',
        equipo_computo: form.equipo_computo === 'Si',
        mac: mac || undefined,
        numero_serie: numeroSerie || undefined,
      });
      await crearSolicitudTelefonia({
        usuario_id: nuevo.id,
        tipo_tramite: 'SOLICITAR_TELEFONO',
        observaciones: form.observaciones || undefined,
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
    <Shell titulo="Solicitar Teléfono" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border p-2" />
        <input name="apellido_paterno" placeholder="Apellido Paterno" value={form.apellido_paterno} onChange={handleChange} className="border p-2" />
        <input name="apellido_materno" placeholder="Apellido Materno" value={form.apellido_materno} onChange={handleChange} className="border p-2" />
        <input name="rfc" placeholder="RFC" value={form.rfc} onChange={handleChange} className="border p-2" />
        <input name="curp" placeholder="CURP" value={form.curp} onChange={handleChange} className="border p-2" />
        <input name="clave_puesto" placeholder="Clave de Puesto" value={form.clave_puesto} onChange={handleChange} className="border p-2" />
        <input name="puesto" placeholder="Puesto" value={form.puesto} onChange={handleChange} className="border p-2 col-span-2" />
        <input name="correo_institucional" placeholder="Correo Electrónico" value={form.correo_institucional} onChange={handleChange} className="border p-2" />
        <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="border p-2" />
        <input name="ubicacion" placeholder="Ubicación" value={form.ubicacion} onChange={handleChange} className="border p-2" />
        <input name="nivel" placeholder="Nivel" value={form.nivel} onChange={handleChange} className="border p-2" />
        <input name="extension" placeholder="Extensión" value={form.extension} onChange={handleChange} className="border p-2" />
        <input name="nodo" placeholder="Nodo" value={form.nodo} onChange={handleChange} className="border p-2" />

        <div>
          <label className="text-xs text-gray-600">Equipo de Cómputo:</label>
          <select name="equipo_computo" value={form.equipo_computo} onChange={handleChange} className="border p-2 w-full">
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Internet:</label>
          <select name="internet" value={form.internet} onChange={handleChange} className="border p-2 w-full">
            <option value="Si">Sí</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-3">
        <p className="font-semibold text-sm mb-2">Datos del equipo telefónico</p>
        <div className="grid grid-cols-3 gap-3">
          <input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} className="border p-2" />
          <input
            placeholder="MAC (opcional)"
            value={mac}
            onChange={(e) => setMac(formatMac(e.target.value))}
            maxLength={17}
            className="border p-2 font-mono"
          />
          <input
            placeholder="No. de Serie (opcional)"
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value)}
            className="border p-2"
          />
        </div>
      </div>

      <textarea name="observaciones" placeholder="Observaciones" value={form.observaciones} onChange={handleChange} rows={3} className="border p-2 w-full" />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- 2. Cambio clave PIN o CN ----------
function FormCambioPinCn({ onClose, onCreado }: Props) {
  const [usuario, setUsuario] = useState<any>(null);
  const [correo, setCorreo] = useState('');
  const [tiposClave, setTiposClave] = useState<{ id: number; nombre: string }[]>([]);
  const [tipoClaveId, setTipoClaveId] = useState('');
  const [motivo, setMotivo] = useState('Extravío');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    import('../../services/solicitudTelefoniaService').then(({ getTiposClave }) => {
      getTiposClave().then(setTiposClave);
    });
  }, []);

  const handleSubmit = async () => {
    if (!usuario) { setError('Busca primero al usuario por extensión.'); return; }
    if (!tipoClaveId) { setError('Selecciona si es PIN o CN.'); return; }
    setEnviando(true);
    setError('');
    try {
      const tipoNombre = tiposClave.find((t) => t.id === Number(tipoClaveId))?.nombre;
      await crearSolicitudTelefonia({
        usuario_id: usuario.id,
        tipo_tramite: 'CAMBIO_PIN_CN',
        observaciones: observaciones || undefined,
        detalle: { tipo_clave: tipoNombre, motivo_cambio: motivo, correo_notificacion: correo || undefined },
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
    <Shell titulo="Cambio de clave, PIN o CN" onClose={onClose}>
      <BuscarPorExtension onEncontrado={setUsuario} />
      {usuario && (
        <>
          <ResumenUsuarioTelefonia usuario={usuario} />
          <select value={tipoClaveId} onChange={(e) => setTipoClaveId(e.target.value)} className="border p-2 w-full">
            <option value="">-- Tipo de clave --</option>
            {tiposClave.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <input placeholder="Correo Electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} className="border p-2 w-full" />
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="border p-2 w-full">
            <option value="Extravío">Extravío</option>
            <option value="Olvido">Olvido</option>
            <option value="Otro">Otro</option>
          </select>
          <textarea placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className="border p-2 w-full" />
        </>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando || !usuario} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- 3. Cambio de Usuario ----------
function FormCambioUsuario({ onClose, onCreado }: Props) {
  const [actual, setActual] = useState<any>(null);
  const [nuevo, setNuevo] = useState({
    nombre: '', apellido_paterno: '', apellido_materno: '', rfc: '', curp: '',
    clave_puesto: '', puesto: '', correo_institucional: '',
  });
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!actual || !nuevo.nombre) { setError('Busca al usuario actual y captura al menos el nombre del nuevo usuario.'); return; }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: actual.id,
        tipo_tramite: 'CAMBIO_USUARIO',
        observaciones: observaciones || undefined,
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

  return (
    <Shell titulo="Cambio de Usuario" onClose={onClose}>
      <p className="text-sm font-semibold">Usuario actual</p>
      <BuscarPorExtension onEncontrado={setActual} />
      {actual && <ResumenUsuarioTelefonia usuario={actual} />}

      {actual && (
        <>
          <p className="text-sm font-semibold pt-2">Datos del nuevo usuario</p>
          <div className="grid grid-cols-2 gap-3">
            <input name="nombre" placeholder="Nombre" value={nuevo.nombre} onChange={handleChange} className="border p-2" />
            <input name="apellido_paterno" placeholder="Apellido Paterno" value={nuevo.apellido_paterno} onChange={handleChange} className="border p-2" />
            <input name="apellido_materno" placeholder="Apellido Materno" value={nuevo.apellido_materno} onChange={handleChange} className="border p-2" />
            <input name="rfc" placeholder="RFC" value={nuevo.rfc} onChange={handleChange} className="border p-2" />
            <input name="curp" placeholder="CURP" value={nuevo.curp} onChange={handleChange} className="border p-2" />
            <input name="clave_puesto" placeholder="Clave de Puesto" value={nuevo.clave_puesto} onChange={handleChange} className="border p-2" />
            <input name="puesto" placeholder="Puesto" value={nuevo.puesto} onChange={handleChange} className="border p-2 col-span-2" />
            <input name="correo_institucional" placeholder="Correo Electrónico" value={nuevo.correo_institucional} onChange={handleChange} className="border p-2 col-span-2" />
          </div>
          <textarea placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className="border p-2 w-full" />
        </>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando || !actual} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- 4. Modificar Datos ----------
function FormModificarDatos({ onClose, onCreado }: Props) {
  const [usuario, setUsuario] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleEncontrado = (u: any) => {
    setUsuario(u);
    setForm({
      nombre: u.nombre ?? '', apellido_paterno: u.apellido_paterno ?? '', apellido_materno: u.apellido_materno ?? '',
      correo_institucional: u.correo_institucional ?? '', direccion: u.direccion ?? '',
      ubicacion: u.ubicacion ?? '', nivel: u.nivel ?? '',
      internet: u.internet ? 'Si' : 'No', equipo_computo: u.equipo_computo ? 'Si' : 'No', nodo: u.nodo ?? '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!usuario) { setError('Busca primero al usuario por extensión.'); return; }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: usuario.id,
        tipo_tramite: 'MODIFICAR_DATOS',
        detalle: { campos_modificados: form },
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
    <Shell titulo="Modificar Datos" onClose={onClose}>
      <BuscarPorExtension onEncontrado={handleEncontrado} />
      {form && (
        <div className="grid grid-cols-2 gap-3">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="border p-2" />
          <input name="apellido_paterno" placeholder="Apellido Paterno" value={form.apellido_paterno} onChange={handleChange} className="border p-2" />
          <input name="apellido_materno" placeholder="Apellido Materno" value={form.apellido_materno} onChange={handleChange} className="border p-2" />
          <input name="correo_institucional" placeholder="Correo Electrónico" value={form.correo_institucional} onChange={handleChange} className="border p-2" />
          <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="border p-2" />
          <select name="ubicacion" value={form.ubicacion} onChange={handleChange} className="border p-2">
            <option value="">-- Ubicación --</option>
            <option value="edificio 2">Edificio 2</option>
            <option value="edificio 3">Edificio 3</option>
            <option value="edificio 4">Edificio 4</option>
            <option value="edificio 6">Edificio 6</option>
          </select>
          <input name="nivel" placeholder="Nivel" value={form.nivel} onChange={handleChange} className="border p-2" />
          <input name="nodo" placeholder="Nodo" value={form.nodo} onChange={handleChange} className="border p-2" />
          <select name="equipo_computo" value={form.equipo_computo} onChange={handleChange} className="border p-2">
            <option value="Si">Equipo de Cómputo: Sí</option>
            <option value="No">Equipo de Cómputo: No</option>
          </select>
          <select name="internet" value={form.internet} onChange={handleChange} className="border p-2">
            <option value="Si">Internet: Sí</option>
            <option value="No">Internet: No</option>
          </select>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando || !usuario} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- 5. Arreglo Jefe - Secretaria ----------
function FormJefeSecretaria({ onClose, onCreado }: Props) {
  const [jefe, setJefe] = useState<any>(null);
  const [secretaria, setSecretaria] = useState<any>(null);
  const [mismosPrivilegios, setMismosPrivilegios] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async () => {
    if (!jefe || !secretaria) { setError('Busca ambas extensiones (jefe y secretaria).'); return; }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: jefe.id,
        tipo_tramite: 'JEFE_SECRETARIA',
        observaciones: observaciones || undefined,
        detalle: { jefe_usuario_id: jefe.id, secretaria_usuario_id: secretaria.id, mismos_privilegios: mismosPrivilegios },
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
    <Shell titulo="Solicitud arreglo Jefe - Secretaria" onClose={onClose}>
      <p className="text-sm font-semibold">Datos del Jefe</p>
      <BuscarPorExtension label="Extensión Jefe" onEncontrado={setJefe} />
      {jefe && <ResumenUsuarioTelefonia usuario={jefe} />}

      <p className="text-sm font-semibold pt-2">Datos de la Secretaria</p>
      <BuscarPorExtension label="Extensión Secretaria" onEncontrado={setSecretaria} />
      {secretaria && <ResumenUsuarioTelefonia usuario={secretaria} />}

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={mismosPrivilegios} onChange={(e) => setMismosPrivilegios(e.target.checked)} />
        Mismos Privilegios
      </label>
      <textarea placeholder="Observación" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} className="border p-2 w-full" />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- 6. Cambio de DID ----------
function FormCambioDid({ onClose, onCreado }: Props) {
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
    <Shell titulo="Cambio de DID" onClose={onClose}>
      <BuscarPorExtension label="Extensión Actual" onEncontrado={setUsuario} />
      {usuario && <ResumenUsuarioTelefonia usuario={usuario} />}
      <input placeholder="Nueva Extensión" value={nuevaExtension} onChange={(e) => setNuevaExtension(e.target.value)} className="border p-2 w-full" />
      <input placeholder="Número DID" value={numeroDid} onChange={(e) => setNumeroDid(e.target.value)} className="border p-2 w-full" />
      <textarea placeholder="Justificación" value={justificacion} onChange={(e) => setJustificacion(e.target.value)} rows={3} className="border p-2 w-full" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando || !usuario} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- 7. Cambio de Categoría ----------
function FormCambioCategoria({ onClose, onCreado }: Props) {
  const [usuario, setUsuario] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { getCategoriasTelefonia().then(setCategorias); }, []);

  const handleSubmit = async () => {
    if (!usuario || !categoriaId || !justificacion) { setError('Completa todos los campos.'); return; }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: usuario.id,
        tipo_tramite: 'CAMBIO_CATEGORIA',
        observaciones: justificacion,
        detalle: { categoria_id: Number(categoriaId), justificacion },
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
    <Shell titulo="Cambio de Categoría (privilegios)" onClose={onClose}>
      <BuscarPorExtension onEncontrado={setUsuario} />
      {usuario && (
        <>
          <ResumenUsuarioTelefonia usuario={usuario} />
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="border p-2 w-full">
            <option value="">-- Categoría --</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.categoria}</option>)}
          </select>
          <textarea placeholder="Justificación" value={justificacion} onChange={(e) => setJustificacion(e.target.value)} rows={3} className="border p-2 w-full" />
        </>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando || !usuario} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- 8. Genérico (Fax, Cambio de Fax, Otros) ----------
function FormGenerico({ onClose, onCreado, tipo, titulo }: Props & { tipo: string; titulo: string }) {
  const [usuario, setUsuario] = useState<any>(null);
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async () => {
    if (!observaciones) { setError('Describe el motivo de la solicitud.'); return; }
    setEnviando(true);
    setError('');
    try {
      await crearSolicitudTelefonia({
        usuario_id: usuario?.id,
        tipo_tramite: tipo,
        observaciones,
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
    <Shell titulo={titulo} onClose={onClose}>
      <p className="text-xs text-gray-500">Extensión relacionada (opcional):</p>
      <BuscarPorExtension onEncontrado={setUsuario} />
      {usuario && <ResumenUsuarioTelefonia usuario={usuario} />}
      <textarea placeholder="Describe la solicitud" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={4} className="border p-2 w-full" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
        <button onClick={handleSubmit} disabled={enviando} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </Shell>
  );
}

// ---------- Wizard principal (menú) ----------
export default function SolicitudTelefoniaWizard({ onClose, onCreado }: Props) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string | null>(null);

  if (tipoSeleccionado === 'SOLICITAR_TELEFONO') return <FormSolicitarTelefono onClose={onClose} onCreado={onCreado} />;
  if (tipoSeleccionado === 'CAMBIO_PIN_CN') return <FormCambioPinCn onClose={onClose} onCreado={onCreado} />;
  if (tipoSeleccionado === 'CAMBIO_USUARIO') return <FormCambioUsuario onClose={onClose} onCreado={onCreado} />;
  if (tipoSeleccionado === 'MODIFICAR_DATOS') return <FormModificarDatos onClose={onClose} onCreado={onCreado} />;
  if (tipoSeleccionado === 'JEFE_SECRETARIA') return <FormJefeSecretaria onClose={onClose} onCreado={onCreado} />;
  if (tipoSeleccionado === 'CAMBIO_DID') return <FormCambioDid onClose={onClose} onCreado={onCreado} />;
  if (tipoSeleccionado === 'CAMBIO_CATEGORIA') return <FormCambioCategoria onClose={onClose} onCreado={onCreado} />;
  if (tipoSeleccionado === 'OTROS') return <FormGenerico onClose={onClose} onCreado={onCreado} tipo="OTROS" titulo="Otros" />;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-96 overflow-hidden">
        <div className="bg-blue-700 text-white px-5 py-3 font-semibold flex justify-between items-center">
          Seleccione el tipo de solicitud de telefonía
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
        </div>
        <ul className="p-4 space-y-2">
          {TRAMITES.map((t) => (
            <li key={t.value}>
              <button
                onClick={() => setTipoSeleccionado(t.value)}
                className="text-blue-700 hover:underline text-sm"
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