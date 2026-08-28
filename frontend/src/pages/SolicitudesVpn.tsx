import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSolicitudesVpn, eliminarSolicitudVpn, imprimirSolicitudVpn,
  getSolicitudVpnDetalle, cambiarEstatusSolicitudVpn,
} from '../services/solicitudVpnService';
import type { SolicitudVpn } from '../types/SolicitudVpn';
import NuevaSolicitudVpnModal from '../components/vpn/NuevaSolicitudVpnModal';
import EditarSolicitudVpnModal from '../components/vpn/EditarSolicitudVpnModal';
import SortIcon from '../components/common/SortIcon';
import SenalEstatus from '../components/common/SenalEstatus';
import CambiarEstatusModal from '../components/common/CambiarEstatusModal';
import { useAuth } from '../context/AuthContext';

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'nombre_usuario', label: 'Usuario' },
  { key: 'area', label: 'Área' },
  { key: 'tipo_acceso', label: 'Tipo de acceso' },
  { key: 'fecha_inicio', label: 'Vigencia' },
  { key: 'estatus', label: 'Estatus' },
];

const ESTATUS_LABEL: Record<string, string> = {
  creado_cgd: 'CREADO EN CGD',
  atendiendo_dgti: 'ATENDIENDO DGTI',
  activo: 'SERVICIO ACTIVO',
  baja: 'BAJA',
};

const TIPO_ACCESO_LABEL: Record<string, string> = {
  link: 'Link del sistema',
  ip_puerto: 'IP y puerto',
};

// Orden lineal del flujo: no se puede regresar a un paso anterior ni saltar etapas.
const ORDEN_ESTATUS_VPN = ['creado_cgd', 'atendiendo_dgti', 'activo'];

