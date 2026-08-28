import { useEffect, useState } from 'react';
import { getUltimoDictamenPorSolicitud, actualizarDictamen, getEquiposDeSolicitud } from '../../services/dictamenService';
import { buscarEquipo, type EquipoRow } from '../../services/equipoService';
import { registrarMantenimiento } from '../../services/mantenimientoService';
import { getSolicitudUieDetalle } from '../../services/solicitudUieService';
import axiosClient from '../../api/axiosClient';

interface Props {
  idSolicitud: number;
  onClose: () => void;
  onActualizado: () => void;
}

const OPCIONES_TIPO_FALLA = ['Física', 'Lógica'];

const OPCIONES_TIPO_DOCTO = [
  { value: 'MEMORÁNDUM', label: 'MEMORÁNDUM' },
  { value: 'TARJETA INFORMATIVA', label: 'TARJETA INFORMATIVA' },
  { value: 'CORREO ELECTRÓNICO', label: 'CORREO ELECTRÓNICO' },
  { value: 'SOLICITUD VERBAL', label: 'SOLICITUD VERBAL' },
  { value: 'SOLICITUD VÍA TELEFÓNICA', label: 'SOLICITUD VÍA TELEFÓNICA' },
  { value: 'CIRCULAR', label: 'CIRCULAR' },
];

const PREFIJO_EXPEDIENTE = 'RAGG/';

