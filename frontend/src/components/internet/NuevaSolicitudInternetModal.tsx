import { useEffect, useState } from 'react';
import { buscarEquipo } from '../../services/equipoService';
import { getCatalogo } from '../../services/catalogoService';
import { crearSolicitudInternet } from '../../services/solicitudInternetService';
import RegistrarEquipoModal from './RegistrarEquipoModal';
import { formatMac, isValidMac, tipoRequiereMac } from '../../utils/mac';

interface Opcion { id: number; [key: string]: any }

interface Props {
  onClose: () => void;
  onCreado: () => void;
}

const JUSTIFICACION_DEFAULT = `ACCESO A DISTINTAS PÁGINAS PARA:
- COMPARTIR INFORMACIÓN RESPECTO A MIS ACTIVIDADES, SE REQUIERE ACCESO A DROPBOX, GOOGLE DRIVE, ICLOUD, ONEDRIVE.
- ACCESO A PÁGINAS DE LEYES, PERIÓDICOS, REVISTAS O ARTÍCULOS, PARA MONITOREO INFORMATIVO A TEMAS ADMINISTRATIVOS Y DE AUDITORÍAS DE FISCALIZACIÓN ENTRE OTROS.
- CONSULTAR CURSOS EN VIDEO.
- ACCESO A PLATAFORMAS PARA VIDEOCONFERENCIAS.
- ACCESO A REDES SOCIALES.
- Y DEMÁS ACCIONES QUE SE REALICEN EN LA DIRECCIÓN.`;