export default function SolicitudesVpn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<SolicitudVpn[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [filtroTipoAcceso, setFiltroTipoAcceso] = useState('todos');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editarId, setEditarId] = useState<number | null>(null);
  const [verEstatus, setVerEstatus] = useState<SolicitudVpn | null>(null);
  const [generandoId, setGenerandoId] = useState<number | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const cargar = () => {
    getSolicitudesVpn({
      pagina, por_pagina: porPagina,
      tipo_acceso: filtroTipoAcceso,
      ...filtros,
    }).then((r) => {
      setData(r.registros);
      setTotal(r.total);
      setTotalPaginas(r.total_paginas);
    });
  };

  useEffect(() => { cargar(); // eslint-disable-next-line
  }, [pagina, porPagina, filtroTipoAcceso]);

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

  const handleImprimir = async (id: number) => {
    setGenerandoId(id);
    try {
      await imprimirSolicitudVpn(id);
    } finally {
      setGenerandoId(null);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta solicitud de VPN? Esta acción no se puede deshacer.')) return;
    setEliminandoId(id);
    try {
      await eliminarSolicitudVpn(id);
      cargar();
    } finally {
      setEliminandoId(null);
    }
  };

  const inicio = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const fin = Math.min(pagina * porPagina, total);

  return (
    <div className="p-6">
      {/* Cabecera Azul Institucional */}
      <div className="bg-blue-600 text-white font-bold px-4 py-2 rounded-t mb-0 flex justify-between items-center">
        <span>SOLICITUDES DE ACCESO REMOTO (VPN)</span>
      </div>

      <div className="border border-t-0 rounded-b p-4 border-blue-100 bg-white shadow-sm">
        {/* Barra de Acciones Superiores */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMostrarModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors shadow-sm"
            >
              + Nueva Solicitud
            </button>
            {user?.rol?.nombre === 'Administrador' && (
              <button
                onClick={() => navigate('/resguardo/vpn')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors shadow-sm"
              >
                Resguardo VPN
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Mostrar</span>
            <select 
              value={porPagina} 
              onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }} 
              className="border border-blue-200 rounded p-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border border-blue-100 text-sm">
            <thead>
              <tr className="bg-blue-50/70 text-blue-900">
                {COLUMNAS.map((c) => (
                  <th
                    key={c.key}
                    className={`p-2 text-left cursor-pointer transition-colors ${c.key === 'id' ? 'w-14' : ''}`}
                    onClick={() => handleSort(c.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      <SortIcon active={sortBy === c.key} direction={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="p-2 text-left w-[120px]">Acciones</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="p-1 w-14"></th>
                <th className="p-1">
                  <input 
                    value={filtros.nombre_usuario ?? ''} 
                    onChange={(e) => setFiltros({ ...filtros, nombre_usuario: e.target.value })} 
                    className="border border-blue-200 p-1 w-full text-xs rounded bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                    placeholder="Filtrar..."
                  />
                </th>
                <th className="p-1">
                  <input 
                    value={filtros.area ?? ''} 
                    onChange={(e) => setFiltros({ ...filtros, area: e.target.value })} 
                    className="border border-blue-200 p-1 w-full text-xs rounded bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                    placeholder="Filtrar..."
                  />
                </th>
                <th className="p-1">
                  <select
                    value={filtroTipoAcceso}
                    onChange={(e) => { setFiltroTipoAcceso(e.target.value); setPagina(1); }}
                    className="border border-blue-200 p-1 w-full text-xs rounded bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="todos">Todos</option>
                    <option value="link">Link del sistema</option>
                    <option value="ip_puerto">IP y puerto</option>
                  </select>
                </th>
                <th className="p-1"></th>
                <th className="p-1">
                  <select 
                    value={filtros.estatus ?? ''} 
                    onChange={(e) => setFiltros({ ...filtros, estatus: e.target.value })} 
                    className="border border-blue-200 p-1 w-full text-xs rounded bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Todos</option>
                    {Object.entries(ESTATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </th>
                <th className="p-1"></th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((s) => (
                <tr key={s.id} className="border-t border-blue-100 align-top hover:bg-blue-50/40 transition-colors">
                  <td className="p-2 w-14">
                    {user?.rol?.nombre === 'Administrador' ? (
                      <button
                        onClick={() => setVerEstatus(s)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {s.id}
                      </button>
                    ) : (
                      s.id
                    )}
                  </td>
                  <td className="p-2 text-gray-800">{s.nombre_usuario}</td>
                  <td className="p-2 text-gray-600">{s.area ?? '-'}</td>
                  <td className="p-2 text-gray-600">{TIPO_ACCESO_LABEL[s.tipo_acceso] ?? s.tipo_acceso}</td>
                  <td className="p-2 text-gray-600">{s.fecha_inicio ?? '-'} — {s.fecha_fin ?? '-'}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <SenalEstatus tipo="vpn" estatus={s.estatus} />
                      <span className="text-xs text-gray-700 font-medium">{ESTATUS_LABEL[s.estatus] ?? s.estatus}</span>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap w-[120px]">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleImprimir(s.id)}
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
                        <span className="opacity-30 cursor-not-allowed p-1.5" title="No editable: ya está en atención">
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

        {data.length === 0 && <p className="text-gray-500 mt-4 text-sm text-center py-4">Sin solicitudes de VPN.</p>}

        {/* Paginación Inferior */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>Mostrando registros del {inicio} al {fin} de un total de {total} registros</span>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setPagina((p) => Math.max(1, p - 1))} 
              disabled={pagina === 1} 
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded font-medium shadow-sm">{pagina}</span>
            <button 
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} 
              disabled={pagina === totalPaginas} 
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {mostrarModal && (
        <NuevaSolicitudVpnModal onClose={() => setMostrarModal(false)} onCreado={cargar} />
      )}

      {editarId !== null && (
        <EditarSolicitudVpnModal
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
          orden={ORDEN_ESTATUS_VPN}
          estatusQueRequiereFolio="atendiendo_dgti"
          estatusActivo="activo"
          estatusBaja="baja"
          onGuardar={(payload) => cambiarEstatusSolicitudVpn(verEstatus.id, payload as any)}
          onClose={() => setVerEstatus(null)}
          onActualizado={cargar}
          cargarInfoGeneral={async () => {
            const { solicitud } = await getSolicitudVpnDetalle(verEstatus.id);
            return [
              { label: 'Folio (ID)', value: solicitud.id },
              { label: 'Usuario', value: solicitud.nombre_usuario },
              { label: 'Puesto', value: solicitud.puesto },
              { label: 'Área', value: solicitud.area },
              { label: 'Dependencia', value: solicitud.dependencia },
              { label: 'Correo institucional', value: solicitud.correo_institucional },
              { label: 'Teléfono', value: solicitud.telefono },
              { label: 'Extensión', value: solicitud.extension },
              { label: 'Tipo de acceso', value: TIPO_ACCESO_LABEL[solicitud.tipo_acceso] ?? solicitud.tipo_acceso },
              { label: 'Link del sistema', value: solicitud.link_sistema },
              { label: 'IP y puerto', value: solicitud.ip_puerto },
              { label: 'Justificación de uso', value: solicitud.justificacion_uso },
              { label: 'Vigencia', value: `${solicitud.fecha_inicio ?? '-'} — ${solicitud.fecha_fin ?? '-'}` },
              { label: 'No. Ticket', value: solicitud.num_ticket },
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