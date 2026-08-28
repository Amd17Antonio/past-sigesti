import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getSolicitudesUie,
  autorizarDictamenSolicitud,
  cerrarDictamenSolicitud,
  desautorizarDictamenTecnico,
  duplicarSolicitud,
  darBajaSolicitud,
  getArchivosSolicitud,
} from '../services/solicitudUieService';
import { abrirPdfEquipoMantenimiento } from '../services/equipoMantenimientoCgdService';
import type { SolicitudUieRow } from '../types/SolicitudUie';
import ActionsDropdown from '../components/common/ActionsDropdown';
import AgregarEquipoModal from '../components/solicitudes/AgregarEquipoModal';
import DetalleSolicitudModal from '../components/solicitudes/DetalleSolicitudModal';
import CrearSolicitudModal from '../components/solicitudes/CrearSolicitudModal';
import EditarSolicitudUieModal from '../components/solicitudes/EditarSolicitudUieModal';
import AsignarModal from '../components/tickets/AsignarModal';

// baseURL de axios viene con "/api" al final (ej. http://localhost:8000/api);
// los archivos se sirven desde la raíz del backend (ej. http://localhost:8000/storage/...)
const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL ?? '').replace(/\/api\/?$/, '');

const navBtnClass =
  'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap transition shadow-sm';