export default function NuevaSolicitudInternetModal({ onClose, onCreado }: Props) {
  const [noInventario, setNoInventario] = useState('');
  const [equipo, setEquipo] = useState<any>(null);
  const [buscando, setBuscando] = useState(false);
  const [mostrarRegistrarEquipo, setMostrarRegistrarEquipo] = useState(false);
  const [error, setError] = useState('');

  const [cargos, setCargos] = useState<Opcion[]>([]);
  const [areas, setAreas] = useState<Opcion[]>([]);
  const [autorizantes, setAutorizantes] = useState<Opcion[]>([]);

  const [macEthernet, setMacEthernet] = useState('');
  const [macWifi, setMacWifi] = useState('');

  const [form, setForm] = useState({
    usuario_internet: '', id_cargo: '', id_area: '', correo: '',
    tel_ext: '', id_autoriza: '', tipo_conexion: 'cableada',
    edificio: '2', nivel: 'PB', puerto: '',
    nivel_filtrado: '1',
    justificacion: JUSTIFICACION_DEFAULT,
  });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getCatalogo('cargos').then((r) => setCargos(r.registros));
    getCatalogo('areas').then((r) => setAreas(r.registros));
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros));
  }, []);

  const requiereMac = tipoRequiereMac(equipo?.tipo);

  const handleBuscar = async () => {
    if (!noInventario) return;
    setBuscando(true);
    setError('');
    try {
      const data = await buscarEquipo(noInventario);
      setEquipo(data);
      setMacEthernet(data.mac_ethernet ?? '');
      setMacWifi(data.mac_wifi ?? '');

      // Si ya existe una solicitud previa para este equipo, vinculamos/autocompletamos los datos del usuario
      if (data.ultima_solicitud) {
        const us = data.ultima_solicitud;
        setForm((prev) => ({
          ...prev,
          usuario_internet: us.usuario_internet ?? prev.usuario_internet,
          id_cargo: us.id_cargo ? String(us.id_cargo) : prev.id_cargo,
          id_area: us.id_area ? String(us.id_area) : prev.id_area,
          correo: us.correo ?? prev.correo,
          tel_ext: us.tel_ext ? String(us.tel_ext) : prev.tel_ext,
          id_autoriza: us.id_autoriza ? String(us.id_autoriza) : prev.id_autoriza,
        }));
      }
    } catch {
      const confirmar = window.confirm('No existe un equipo con ese número. ¿Agregarlo al catálogo?');
      if (confirmar) setMostrarRegistrarEquipo(true);
    } finally {
      setBuscando(false);
    }
  };

  const handleEquipoRegistrado = (nuevoEquipo: any) => {
    setEquipo({
      id: nuevoEquipo.id,
      no_inventario: nuevoEquipo.no_inventario,
      tipo: nuevoEquipo.tipo ?? '',
      sistema: nuevoEquipo.sistema ?? '',
    });
    setMacEthernet('');
    setMacWifi('');
    setMostrarRegistrarEquipo(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const autorizaSeleccionado = autorizantes.find((a) => a.id === Number(form.id_autoriza));

  const handleSubmit = async () => {
    if (!equipo) {
      setError('Primero busca o registra el equipo.');
      return;
    }

    // Todos los campos son obligatorios excepto MAC
    if (
      !form.usuario_internet || !form.id_cargo || !form.id_area || !form.correo ||
      !form.tel_ext || !form.id_autoriza || !form.edificio || !form.nivel
    ) {
      setError('Completa todos los campos (la MAC es el único dato opcional).');
      return;
    }

    if (requiereMac && macEthernet && !isValidMac(macEthernet)) {
      setError('La MAC Ethernet no tiene un formato válido (XX:XX:XX:XX:XX:XX).');
      return;
    }
    if (requiereMac && macWifi && !isValidMac(macWifi)) {
      setError('La MAC Wi-Fi no tiene un formato válido (XX:XX:XX:XX:XX:XX).');
      return;
    }

    setEnviando(true);
    setError('');
    try {
      await crearSolicitudInternet({
        id_equipo: equipo.id,
        usuario_internet: form.usuario_internet,
        id_cargo: Number(form.id_cargo),
        id_area: Number(form.id_area),
        id_autoriza: Number(form.id_autoriza),
        correo: form.correo,
        tel_ext: Number(form.tel_ext),
        tipo_conexion: form.tipo_conexion,
        tipo_solicitud: 'nueva',
        edificio: form.edificio,
        nivel: form.nivel,
        puerto: form.puerto ? Number(form.puerto) : undefined,
        nivel_filtrado: Number(form.nivel_filtrado) as 1 | 2,
        justificacion: form.justificacion,
        mac_ethernet: requiereMac && macEthernet ? macEthernet : undefined,
        mac_wifi: requiereMac && macWifi ? macWifi : undefined,
      });
      onCreado();
      onClose();
    } catch (err: any) {
      // Laravel manda 422 con { message, errors: { campo: [mensajes] } }
      const errores = err?.response?.data?.errors;
      if (errores) {
        const detalle = Object.entries(errores)
          .map(([campo, mensajes]) => `${campo}: ${(mensajes as string[]).join(', ')}`)
          .join(' | ');
        setError(detalle);
      } else {
        setError(err?.response?.data?.message ?? 'No se pudo crear la solicitud. Revisa los campos.');
      }
      console.error('Error al crear solicitud de internet:', err?.response?.data ?? err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded shadow-lg w-[52rem] max-w-[95vw] overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          Nueva Solicitud
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Datos del Equipo */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Datos del Equipo</div>
            <div className="p-3 space-y-3">
              <div className="flex gap-2">
                <input
                  placeholder="NÚMERO DE INVENTARIO..."
                  value={noInventario}
                  onChange={(e) => setNoInventario(e.target.value)}
                  className="border p-2 flex-1"
                />
                <button onClick={handleBuscar} disabled={buscando} className="bg-blue-600 text-white px-4 rounded text-sm">
                  🔍 {buscando ? '...' : 'Buscar!'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Tipo de equipo:</label>
                  <input readOnly value={equipo?.tipo ?? ''} className="border p-2 w-full mt-1 bg-yellow-50" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">No. de inventario:</label>
                  <input readOnly value={equipo?.no_inventario ?? ''} className="border p-2 w-full mt-1 bg-yellow-50" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Sistema operativo:</label>
                  <input readOnly value={equipo?.sistema ?? ''} className="border p-2 w-full mt-1 bg-yellow-50" />
                </div>
              </div>

              {equipo && !requiereMac && (
                <p className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-2">
                  Este equipo (tipo: {equipo.tipo}) no requiere dirección MAC.
                </p>
              )}

              {equipo?.ultima_solicitud && (
                <p className="text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded p-2">
                  Este equipo ya tiene una solicitud previa — se autocompletaron los datos del usuario.
                </p>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Tipo de conexión:</label>
                  <select name="tipo_conexion" value={form.tipo_conexion} onChange={handleChange} className="border p-2 w-full mt-1">
                    <option value="cableada">Cableada</option>
                    <option value="inalambrica">Inalámbrica</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Nivel de acceso a Internet:</label>
                  <select name="nivel_filtrado" value={form.nivel_filtrado} onChange={handleChange} className="border p-2 w-full mt-1">
                    <option value="1">Nivel 1 (básico)</option>
                    <option value="2">Nivel 2 (avanzado — requiere justificación)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Dirección MAC Ethernet <span className="text-gray-400">(Opcional)</span>:
                  </label>
                  <input
                    value={macEthernet}
                    onChange={(e) => setMacEthernet(formatMac(e.target.value))}
                    placeholder="00:00:00:00:00:00"
                    disabled={!requiereMac}
                    maxLength={17}
                    className="border p-2 w-full mt-1 font-mono disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Dirección MAC Wi-Fi <span className="text-gray-400">(Opcional)</span>:
                  </label>
                  <input
                    value={macWifi}
                    onChange={(e) => setMacWifi(formatMac(e.target.value))}
                    placeholder="00:00:00:00:00:00"
                    disabled={!requiereMac}
                    maxLength={17}
                    className="border p-2 w-full mt-1 font-mono disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Edificio:</label>
                  <select name="edificio" value={form.edificio} onChange={handleChange} className="border p-2 w-full mt-1">
                    {['2', '3', '4', '6'].map((e) => <option key={e} value={e}>Edificio {e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Nivel:</label>
                  <select name="nivel" value={form.nivel} onChange={handleChange} className="border p-2 w-full mt-1">
                    {['PB', '1', '2', '3'].map((n) => <option key={n} value={n}>Nivel {n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Puerto:</label>
                  <input name="puerto" value={form.puerto} onChange={handleChange} className="border p-2 w-full mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Datos del Usuario */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Datos del Usuario</div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Nombre completo:</label>
                <input name="usuario_internet" value={form.usuario_internet} onChange={handleChange} className="border p-2 w-full mt-1" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Cargo:</label>
                <select name="id_cargo" value={form.id_cargo} onChange={handleChange} className="border p-2 w-full mt-1">
                  <option value="">--Seleccionar--</option>
                  {cargos.map((c) => <option key={c.id} value={c.id}>{c.cargo}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Adscripción:</label>
                <select name="id_area" value={form.id_area} onChange={handleChange} className="border p-2 w-full mt-1">
                  <option value="">--Seleccionar--</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.area}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Correo electrónico:</label>
                <input name="correo" value={form.correo} onChange={handleChange} className="border p-2 w-full mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Extensión:</label>
                <input name="tel_ext" value={form.tel_ext} onChange={handleChange} className="border p-2 w-full mt-1" />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600">Persona que autoriza:</label>
                <select name="id_autoriza" value={form.id_autoriza} onChange={handleChange} className="border p-2 w-full mt-1">
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

          {/* Justificación */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Justificación</div>
            <div className="p-3">
              <textarea
                name="justificacion"
                rows={7}
                value={form.justificacion}
                onChange={handleChange}
                className="border p-2 w-full text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border rounded">✕ Cancelar</button>
          <button onClick={handleSubmit} disabled={enviando} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            💾 {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {mostrarRegistrarEquipo && (
        <RegistrarEquipoModal
          noInventario={noInventario}
          onClose={() => setMostrarRegistrarEquipo(false)}
          onRegistrado={handleEquipoRegistrado}
        />
      )}
    </div>
  );
}
