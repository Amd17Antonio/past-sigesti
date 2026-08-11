import { useEffect, useMemo, useState } from 'react';
import {
  getSolicitudesDisponiblesDictamen, getEquiposDeSolicitud, getSiguienteFolio, crearDictamen,
} from '../../services/dictamenService';
import { buscarEquipo, type EquipoRow } from '../../services/equipoService';
import { registrarMantenimiento } from '../../services/mantenimientoService';
import SortIcon from '../common/SortIcon';

interface Props {
  onClose: () => void;
  onCreado: () => void;
}

interface SolicitudDisponible {
  id: number;
  solicitante: string;
  area: string;
  num_documento: string | null;
  tecnico: string | null;
  descripcion: string | null;
  equipos: string;
}

const COLUMNAS_SOLICITUD: { key: keyof SolicitudDisponible; label: string }[] = [
  { key: 'id', label: 'Folio Sistema' },
  { key: 'area', label: 'Área' },
  { key: 'num_documento', label: 'No. Documento' },
  { key: 'tecnico', label: 'Técnico' },
  { key: 'equipos', label: 'Equipo(s)' },
  { key: 'descripcion', label: 'Desc. Problema' },
];

export default function NuevoDictamenModal({ onClose, onCreado }: Props) {
  const [solicitudes, setSolicitudes] = useState<SolicitudDisponible[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [idSolicitud, setIdSolicitud] = useState('');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudDisponible | null>(null);
  const [idEquipo, setIdEquipo] = useState('');
  const [folioInfo, setFolioInfo] = useState<{ ejercicio: number; folio: number } | null>(null);

  // --- filtros/orden de la tabla de selección de solicitud ---
  const [filtrosSolicitud, setFiltrosSolicitud] = useState<Record<string, string>>({});
  const [sortKeySolicitud, setSortKeySolicitud] = useState<keyof SolicitudDisponible | null>(null);
  const [sortDirSolicitud, setSortDirSolicitud] = useState<'asc' | 'desc'>('asc');

  const [form, setForm] = useState({
    servicio: '', dictamen: '', expediente: '', copias: '', fallas: '', tipo_falla: '',
  });
  const [sugiereBaja, setSugiereBaja] = useState(false);
  const [error, setError] = useState('');
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
    getSolicitudesDisponiblesDictamen().then(setSolicitudes);
    getSiguienteFolio().then(setFolioInfo);
  }, []);

  useEffect(() => {
    if (idSolicitud) {
      getEquiposDeSolicitud(Number(idSolicitud)).then(setEquipos);
    } else {
      setEquipos([]);
    }
    setIdEquipo('');
  }, [idSolicitud]);

  const handleSortSolicitud = (key: keyof SolicitudDisponible) => {
    if (sortKeySolicitud === key) setSortDirSolicitud((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKeySolicitud(key); setSortDirSolicitud('asc'); }
  };

  const solicitudesFiltradas = useMemo(() => {
    const filtradas = solicitudes.filter((s) =>
      COLUMNAS_SOLICITUD.every(({ key }) => {
        const f = filtrosSolicitud[key];
        if (!f) return true;
        return String(s[key] ?? '').toLowerCase().includes(f.toLowerCase());
      })
    );
    if (!sortKeySolicitud) return filtradas;
    return [...filtradas].sort((a, b) => {
      const va = a[sortKeySolicitud] ?? '';
      const vb = b[sortKeySolicitud] ?? '';
      if (va < vb) return sortDirSolicitud === 'asc' ? -1 : 1;
      if (va > vb) return sortDirSolicitud === 'asc' ? 1 : -1;
      return 0;
    });
  }, [solicitudes, filtrosSolicitud, sortKeySolicitud, sortDirSolicitud]);

  const handleElegirSolicitud = (s: SolicitudDisponible) => {
    setIdSolicitud(String(s.id));
    setSolicitudSeleccionada(s);
  };

  const handleCambiarSolicitud = () => {
    setIdSolicitud('');
    setSolicitudSeleccionada(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!idSolicitud || !form.dictamen || !folioInfo) {
      setError('Selecciona la solicitud y redacta el dictamen.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearDictamen({
        id_solicitud: Number(idSolicitud),
        id_equipo: idEquipo ? Number(idEquipo) : undefined,
        ejercicio: folioInfo.ejercicio,
        folio: folioInfo.folio,
        ...form,
        sugiere_baja: sugiereBaja,
      });
      onCreado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo crear el dictamen.');
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

  return (
    <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto py-8 px-4">
      <div className={`bg-white rounded shadow-lg ${solicitudSeleccionada ? 'w-[36rem]' : 'w-[64rem]'} max-w-[95vw] mx-auto overflow-hidden`}>
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          Nuevo Dictamen {folioInfo && <span className="text-sm font-normal">Folio: {folioInfo.folio}/{folioInfo.ejercicio}</span>}
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
        </div>

        {/* --- Paso 1: elegir solicitud (tabla con filtros/orden) --- */}
        {!solicitudSeleccionada ? (
          <div className="p-5">
            <p className="text-sm font-medium mb-2">Solicitudes aprobadas para dictamen técnico</p>
            <div className="overflow-x-auto max-h-[26rem] overflow-y-auto border rounded">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    {COLUMNAS_SOLICITUD.map((c) => (
                      <th
                        key={c.key}
                        className="p-2 text-left cursor-pointer select-none whitespace-nowrap"
                        onClick={() => handleSortSolicitud(c.key)}
                      >
                         <span className="inline-flex items-center">{c.label}
    <SortIcon active={sortKeySolicitud === c.key} direction={sortDirSolicitud} />
  </span>
                        </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    {COLUMNAS_SOLICITUD.map((c) => (
                      <th key={c.key} className="p-1">
                        <input
                          value={filtrosSolicitud[c.key] ?? ''}
                          onChange={(e) => setFiltrosSolicitud({ ...filtrosSolicitud, [c.key]: e.target.value })}
                          className="border p-1 w-full text-xs font-normal"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {solicitudesFiltradas.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => handleElegirSolicitud(s)}
                      className="border-t cursor-pointer hover:bg-blue-50"
                    >
                      <td className="p-2">{s.id}</td>
                      <td className="p-2">{s.area}</td>
                      <td className="p-2">{s.num_documento ?? '-'}</td>
                      <td className="p-2">{s.tecnico ?? '-'}</td>
                      <td className="p-2">{s.equipos || '-'}</td>
                      <td className="p-2">{s.descripcion ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {solicitudesFiltradas.length === 0 && (
                <p className="text-gray-500 text-sm p-4 text-center">Ningún dato disponible en esta tabla</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Mostrando {solicitudesFiltradas.length} de {solicitudes.length} solicitudes
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            {/* --- Resumen de la solicitud elegida + botón para cambiar --- */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 flex justify-between items-start">
              <div className="text-sm">
                <p><strong>Folio:</strong> #{solicitudSeleccionada.id} — {solicitudSeleccionada.area}</p>
                <p><strong>Técnico:</strong> {solicitudSeleccionada.tecnico ?? '-'}</p>
                <p><strong>Equipos:</strong> {solicitudSeleccionada.equipos || '-'}</p>
              </div>
              <button onClick={handleCambiarSolicitud} className="text-xs text-blue-700 hover:underline whitespace-nowrap">
                Cambiar solicitud
              </button>
            </div>

            {equipos.length > 0 && (
              <div>
                <label className="text-sm font-medium">Equipo:</label>
                <select value={idEquipo} onChange={(e) => setIdEquipo(e.target.value)} className="border p-2 w-full mt-1">
                  <option value="">--Sin equipo específico--</option>
                  {equipos.map((e) => (
                    <option key={e.id_equipo} value={e.id_equipo}>{e.tipo} {e.marca} {e.modelo} — Inv. {e.no_inventario}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Servicio realizado:</label>
              <textarea name="servicio" value={form.servicio} onChange={handleChange} rows={2} className="border p-2 w-full mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium">Dictamen:</label>
              <textarea name="dictamen" value={form.dictamen} onChange={handleChange} rows={4} className="border p-2 w-full mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Expediente:</label>
                <input name="expediente" value={form.expediente} onChange={handleChange} className="border p-2 w-full mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Copias:</label>
                <input name="copias" value={form.copias} onChange={handleChange} className="border p-2 w-full mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Tipo de falla:</label>
                <input name="tipo_falla" value={form.tipo_falla} onChange={handleChange} className="border p-2 w-full mt-1" />
              </div>
              <label className="flex items-center gap-2 mt-6 text-sm">
                <input type="checkbox" checked={sugiereBaja} onChange={(e) => setSugiereBaja(e.target.checked)} />
                Sugiere baja del equipo
              </label>
            </div>

            <div>
              <label className="text-sm font-medium">Fallas reportadas:</label>
              <textarea name="fallas" value={form.fallas} onChange={handleChange} rows={2} className="border p-2 w-full mt-1" />
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
        )}

        <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          {solicitudSeleccionada && (
            <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}