export default function SolicitudesUie() {
  const { user } = useAuth();
  const rolActual = user?.rol?.nombre ?? '';
  const esAdmin = rolActual === 'Administrador';
  const esSoporte = rolActual === 'Soporte Técnico';
  const puedeAgregarEquipo = ['Administrador', 'Capturista'].includes(rolActual);

  const [registros, setRegistros] = useState<SolicitudUieRow[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [modalEquipo, setModalEquipo] = useState<number | null>(null);
  const [asignarId, setAsignarId] = useState<number | null>(null);
  const [modalDetalle, setModalDetalle] = useState<number | null>(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('folio_sistema');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const cargar = async () => {
    const data = await getSolicitudesUie({
      pagina,
      por_pagina: porPagina,
      sort_by: sortBy,
      sort_dir: sortDir,
      ...filtros,
    });
    setRegistros(data.registros);
    setTotal(data.total);
  };

  useEffect(() => { cargar(); // eslint-disable-next-line
  }, [pagina, porPagina, filtros, sortBy, sortDir]);

  const handleFiltro = (campo: string, valor: string) => {
    setPagina(1);
    setFiltros((f) => ({ ...f, [campo]: valor }));
  };

  const toggleSort = (campo: string) => {
    if (sortBy === campo) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(campo);
      setSortDir('asc');
    }
  };

  const handleAutorizarDictamen = async (id: number) => {
    if (!confirm('¿Autorizar el dictamen de esta solicitud?')) return;
    try {
      await autorizarDictamenSolicitud(id);
      cargar();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al autorizar el dictamen');
    }
  };

  const handleCerrarDictamen = async (id: number) => {
    if (!confirm('¿Cerrar y autorizar el dictamen de esta solicitud?')) return;
    try {
      await cerrarDictamenSolicitud(id);
      cargar();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al cerrar el dictamen');
    }
  };

  const handleDesautorizar = async (id: number) => {
    if (!confirm('¿Desautorizar el dictamen técnico de esta solicitud?')) return;
    try {
      await desautorizarDictamenTecnico(id);
      cargar();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al desautorizar el dictamen');
    }
  };

  const handleDuplicar = async (id: number) => {
    if (!confirm('¿Duplicar esta solicitud?')) return;
    try {
      await duplicarSolicitud(id);
      cargar();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al duplicar la solicitud');
    }
  };

  const handleBaja = async (id: number) => {
    const motivo = prompt('Motivo de la baja:');
    if (!motivo) return;
    try {
      await darBajaSolicitud(id, motivo);
      cargar();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Error al dar de baja la solicitud');
    }
  };

  const abrirArchivo = async (idSolicitud: number, tipo: 'memoSolicitud' | 'acuseDictamen') => {
    try {
      const archivos = await getArchivosSolicitud(idSolicitud);
      const delTipo = archivos.filter((a) => a.tipo === tipo);

      if (delTipo.length === 0) {
        alert('No se encontró el archivo.');
        return;
      }

      window.open(`${BACKEND_ORIGIN}${delTipo[0].ruta_archivo}`, '_blank');
    } catch {
      alert('No fue posible abrir el archivo.');
    }
  };

  const handleVerMemorandum = (id: number) => abrirArchivo(id, 'memoSolicitud');
  const handleVerAcuseDictamen = (id: number) => abrirArchivo(id, 'acuseDictamen');

  const handleVerChecklist = async (idEquipoSolicitud: number) => {
    try {
      await abrirPdfEquipoMantenimiento(idEquipoSolicitud);
    } catch {
      alert('No fue posible abrir el checklist de mantenimiento.');
    }
  };

  const columnas: { campo: string; label: string }[] = [
    { campo: 'folio_sistema', label: 'Folio Sistema' },
    { campo: 'ejercicio', label: 'Ejercicio' },
    { campo: 'solicitante', label: 'Solicitante' },
    { campo: 'area', label: 'Área' },
    { campo: 'num_documento', label: 'No. Documento' },
    { campo: 'tecnico', label: 'Técnico' },
    { campo: 'no_inventario', label: 'No. Inventario' },
    { campo: 'fecha_asignacion', label: 'Fecha Asignación' },
  ];

  const getColorSemaforo = (r: SolicitudUieRow): 'rojo' | 'ambar' | 'verde' => {
    if (r.fecha_autoriza_dictamen) return 'verde';
    if (r.fecha_autoriza_tecnico) return 'ambar';
    return 'rojo';
  };

  return (
    <div className="p-6">
      {/* Cabecera Azul Institucional */}
      <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-t mb-0 flex justify-between items-center flex-wrap gap-2">
        <span>SOLICITUDES UIE / DICTÁMENES TÉCNICOS</span>
        <div className="flex items-center gap-2 flex-wrap">
          {rolActual !== 'Capturista' && (
            <NavLink to="/mis-asignadas" className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs transition shadow-sm">
              Mis Asignadas
            </NavLink>
          )}
          <NavLink to="/asignadas" className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs transition shadow-sm">
            Asignadas
          </NavLink>
        </div>
      </div>

      <div className="border border-t-0 rounded-b p-4 border-blue-100 bg-white shadow-sm">
        {/* Barra de Acciones Superiores */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <button
            onClick={() => setModalCrear(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors shadow-sm"
          >
            + Agregar solicitud
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Mostrar</span>
            <select
              value={porPagina}
              onChange={(e) => { setPagina(1); setPorPagina(Number(e.target.value)); }}
              className="border border-blue-200 rounded p-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border border-blue-100 text-sm">
            <thead>
              <tr className="bg-blue-50/70 text-blue-900">
                <th className="p-2 text-left w-20">Acciones</th>
                {columnas.map((c) => (
                  <th
                    key={c.campo}
                    className="p-2 text-left cursor-pointer select-none transition-colors hover:bg-blue-100/50"
                    onClick={() => toggleSort(c.campo)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label} {sortBy === c.campo ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                    </span>
                  </th>
                ))}
                <th className="p-2 text-left">No. Dictamen</th>
                <th className="p-2 text-left">Archivos</th>
                <th className="p-2 text-left">Asignar</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="p-1"></th>
                {columnas.map((c) => (
                  <td key={c.campo} className="p-1">
                    <input
                      className="border border-blue-200 rounded w-full px-1.5 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Filtrar..."
                      onChange={(e) => handleFiltro(c.campo, e.target.value)}
                    />
                  </td>
                ))}
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id} className="border-t border-blue-100 hover:bg-blue-50/40 transition-colors align-top">
                  <td className="p-2">
                    <ActionsDropdown
                      color={getColorSemaforo(r)}
                      actions={[
                        { label: 'Detalle', onClick: () => setModalDetalle(r.id) },
                        {
                          label: 'Agregar Equipo',
                          onClick: () => setModalEquipo(r.id),
                          hidden: !puedeAgregarEquipo || !!r.no_inventario,
                        },
                        {
                          label: 'Ver Checklist Mantenimiento',
                          onClick: () => handleVerChecklist(r.id_equipo_solicitud!),
                          hidden: !r.tiene_checklist || !r.id_equipo_solicitud,
                        },
                        {
                          label: 'Autorizar Dictamen',
                          onClick: () => handleAutorizarDictamen(r.id),
                          hidden: !(esAdmin || esSoporte) || !r.fecha_cierre || !!r.fecha_autoriza_tecnico,
                        },
                        {
                          label: 'Cerrar Dictamen',
                          onClick: () => handleCerrarDictamen(r.id),
                          hidden: !esAdmin || !r.fecha_autoriza_tecnico || !!r.fecha_autoriza_dictamen,
                        },
                        {
                          label: 'Desautorizar Dictamen Técnico',
                          onClick: () => handleDesautorizar(r.id),
                          hidden: !esAdmin || !r.fecha_autoriza_dictamen,
                          danger: true,
                        },
                        { label: 'Duplicar Solicitud', onClick: () => handleDuplicar(r.id) },
                        { label: 'Editar', onClick: () => setModalEditar(r.id) },
                        { label: 'Baja', onClick: () => handleBaja(r.id), danger: true },
                      ]}
                    />
                  </td>
                  <td className="p-2 text-gray-800">{r.id}</td>
                  <td className="p-2 text-gray-600">{r.ejercicio}</td>
                  <td className="p-2 text-gray-800">{r.solicitante}</td>
                  <td className="p-2 text-gray-600">{r.area}</td>
                  <td className="p-2 text-gray-600">{r.num_documento}</td>
                  <td className="p-2 text-gray-600">{r.tecnico}</td>
                  <td className="p-2 text-gray-600">{r.no_inventario}</td>
                  <td className="p-2 text-gray-600">{r.fecha_asignacion}</td>
                  <td className="p-2 text-gray-600">{r.NoDictamen ?? '-'}</td>
                  <td className="p-2 space-y-1">
                    {r.memoSolicitud > 0 && (
                      <button
                        onClick={() => handleVerMemorandum(r.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded block w-full transition shadow-sm"
                      >
                        Memorándum
                      </button>
                    )}
                    {r.acuseDictamen > 0 && (
                      <button
                        onClick={() => handleVerAcuseDictamen(r.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded block w-full transition shadow-sm"
                      >
                        Acuse Dictamen
                      </button>
                    )}
                    {r.tiene_checklist && r.id_equipo_solicitud && (
                      <button
                        onClick={() => handleVerChecklist(r.id_equipo_solicitud!)}
                        className="bg-gray-700 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded block w-full transition shadow-sm"
                        title="Ver / imprimir checklist de mantenimiento"
                      >
                        🖨 Mantenimiento
                      </button>
                    )}
                  </td>
                  <td className="p-2">
                    {r.fecha_cierre ? (
                      <span className="text-xs text-gray-400 font-medium">Cerrada</span>
                    ) : (
                      <button
                        onClick={() => setAsignarId(r.id)}
                        disabled={!!r.tecnico}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                      >
                        Asignar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {registros.length === 0 && <p className="text-gray-500 mt-4 text-sm text-center py-4">Sin solicitudes registradas.</p>}

        {/* Paginación Inferior */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>Se han encontrado {total} registros</span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded font-medium shadow-sm">{pagina}</span>
            <button
              onClick={() => setPagina((p) => p + 1)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {modalEquipo && (
        <AgregarEquipoModal
          idSolicitud={modalEquipo}
          onClose={() => setModalEquipo(null)}
          onSaved={cargar}
        />
      )}

      {modalDetalle && (
        <DetalleSolicitudModal
          idSolicitud={modalDetalle}
          onClose={() => setModalDetalle(null)}
        />
      )}

      {modalCrear && (
        <CrearSolicitudModal
          onClose={() => setModalCrear(false)}
          onCreado={cargar}
        />
      )}

      {asignarId !== null && (
        <AsignarModal
          solicitudId={asignarId}
          onClose={() => setAsignarId(null)}
          onAsignado={cargar}
          titulo="Asignar"
        />
      )}

      {modalEditar && (
        <EditarSolicitudUieModal
          idSolicitud={modalEditar}
          onClose={() => setModalEditar(null)}
          onSaved={cargar}
        />
      )}
    </div>
  );
}