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
          expediente: d.expediente ?? '',
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
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded shadow-lg p-6 text-sm text-gray-600">Cargando dictamen...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
        <div className="bg-white rounded shadow-lg p-6 max-w-md">
          <p className="text-red-500 text-sm mb-4">{error || 'No se pudo cargar el dictamen.'}</p>
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded shadow-lg w-[80rem] max-w-[80vw] max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold">
          Modificar Folio : {idSolicitud}
        </div>

        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {/* ---- Datos de la solicitud (editables) ---- */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-sm font-medium">Solicitante:</label>
              <input
                name="solicitante"
                value={solicitudForm.solicitante}
                onChange={handleChangeSolicitud}
                className="border p-2 w-full mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Puesto:</label>
              <input
                name="puesto"
                value={solicitudForm.puesto}
                onChange={handleChangeSolicitud}
                className="border p-2 w-full mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo Docto:</label>
              <select
                name="tipo_documento"
                value={solicitudForm.tipo_documento}
                onChange={handleChangeSolicitud}
                className="border p-2 w-full mt-1"
              >
                <option value="">--Seleccionar--</option>
                {OPCIONES_TIPO_DOCTO.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">No. Docto:</label>
              <input
                name="num_documento"
                value={solicitudForm.num_documento}
                onChange={handleChangeSolicitud}
                className="border p-2 w-full mt-1"
              />
            </div>
          </div>

          {/* ---- Tabla de equipo(s) (solo lectura) ---- */}
          {equipos.length > 0 && (
            <div className="border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">No. Serie</th>
                    <th className="p-2 text-left">No. Inventario</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.map((e) => (
                    <tr key={e.id_equipo ?? e.id} className="border-t">
                      <td className="p-2 bg-gray-100 text-gray-600">{e.tipo ?? '-'}</td>
                      <td className="p-2 bg-gray-100 text-gray-600">{e.no_serie ?? '-'}</td>
                      <td className="p-2 bg-gray-100 text-gray-600">{e.no_inventario ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">
              Servicio: <span className="text-xs text-gray-400 font-normal">(puede separar servicios por ;)</span>
            </label>
            <textarea name="servicio" value={form.servicio} onChange={handleChange} rows={2} className="border p-2 w-full mt-1" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="text-sm font-medium">Por presentar las siguientes fallas:</label>
              <textarea name="fallas" value={form.fallas} onChange={handleChange} rows={2} className="border p-2 w-full mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo falla:</label>
              <select name="tipo_falla" value={form.tipo_falla} onChange={handleChange} className="border p-2 w-full mt-1">
                <option value="">--Seleccionar--</option>
                {OPCIONES_TIPO_FALLA.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Fecha Dictamen:</label>
              <input
                type="date"
                name="fecha_dictamen"
                value={form.fecha_dictamen}
                onChange={handleChange}
                className="border p-2 w-full mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Dictamen Técnico: <span className="text-xs text-gray-400 font-normal">(puede separar contenidos por ;)</span>
            </label>
            <textarea name="dictamen" value={form.dictamen} onChange={handleChange} rows={4} className="border p-2 w-full mt-1" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.sugiere_baja}
              onChange={(e) => setForm({ ...form, sugiere_baja: e.target.checked })}
            />
            Se sugiere la baja
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Expediente:</label>
              <input name="expediente" value={form.expediente} onChange={handleChange} className="border p-2 w-full mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Con copia para:</label>
              <input
                name="copias"
                value={form.copias}
                onChange={handleChange}
                placeholder="Copia 1, Copia 2, ..."
                className="border p-2 w-full mt-1"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* ---- Sección: Mantenimiento de equipo (buscar por No. Inventario) ---- */}
          <div className="border-t pt-4 mt-2">
            <p className="text-sm font-semibold text-gray-700 mb-2">Mantenimiento de equipo</p>
            <div className="flex gap-2">
              <input
                value={buscarInventario}
                onChange={(e) => setBuscarInventario(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscarEquipo()}
                placeholder="Buscar por no. de inventario..."
                className="border p-2 flex-1 text-sm"
              />
              <button
                onClick={handleBuscarEquipo}
                disabled={buscandoEquipo}
                className="px-3 py-2 bg-gray-700 text-white rounded text-sm disabled:opacity-50"
              >
                {buscandoEquipo ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {errorBusquedaEquipo && (
              <p className="text-red-500 text-xs mt-2">{errorBusquedaEquipo}</p>
            )}

            {equipoEncontrado && (
              <div className="mt-3 border rounded p-3 bg-gray-50 text-sm">
                <p><span className="font-medium">Inventario:</span> {equipoEncontrado.no_inventario}</p>
                <p><span className="font-medium">Tipo:</span> {equipoEncontrado.tipo ?? '-'} &nbsp;
                   <span className="font-medium">Marca:</span> {equipoEncontrado.marca ?? '-'} &nbsp;
                   <span className="font-medium">Modelo:</span> {equipoEncontrado.modelo ?? '-'}</p>

                {mantGuardado ? (
                  <p className="text-green-600 text-xs mt-2">✓ Mantenimiento registrado correctamente.</p>
                ) : !mostrarFormMantenimiento ? (
                  <button
                    onClick={() => setMostrarFormMantenimiento(true)}
                    className="mt-2 text-purple-800 hover:underline text-xs"
                  >
                    + Registrar mantenimiento para este equipo
                  </button>
                ) : (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium">Fecha de servicio</label>
                        <input
                          type="date"
                          value={mantForm.fecha_mantenimiento}
                          onChange={(e) => setMantForm({ ...mantForm, fecha_mantenimiento: e.target.value })}
                          className="border rounded p-1.5 w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Próximo mantenimiento</label>
                        <input
                          type="date"
                          value={mantForm.proxima_fecha}
                          onChange={(e) => setMantForm({ ...mantForm, proxima_fecha: e.target.value })}
                          placeholder="Default: +6 meses"
                          className="border rounded p-1.5 w-full text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Tipo</label>
                      <select
                        value={mantForm.tipo}
                        onChange={(e) => setMantForm({ ...mantForm, tipo: e.target.value })}
                        className="border rounded p-1.5 w-full text-xs"
                      >
                        <option value="preventivo">Preventivo</option>
                        <option value="correctivo">Correctivo</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Descripción</label>
                      <textarea
                        value={mantForm.descripcion}
                        onChange={(e) => setMantForm({ ...mantForm, descripcion: e.target.value })}
                        rows={2}
                        className="border rounded p-1.5 w-full text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setMostrarFormMantenimiento(false)}
                        className="px-3 py-1 text-xs border rounded"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleGuardarMantenimiento}
                        disabled={guardandoMant}
                        className="px-3 py-1 text-xs bg-purple-800 text-white rounded disabled:opacity-50"
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

        <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Grabar'}
          </button>
        </div>
      </div>
    </div>
  );
}