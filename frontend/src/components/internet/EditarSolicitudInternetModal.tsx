import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import {
  actualizarSolicitudInternet,
  getSolicitudInternetDetalle,
} from '../../services/solicitudInternetService';
import { formatMac, isValidMac, tipoRequiereMac } from '../../utils/mac';

interface Opcion { id: number; [key: string]: any }

interface Props {
  idSolicitud: number;
  onClose: () => void;
  onActualizado: () => void;
}

export default function EditarSolicitudInternetModal({ idSolicitud, onClose, onActualizado }: Props) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [cargos, setCargos] = useState<Opcion[]>([]);
  const [areas, setAreas] = useState<Opcion[]>([]);
  const [autorizantes, setAutorizantes] = useState<Opcion[]>([]);

  // Datos del equipo: solo lectura, no se editan aquí
  const [equipo, setEquipo] = useState<{ tipo: string; no_inventario: string; sistema: string } | null>(null);

  const [macEthernet, setMacEthernet] = useState('');
  const [macWifi, setMacWifi] = useState('');

  const [form, setForm] = useState({
    usuario_internet: '', id_cargo: '', id_area: '', correo: '',
    tel_ext: '', id_autoriza: '', tipo_conexion: 'cableada',
    edificio: '2', nivel: 'PB', puerto: '',
    nivel_filtrado: '1',
    justificacion: '',
    motivo_actualizacion: '',
  });

  useEffect(() => {
    getCatalogo('cargos').then((r) => setCargos(r.registros));
    getCatalogo('areas').then((r) => setAreas(r.registros));
    getCatalogo('autoriza-internet').then((r) => setAutorizantes(r.registros));

    getSolicitudInternetDetalle(idSolicitud)
      .then(({ solicitud }) => {
        setEquipo({
          tipo: solicitud.tipo ?? solicitud.tipo_equipo ?? '',
          no_inventario: solicitud.no_inventario ?? '',
          sistema: solicitud.sistema ?? '',
        });
        setMacEthernet(solicitud.mac_ethernet ?? '');
        setMacWifi(solicitud.mac_wifi ?? '');
        setForm({
          usuario_internet: solicitud.usuario_internet ?? '',
          id_cargo: solicitud.id_cargo ? String(solicitud.id_cargo) : '',
          id_area: solicitud.id_area ? String(solicitud.id_area) : '',
          correo: solicitud.correo ?? '',
          tel_ext: solicitud.tel_ext ? String(solicitud.tel_ext) : '',
          id_autoriza: solicitud.id_autoriza ? String(solicitud.id_autoriza) : '',
          tipo_conexion: solicitud.tipo_conexion ?? 'cableada',
          edificio: solicitud.edificio ?? '2',
          nivel: solicitud.nivel ?? 'PB',
          puerto: solicitud.puerto ? String(solicitud.puerto) : '',
          nivel_filtrado: solicitud.nivel_filtrado ? String(solicitud.nivel_filtrado) : '1',
          justificacion: solicitud.justificacion ?? '',
          motivo_actualizacion: '',
        });
      })
      .catch((e) => {
        setError(e?.response?.data?.message ?? 'No se pudo cargar la solicitud.');
      })
      .finally(() => setCargando(false));
  }, [idSolicitud]);

  const requiereMac = tipoRequiereMac(equipo?.tipo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const autorizaSeleccionado = autorizantes.find((a) => a.id === Number(form.id_autoriza));

  const handleGuardar = async () => {
    if (
      !form.usuario_internet || !form.id_cargo || !form.id_area || !form.correo ||
      !form.tel_ext || !form.id_autoriza || !form.edificio || !form.nivel
    ) {
      setError('Completa todos los campos obligatorios.');
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
      await actualizarSolicitudInternet(idSolicitud, {
        usuario_internet: form.usuario_internet,
        id_cargo: Number(form.id_cargo),
        id_area: Number(form.id_area),
        id_autoriza: Number(form.id_autoriza),
        correo: form.correo,
        tel_ext: Number(form.tel_ext),
        tipo_conexion: form.tipo_conexion,
        edificio: form.edificio,
        nivel: form.nivel,
        puerto: form.puerto ? Number(form.puerto) : undefined,
        nivel_filtrado: Number(form.nivel_filtrado) as 1 | 2,
        justificacion: form.justificacion || undefined,
        mac_ethernet: requiereMac && macEthernet ? macEthernet : undefined,
        mac_wifi: requiereMac && macWifi ? macWifi : undefined,
        motivo_actualizacion: form.motivo_actualizacion || undefined,
      } as any);
      onActualizado();
      onClose();
    } catch (e: any) {
      const errores = e?.response?.data?.errors;
      if (errores) {
        const detalle = Object.entries(errores)
          .map(([campo, mensajes]) => `${campo}: ${(mensajes as string[]).join(', ')}`)
          .join(' | ');
        setError(detalle);
      } else {
        setError(e?.response?.data?.message ?? 'No se pudo actualizar la solicitud.');
      }
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg p-6">Cargando...</div>
      </div>
    );
  }

  if (error && !equipo) {
    // Falló la carga inicial: mostramos el error con opción de cerrar, sin formulario vacío.
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg p-6 max-w-md">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white rounded shadow-lg w-[52rem] max-w-[95vw] overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          Editar Solicitud #{idSolicitud}
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Datos del Equipo — solo lectura */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Datos del Equipo</div>
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Tipo de equipo:</label>
                  <input readOnly value={equipo?.tipo ?? ''} className="border p-2 w-full mt-1 bg-yellow-50 text-gray-600" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">No. de inventario:</label>
                  <input readOnly value={equipo?.no_inventario ?? ''} className="border p-2 w-full mt-1 bg-yellow-50 text-gray-600" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Sistema operativo:</label>
                  <input readOnly value={equipo?.sistema ?? ''} className="border p-2 w-full mt-1 bg-yellow-50 text-gray-600" />
                </div>
              </div>

              <p className="text-xs bg-gray-50 border border-gray-200 text-gray-500 rounded p-2">
                Los datos del equipo no se pueden modificar desde este formulario.
              </p>

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

          {/* Motivo de actualización */}
          <div className="border rounded">
            <div className="bg-gray-50 px-3 py-2 font-semibold text-sm border-b">Motivo de Actualización</div>
            <div className="p-3">
              <textarea
                name="motivo_actualizacion"
                rows={2}
                placeholder="Describe brevemente el motivo de este cambio (opcional)"
                value={form.motivo_actualizacion}
                onChange={handleChange}
                className="border p-2 w-full text-sm"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border rounded">✕ Cancelar</button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            💾 {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}