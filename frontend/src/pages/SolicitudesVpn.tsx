import { useEffect, useState } from 'react';
import {
  getSolicitudesVpn, eliminarSolicitudVpn, imprimirSolicitudVpn,
} from '../services/solicitudVpnService';
import type { SolicitudVpn } from '../types/SolicitudVpn';
import NuevaSolicitudVpnModal from '../components/vpn/NuevaSolicitudVpnModal';
import EditarSolicitudVpnModal from '../components/vpn/EditarSolicitudVpnModal';
import SortIcon from '../components/common/SortIcon';

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'nombre_usuario', label: 'Usuario' },
  { key: 'area', label: 'Área' },
  { key: 'tipo_acceso', label: 'Tipo de acceso' },
  { key: 'fecha_inicio', label: 'Vigencia' },
  { key: 'estatus', label: 'Estatus' },
];

const ESTATUS_LABEL: Record<string, string> = {
  generado_cgd: 'CREADO EN CGD',
  atendiendo_dt: 'ATENDIENDO DGTI',
  activo: 'SERVICIO ACTIVO',
  baja: 'BAJA',
};

const TIPO_ACCESO_LABEL: Record<string, string> = {
  link: 'Link del sistema',
  ip_puerto: 'IP y puerto',
};

export default function SolicitudesVpn() {
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
      <div className="bg-blue-600 text-white font-bold px-4 py-3 rounded-t mb-0">
        SOLICITUDES DE ACCESO REMOTO (VPN)
      </div>

      <div className="border border-t-0 rounded-b p-4">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            + Nueva Solicitud
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span>Mostrar</span>
            <select value={porPagina} onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }} className="border rounded p-1">
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-2 text-left cursor-pointer" onClick={() => handleSort(c.key)}>
                  <span className="inline-flex items-center">{c.label}<SortIcon active={sortBy === c.key} direction={sortDir} /></span>
                </th>
              ))}
              <th className="p-2 text-left">Acciones</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="p-1"></th>
              <th className="p-1"><input value={filtros.nombre_usuario ?? ''} onChange={(e) => setFiltros({ ...filtros, nombre_usuario: e.target.value })} className="border p-1 w-full text-xs" /></th>
              <th className="p-1"><input value={filtros.area ?? ''} onChange={(e) => setFiltros({ ...filtros, area: e.target.value })} className="border p-1 w-full text-xs" /></th>
              <th className="p-1">
                <select
                  value={filtroTipoAcceso}
                  onChange={(e) => { setFiltroTipoAcceso(e.target.value); setPagina(1); }}
                  className="border p-1 w-full text-xs"
                >
                  <option value="todos">Todos</option>
                  <option value="link">Link del sistema</option>
                  <option value="ip_puerto">IP y puerto</option>
                </select>
              </th>
              <th className="p-1"></th>
              <th className="p-1">
                <select value={filtros.estatus ?? ''} onChange={(e) => setFiltros({ ...filtros, estatus: e.target.value })} className="border p-1 w-full text-xs">
                  <option value="">Todos</option>
                  {Object.entries(ESTATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </th>
              <th className="p-1"></th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((s) => (
              <tr key={s.id} className="border-t align-top">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.nombre_usuario}</td>
                <td className="p-2">{s.area ?? '-'}</td>
                <td className="p-2">{TIPO_ACCESO_LABEL[s.tipo_acceso] ?? s.tipo_acceso}</td>
                <td className="p-2">{s.fecha_inicio ?? '-'} — {s.fecha_fin ?? '-'}</td>
                <td className="p-2">{ESTATUS_LABEL[s.estatus] ?? s.estatus}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleImprimir(s.id)}
                      disabled={generandoId === s.id}
                      className="text-blue-700 hover:text-blue-900 disabled:opacity-40"
                      title="Generar PDF"
                    >
                      {generandoId === s.id ? '⏳' : '📄'}
                    </button>
                    <button
                      onClick={() => setEditarId(s.id)}
                      className="text-amber-600 hover:text-amber-800"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleEliminar(s.id)}
                      disabled={eliminandoId === s.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-40"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && <p className="text-gray-500 mt-4">Sin solicitudes de VPN.</p>}

        <div className="flex justify-between items-center mt-4 text-sm">
          <span>Mostrando registros del {inicio} al {fin} de un total de {total} registros</span>
          <div className="flex gap-1">
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-3 py-1 border rounded disabled:opacity-40">Anterior</button>
            <span className="px-3 py-1 bg-purple-800 text-white rounded">{pagina}</span>
            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-3 py-1 border rounded disabled:opacity-40">Siguiente</button>
          </div>
        </div>
      </div>

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
    </div>
  );
}