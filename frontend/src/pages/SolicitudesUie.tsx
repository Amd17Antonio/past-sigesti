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
  'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap';

export default function SolicitudesUie() {
  const { user } = useAuth();
  const rolActual = user?.rol?.nombre ?? '';
  const esAdmin = rolActual === 'Administrador';
  const esSoporte = rolActual === 'Soporte Técnico';

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

  useEffect(() => { cargar(); }, [pagina, porPagina, filtros, sortBy, sortDir]);

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-semibold">Solicitudes</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {rolActual !== 'Capturista' && (
            <NavLink to="/mis-asignadas" className={navBtnClass}>Mis Asignadas</NavLink>
          )}
          <NavLink
  to="/asignadas"
  className={`${navBtnClass} bg-blue-600`}
>
  Asignadas
</NavLink>

<NavLink
  to="/pendientes"
  className={`${navBtnClass} bg-blue-600`}
>
  Pendientes
</NavLink>

<NavLink
  to="/historial"
  className={`${navBtnClass} bg-blue-600`}
>
  Historial
</NavLink>
          <button
            onClick={() => setModalCrear(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
          >
            + Agregar solicitud
          </button>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Acciones</th>
            {columnas.map((c) => (
              <th
                key={c.campo}
                className="p-2 text-left cursor-pointer select-none"
                onClick={() => toggleSort(c.campo)}
              >
                {c.label} {sortBy === c.campo ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
            <th className="p-2 text-left">No. Dictamen</th>
            <th className="p-2 text-left">Archivos</th>
            <th className="p-2 text-left">Asignar</th>
          </tr>
          <tr>
            <td></td>
            {columnas.map((c) => (
              <td key={c.campo} className="p-1">
                <input
                  className="border rounded w-full px-1 py-0.5 text-xs"
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
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <ActionsDropdown
                  color={getColorSemaforo(r)}
                  actions={[
                    { label: 'Detalle', onClick: () => setModalDetalle(r.id) },
                    { label: 'Agregar Equipo', onClick: () => setModalEquipo(r.id) },
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
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.ejercicio}</td>
              <td className="p-2">{r.solicitante}</td>
              <td className="p-2">{r.area}</td>
              <td className="p-2">{r.num_documento}</td>
              <td className="p-2">{r.tecnico}</td>
              <td className="p-2">{r.no_inventario}</td>
              <td className="p-2">{r.fecha_asignacion}</td>
              <td className="p-2">{r.NoDictamen ?? '-'}</td>
              <td className="p-2">
                {r.memoSolicitud > 0 && (
                  <button
                    onClick={() => handleVerMemorandum(r.id)}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded block mb-1 w-full"
                  >
                    Memorándum
                  </button>
                )}
                {r.acuseDictamen > 0 && (
                  <button
                    onClick={() => handleVerAcuseDictamen(r.id)}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded block w-full"
                  >
                    Acuse Dictamen
                  </button>
                )}
              </td>
              <td className="p-2">
                {r.fecha_cierre ? (
                  <span className="text-xs text-gray-400">Cerrada</span>
                ) : (
                  <button
                    onClick={() => setAsignarId(r.id)}
                    disabled={!!r.tecnico}
                    className="px-2 py-1 bg-purple-800 text-white rounded text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Asignar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          Por página:
          <select
            className="border rounded ml-2 px-2 py-1"
            value={porPagina}
            onChange={(e) => { setPagina(1); setPorPagina(Number(e.target.value)); }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <button disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>◀</button>
          <span>Página {pagina}</span>
          <button onClick={() => setPagina((p) => p + 1)}>▶</button>
        </div>
        <div>Se han encontrado {total} registros</div>
      </div>

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