export default function EditarDictamenModal({ idSolicitud, onClose, onActualizado }: Props) {
  // id real del registro en la tabla `dictamen` (la última captura de esta solicitud)
  const [dictamenId, setDictamenId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(null);

  // Equipos vinculados a la SOLICITUD (no dependen de dictamen.id_equipo)
  const [equipos, setEquipos] = useState<any[]>([]);

  // Datos de la solicitud — editables
  const [solicitudForm, setSolicitudForm] = useState({
    solicitante: '',
    puesto: '',
    tipo_documento: '',
    num_documento: '',
  });

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // --- Sección: buscar equipo por No. Inventario + registrar mantenimiento ---
  const [buscarInventario, setBuscarInventario] = useState('');
  const [buscandoEquipo, setBuscandoEquipo] = useState(false);
  const [equipoEncontrado, setEquipoEncontrado] = useState<EquipoRow | null>(null);
  const [errorBusquedaEquipo, setErrorBusquedaEquipo] = useState('');
  const [mostrarFormMantenimiento, setMostrarFormMantenimiento] = useState(false);
  const [mantForm, setMantForm] = useState({
    fecha_mantenimiento: new Date().toISOString().slice(0, 10),
    proxima_fecha: '',
    tipo: 'preventivo',
    descripcion: '',
  });
  const [guardandoMant, setGuardandoMant] = useState(false);
  const [mantGuardado, setMantGuardado] = useState(false);

  useEffect(() => {
    setCargando(true);
    setError('');

    getUltimoDictamenPorSolicitud(idSolicitud)
      .then((d: any) => {
        setDictamenId(d.id);
        setForm({
          servicio: d.servicio ?? '',
          dictamen: d.dictamen ?? '',
          expediente: d.expediente || PREFIJO_EXPEDIENTE,
          copias: d.copias ?? '',
          fallas: d.fallas ?? '',
          tipo_falla: d.tipo_falla ?? '',
          sugiere_baja: !!d.sugiere_baja,
          fecha_dictamen: d.fecha_dictamen ? String(d.fecha_dictamen).slice(0, 10) : '',
        });

        if (d.id_solicitud) {
          getSolicitudUieDetalle(d.id_solicitud)
            .then((detalle: any) => {
              const s = detalle.solicitud;
              setSolicitudForm({
                solicitante: s?.solicitante ?? '',
                puesto: s?.puesto ?? '',
                tipo_documento: s?.tipo_documento ?? '',
                num_documento: s?.num_documento ?? '',
              });
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setError('No se encontró ningún dictamen registrado para esta solicitud.');
      })
      .finally(() => setCargando(false));

    // Equipos de la solicitud (independiente del dictamen)
    getEquiposDeSolicitud(idSolicitud).then(setEquipos).catch(() => setEquipos([]));
  }, [idSolicitud]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeExpediente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, expediente: PREFIJO_EXPEDIENTE + e.target.value });
  };

  const sufijoExpediente = form && typeof form.expediente === 'string' && form.expediente.startsWith(PREFIJO_EXPEDIENTE)
    ? form.expediente.slice(PREFIJO_EXPEDIENTE.length)
    : (form?.expediente ?? '');

  const handleChangeSolicitud = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSolicitudForm({ ...solicitudForm, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!dictamenId) return;
    setEnviando(true);
    setError('');
    try {
      await Promise.all([
        actualizarDictamen(dictamenId, form),
        axiosClient.put(`/solicitudes/${idSolicitud}`, solicitudForm),
      ]);
      onActualizado();
      onClose();
    } catch {
      setError('No se pudo actualizar el dictamen.');
    } finally {
      setEnviando(false);
    }
  };

  const handleBuscarEquipo = async () => {
    if (!buscarInventario.trim()) return;
    setBuscandoEquipo(true);
    setErrorBusquedaEquipo('');
    setEquipoEncontrado(null);
    setMostrarFormMantenimiento(false);
    setMantGuardado(false);
    try {
      const data = await buscarEquipo(buscarInventario.trim());
      if (!data || !data.id) {
        setErrorBusquedaEquipo('No se encontró ningún equipo con ese número de inventario.');
      } else {
        setEquipoEncontrado(data);
      }
    } catch (err: any) {
      setErrorBusquedaEquipo(
        err?.response?.status === 404
          ? 'No se encontró ningún equipo con ese número de inventario.'
          : 'No se pudo buscar el equipo.'
      );
    } finally {
      setBuscandoEquipo(false);
    }
  };

  const handleGuardarMantenimiento = async () => {
    if (!equipoEncontrado) return;
    setGuardandoMant(true);
    try {
      await registrarMantenimiento(equipoEncontrado.id, {
        fecha_mantenimiento: mantForm.fecha_mantenimiento,
        proxima_fecha: mantForm.proxima_fecha || undefined,
        tipo: mantForm.tipo,
        descripcion: mantForm.descripcion || undefined,
      });
      setMantGuardado(true);
      setMostrarFormMantenimiento(false);
    } catch {
      setErrorBusquedaEquipo('No se pudo registrar el mantenimiento.');
    } finally {
      setGuardandoMant(false);
    }
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-blue-100 text-gray-600 text-sm font-medium">Cargando dictamen...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md border border-blue-100">
          <p className="text-red-600 text-sm font-medium mb-4">{error || 'No se pudo cargar el dictamen.'}</p>
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition shadow-xs">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-[80rem] max-w-[95vw] max-h-[92vh] flex flex-col overflow-hidden border border-blue-100 my-6">
        <div className="bg-blue-900 border-b border-blue-800 text-white px-6 py-4 font-bold flex justify-between items-center">
          <span>Modificar Dictamen — Folio: {idSolicitud}</span>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">
          {/* ---- Datos de la solicitud (editables) ---- */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Datos de la Solicitud</div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-blue-50/10">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Solicitante</label>
                <input
                  name="solicitante"
                  value={solicitudForm.solicitante}
                  onChange={handleChangeSolicitud}
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Puesto</label>
                <input
                  name="puesto"
                  value={solicitudForm.puesto}
                  onChange={handleChangeSolicitud}
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo Docto</label>
                <select
                  name="tipo_documento"
                  value={solicitudForm.tipo_documento}
                  onChange={handleChangeSolicitud}
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="">--Seleccionar--</option>
                  {OPCIONES_TIPO_DOCTO.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">No. Docto</label>
                <input
                  name="num_documento"
                  value={solicitudForm.num_documento}
                  onChange={handleChangeSolicitud}
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* ---- Tabla de equipo(s) (solo lectura) ---- */}
          {equipos.length > 0 && (
            <div className="border border-blue-200 rounded-lg overflow-hidden shadow-xs">
              <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Equipos Vinculados</div>
              <table className="w-full text-sm">
                <thead className="bg-blue-100/50 text-blue-950 font-semibold border-b border-blue-200">
                  <tr>
                    <th className="p-3 text-left">Tipo</th>
                    <th className="p-3 text-left">No. Serie</th>
                    <th className="p-3 text-left">No. Inventario</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.map((e) => (
                    <tr key={e.id_equipo ?? e.id} className="border-b border-blue-100 last:border-0 odd:bg-blue-50/20">
                      <td className="p-3 text-gray-700">{e.tipo ?? '-'}</td>
                      <td className="p-3 text-gray-700">{e.no_serie ?? '-'}</td>
                      <td className="p-3 text-gray-700">{e.no_inventario ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Detalles del Dictamen</div>
            <div className="p-4 space-y-4 bg-blue-50/10">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Servicio: <span className="text-xs text-gray-400 font-normal">(puede separar servicios por ;)</span>
                </label>
                <textarea name="servicio" value={form.servicio} onChange={handleChange} rows={2} className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Por presentar las siguientes fallas:</label>
                  <textarea name="fallas" value={form.fallas} onChange={handleChange} rows={2} className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo falla</label>
                  <select name="tipo_falla" value={form.tipo_falla} onChange={handleChange} className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                    <option value="">--Seleccionar--</option>
                    {OPCIONES_TIPO_FALLA.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha Dictamen</label>
                  <input
                    type="date"
                    name="fecha_dictamen"
                    value={form.fecha_dictamen}
                    onChange={handleChange}
                    className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Dictamen Técnico: <span className="text-xs text-gray-400 font-normal">(puede separar contenidos por ;)</span>
                </label>
                <textarea name="dictamen" value={form.dictamen} onChange={handleChange} rows={4} className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
              </div>

              <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.sugiere_baja}
                  onChange={(e) => setForm({ ...form, sugiere_baja: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                Se sugiere la baja
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Expediente</label>
                  <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <span className="bg-gray-100 text-gray-500 px-3 py-2.5 text-sm select-none border-r border-blue-200 whitespace-nowrap font-medium">
                      {PREFIJO_EXPEDIENTE}
                    </span>
                    <input
                      value={sufijoExpediente}
                      onChange={handleChangeExpediente}
                      className="p-2.5 flex-1 outline-none min-w-0 text-sm text-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Con copia para</label>
                  <input
                    name="copias"
                    value={form.copias}
                    onChange={handleChange}
                    placeholder="Copia 1, Copia 2, ..."
                    className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 shadow-xs">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* ---- Sección: Mantenimiento de equipo (buscar por No. Inventario) ---- */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50/70 px-4 py-2.5 font-semibold text-xs uppercase tracking-wider text-blue-950 border-b border-blue-200">Mantenimiento de Equipo</div>
            <div className="p-4 space-y-3 bg-blue-50/10">
              <div className="flex gap-2">
                <input
                  value={buscarInventario}
                  onChange={(e) => setBuscarInventario(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscarEquipo()}
                  placeholder="Buscar por no. de inventario..."
                  className="border border-blue-200 rounded-lg p-2.5 flex-1 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <button
                  onClick={handleBuscarEquipo}
                  disabled={buscandoEquipo}
                  className="px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition shadow-sm"
                >
                  {buscandoEquipo ? 'Buscando...' : 'Buscar'}
                </button>
              </div>

              {errorBusquedaEquipo && (
                <p className="text-red-600 text-xs font-medium">{errorBusquedaEquipo}</p>
              )}

              {equipoEncontrado && (
                <div className="mt-3 border border-blue-200 rounded-lg p-4 bg-white text-sm shadow-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-gray-700">
                    <p><span className="font-semibold text-gray-900">Inventario:</span> {equipoEncontrado.no_inventario}</p>
                    <p><span className="font-semibold text-gray-900">Tipo:</span> {equipoEncontrado.tipo ?? '-'}</p>
                    <p><span className="font-semibold text-gray-900">Marca:</span> {equipoEncontrado.marca ?? '-'}</p>
                    <p><span className="font-semibold text-gray-900">Modelo:</span> {equipoEncontrado.modelo ?? '-'}</p>
                  </div>

                  {mantGuardado ? (
                    <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs font-medium mt-2">✓ Mantenimiento registrado correctamente.</p>
                  ) : !mostrarFormMantenimiento ? (
                    <button
                      onClick={() => setMostrarFormMantenimiento(true)}
                      className="mt-2 text-purple-700 hover:text-purple-900 font-semibold text-xs transition"
                    >
                      + Registrar mantenimiento para este equipo
                    </button>
                  ) : (
                    <div className="mt-3 space-y-3 border-t border-blue-100 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha de servicio</label>
                          <input
                            type="date"
                            value={mantForm.fecha_mantenimiento}
                            onChange={(e) => setMantForm({ ...mantForm, fecha_mantenimiento: e.target.value })}
                            className="border border-blue-200 rounded-lg p-2 w-full text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Próximo mantenimiento</label>
                          <input
                            type="date"
                            value={mantForm.proxima_fecha}
                            onChange={(e) => setMantForm({ ...mantForm, proxima_fecha: e.target.value })}
                            placeholder="Default: +6 meses"
                            className="border border-blue-200 rounded-lg p-2 w-full text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo</label>
                        <select
                          value={mantForm.tipo}
                          onChange={(e) => setMantForm({ ...mantForm, tipo: e.target.value })}
                          className="border border-blue-200 rounded-lg p-2 w-full text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        >
                          <option value="preventivo">Preventivo</option>
                          <option value="correctivo">Correctivo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea
                          value={mantForm.descripcion}
                          onChange={(e) => setMantForm({ ...mantForm, descripcion: e.target.value })}
                          rows={2}
                          className="border border-blue-200 rounded-lg p-2 w-full text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setMostrarFormMantenimiento(false)}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-xs"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleGuardarMantenimiento}
                          disabled={guardandoMant}
                          className="px-3 py-1.5 text-xs bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium disabled:opacity-50 transition shadow-xs"
                        >
                          {guardandoMant ? 'Guardando...' : 'Registrar mantenimiento'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-blue-100 bg-blue-50/20">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
          >
            Cancelar
          </button>
          <button 
            onClick={handleGuardar} 
            disabled={enviando} 
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition shadow-sm"
          >
            {enviando ? 'Guardando...' : 'Grabar'}
          </button>
        </div>
      </div>
    </div>
  );
}