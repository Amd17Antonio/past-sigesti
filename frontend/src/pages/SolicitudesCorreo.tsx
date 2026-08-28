import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSolicitudesCorreo, eliminarSolicitudCorreo, imprimirSolicitudCorreo,
  getSolicitudCorreoDetalle, cambiarEstatusSolicitudCorreo,
} from '../services/solicitudCorreoService';
import type { SolicitudCorreo } from '../types/SolicitudCorreo';
import NuevaSolicitudCorreoModal from '../components/correo/NuevaSolicitudCorreoModal';
import EditarSolicitudCorreoModal from '../components/correo/EditarSolicitudCorreoModal';
import SortIcon from '../components/common/SortIcon';
import SenalEstatus from '../components/common/SenalEstatus';
import CambiarEstatusModal from '../components/common/CambiarEstatusModal';
import { useAuth } from '../context/AuthContext';

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'tipo_solicitud', label: 'Tipo' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'area', label: 'Área' },
  { key: 'correo_institucional', label: 'Correo' },
  { key: 'estatus', label: 'Estatus' },
];

const ESTATUS_LABEL: Record<string, string> = {
  creado_cgd: 'CREADO EN CGD',
  atendiendo_dgti: 'ATENDIENDO DGTI',
  activo: 'SERVICIO ACTIVO',
  baja: 'BAJA',
};

// Orden lineal del flujo: no se puede regresar a un paso anterior ni saltar etapas.
const ORDEN_ESTATUS_CORREO = ['creado_cgd', 'atendiendo_dgti', 'activo'];

export default function SolicitudesCorreo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<SolicitudCorreo[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editarId, setEditarId] = useState<number | null>(null);
  const [verEstatus, setVerEstatus] = useState<SolicitudCorreo | null>(null);
  const [generandoId, setGenerandoId] = useState<number | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const cargar = () => {
    getSolicitudesCorreo({ pagina, por_pagina: porPagina, ...filtros }).then((r) => {
      setData(r.registros);
      setTotal(r.total);
      setTotalPaginas(r.total_paginas);
    });
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line
  }, [pagina, porPagina]);

  useEffect(() => {
    const t = setTimeout(() => { setPagina(1); cargar(); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [filtros]);

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(key); setSortDir('asc'); }
  };

  const ordenados = sortBy
    ? [...data].sort((a: any, b: any) => {
        const valA = a[sortBy] ?? '';
        const valB = b[sortBy] ?? '';
        const cmp = typeof valA === 'number' && typeof valB === 'number'
          ? valA - valB
          : String(valA).localeCompare(String(valB));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  const handleImprimir = async (s: SolicitudCorreo) => {
    setGenerandoId(s.id);
    try {
      await imprimirSolicitudCorreo(s.id);
    } finally {
      setGenerandoId(null);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta solicitud de correo? Esta acción no se puede deshacer.')) return;
    setEliminandoId(id);
    try {
      await eliminarSolicitudCorreo(id);
      cargar();
    } finally {
      setEliminandoId(null);
    }
  };

  const inicio = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const fin = Math.min(pagina * porPagina, total);

  return (
    <div className="p-6">
      {/* Cabecera Principal */}
      <div className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-t-lg shadow-sm text-base">
        SOLICITUDES DE CORREO INSTITUCIONAL
      </div>

      <div className="border border-t-0 border-blue-100 rounded-b-lg p-4 bg-white shadow-sm">
        {/* Barra superior de acciones y paginación */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              + Nueva Solicitud
            </button>
            {user?.rol?.nombre === 'Administrador' && (
              <button
                onClick={() => navigate('/resguardo/correo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Resguardo Correo
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Mostrar</span>
            <select
              value={porPagina}
              onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
              className="border border-blue-200 rounded p-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="overflow-x-auto border border-blue-100 rounded-lg bg-white shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50/70 text-blue-900 uppercase text-xs">
              <tr>
                {COLUMNAS.map((c) => (
                  <th
                    key={c.key}
                    className={`p-3 cursor-pointer select-none hover:bg-blue-100/50 ${c.key === 'id' ? 'w-16' : ''}`}
                    onClick={() => handleSort(c.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      <SortIcon active={sortBy === c.key} direction={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="p-3 w-[120px] text-center">Acciones</th>
              </tr>
              <tr className="bg-gray-50 border-t border-blue-100">
                <th className="p-1.5 w-16"></th>
                <th className="p-1.5">
                  <select
                    value={filtros.tipo_solicitud ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, tipo_solicitud: e.target.value })}
                    className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Todos</option>
                    <option value="alta">Alta</option>
                    <option value="baja">Baja</option>
                  </select>
                </th>
                <th className="p-1.5">
                  <input
                    value={filtros.nombre ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
                    placeholder="Filtrar..."
                    className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </th>
                <th className="p-1.5">
                  <input
                    value={filtros.area ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, area: e.target.value })}
                    placeholder="Filtrar..."
                    className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </th>
                <th className="p-1.5">
                  <input
                    value={filtros.correo_institucional ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, correo_institucional: e.target.value })}
                    placeholder="Filtrar..."
                    className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </th>
                <th className="p-1.5">
                  <select
                    value={filtros.estatus ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, estatus: e.target.value })}
                    className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Todos</option>
                    {Object.entries(ESTATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </th>
                <th className="p-1.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {ordenados.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors align-middle">
                  <td className="p-3 w-16 font-medium">
                    {user?.rol?.nombre === 'Administrador' ? (
                      <button
                        onClick={() => setVerEstatus(s)}
                        className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                      >
                        {s.id}
                      </button>
                    ) : (
                      <span className="text-gray-800">{s.id}</span>
                    )}
                  </td>
                  <td className="p-3 uppercase text-gray-700 font-medium">{s.tipo_solicitud}</td>
                  <td className="p-3 text-gray-800 font-medium">{s.nombre}</td>
                  <td className="p-3 text-gray-700">{s.area ?? '-'}</td>
                  <td className="p-3 text-gray-700">{s.correo_institucional ?? '-'}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <SenalEstatus tipo="correo" estatus={s.estatus} />
                      <span className="text-xs font-semibold text-gray-700">
                        {ESTATUS_LABEL[s.estatus] ?? s.estatus}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap w-[120px]">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleImprimir(s)}
                        disabled={generandoId === s.id}
                        title="Generar PDF"
                        className="p-1.5 rounded hover:bg-blue-100 hover:ring-1 hover:ring-blue-300 transition-colors disabled:opacity-40"
                      >
                        {generandoId === s.id ? '⏳' : '📄'}
                      </button>
                      {s.estatus === 'creado_cgd' ? (
                        <button
                          onClick={() => setEditarId(s.id)}
                          title="Editar"
                          className="p-1.5 rounded hover:bg-amber-100 hover:ring-1 hover:ring-amber-300 transition-colors"
                        >
                          ✏️
                        </button>
                      ) : (
                        <span className="opacity-30 cursor-not-allowed p-1.5" title="No editable: ya está en atención de DGTID">
                          ✏️
                        </span>
                      )}
                      <button
                        onClick={() => handleEliminar(s.id)}
                        disabled={eliminandoId === s.id}
                        title="Eliminar"
                        className="p-1.5 rounded hover:bg-red-100 hover:ring-1 hover:ring-red-300 transition-colors disabled:opacity-40"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
            Sin solicitudes de correo encontradas.
          </div>
        )}

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-700 flex-wrap gap-2">
          <span>Mostrando registros del {inicio} al {fin} de un total de {total} registros</span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-3 py-1.5 border border-gray-300 bg-white rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm">
              {pagina}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="px-3 py-1.5 border border-gray-300 bg-white rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <NuevaSolicitudCorreoModal onClose={() => setMostrarModal(false)} onCreado={cargar} />
      )}

      {editarId !== null && (
        <EditarSolicitudCorreoModal
          idSolicitud={editarId}
          onClose={() => setEditarId(null)}
          onSaved={cargar}
        />
      )}

      {verEstatus && (
        <CambiarEstatusModal
          folio={verEstatus.id}
          estatusActual={verEstatus.estatus}
          opciones={[
            { value: 'creado_cgd', label: 'CREADO EN CGD' },
            { value: 'atendiendo_dgti', label: 'ATENDIENDO DGTI' },
            { value: 'activo', label: 'SERVICIO ACTIVO' },
            { value: 'baja', label: 'BAJA' },
          ]}
          orden={ORDEN_ESTATUS_CORREO}
          estatusQueRequiereFolio="atendiendo_dgti"
          estatusActivo="activo"
          estatusBaja="baja"
          onGuardar={(payload) => cambiarEstatusSolicitudCorreo(verEstatus.id, payload as any)}
          onClose={() => setVerEstatus(null)}
          onActualizado={cargar}
          cargarInfoGeneral={async () => {
            const { solicitud } = await getSolicitudCorreoDetalle(verEstatus.id);
            return [
              { label: 'Folio (ID)', value: solicitud.id },
              { label: 'Tipo de solicitud', value: solicitud.tipo_solicitud?.toUpperCase() },
              { label: 'Nombre', value: solicitud.nombre },
              { label: 'Puesto', value: solicitud.puesto },
              { label: 'Área', value: solicitud.area },
              { label: 'Área interna', value: solicitud.area_interna },
              { label: 'Correo secundario', value: solicitud.correo_secundario },
              { label: 'Teléfono de contacto', value: solicitud.telefono_contacto },
              { label: 'Extensión', value: (solicitud as any).extension },
              { label: 'Correo institucional', value: solicitud.correo_institucional },
              { label: 'Usuario generado', value: solicitud.usuario_generado },
              { label: 'Oficio CGD', value: solicitud.oficio_cgd },
              { label: 'Observaciones', value: solicitud.observaciones },
              {
                label: 'Estatus',
                value: [
                  solicitud.fecha_creado_cgd && `CREADO EN CGD: ${solicitud.fecha_creado_cgd}`,
                  solicitud.fecha_atendiendo_dgti && `ATENDIENDO DGTI: ${solicitud.fecha_atendiendo_dgti}${solicitud.folio_glpi ? `\nFOLIO GLPI: ${solicitud.folio_glpi}` : ''}`,
                  solicitud.fecha_activo && `SERVICIO ACTIVO: ${solicitud.fecha_activo}`,
                  solicitud.fecha_baja && `BAJA: ${solicitud.fecha_baja}${solicitud.motivo_baja ? `\nMOTIVO: ${solicitud.motivo_baja}` : ''}`,
                ].filter(Boolean).join('\n\n'),
              },
            ];
          }}
        />
      )}
    </div>
  );
}