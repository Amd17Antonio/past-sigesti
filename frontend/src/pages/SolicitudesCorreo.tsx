import { useEffect, useState } from 'react';
import {
  getSolicitudesCorreo, eliminarSolicitudCorreo, imprimirSolicitudCorreo,
} from '../services/solicitudCorreoService';
import type { SolicitudCorreo } from '../types/SolicitudCorreo';
import NuevaSolicitudCorreoModal from '../components/correo/NuevaSolicitudCorreoModal';
import EditarSolicitudCorreoModal from '../components/correo/EditarSolicitudCorreoModal';
import SortIcon from '../components/common/SortIcon';

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'tipo_solicitud', label: 'Tipo' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'area', label: 'Área' },
  { key: 'correo_institucional', label: 'Correo' },
  { key: 'estatus', label: 'Estatus' },
];

const ESTATUS_LABEL: Record<string, string> = {
  generado_cgd: 'CREADO EN CGD',
  atendiendo_dt: 'ATENDIENDO DGTI',
  activo: 'SERVICIO ACTIVO',
  baja: 'BAJA',
};

export default function SolicitudesCorreo() {
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
  const [generandoId, setGenerandoId] = useState<number | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const cargar = () => {
    getSolicitudesCorreo({ pagina, por_pagina: porPagina, ...filtros }).then((r) => {
      setData(r.registros);
      setTotal(r.total);
      setTotalPaginas(r.total_paginas);
    });
  };

  useEffect(() => { cargar(); // eslint-disable-next-line
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

  //const handleImprimir = async (id: number) => {
  //  setGenerandoId(id);
  //  try {
  //    await imprimirSolicitudCorreo(id);
  //  } finally {
  //    setGenerandoId(null);
  //  }
  //};

  const handleImprimir = async (s: SolicitudCorreo) => {
    setGenerandoId(s.id);
    try {
      //await imprimirSolicitudCorreo(s.id, s.tipo_solicitud);
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
      <div className="bg-blue-600 text-white font-bold px-4 py-3 rounded-t mb-0">
        SOLICITUDES DE CORREO INSTITUCIONAL
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
              <th className="p-1">
                <select value={filtros.tipo_solicitud ?? ''} onChange={(e) => setFiltros({ ...filtros, tipo_solicitud: e.target.value })} className="border p-1 w-full text-xs">
                  <option value="">Todos</option>
                  <option value="alta">Alta</option>
                  <option value="baja">Baja</option>
                </select>
              </th>
              <th className="p-1"><input value={filtros.nombre ?? ''} onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })} className="border p-1 w-full text-xs" /></th>
              <th className="p-1"><input value={filtros.area ?? ''} onChange={(e) => setFiltros({ ...filtros, area: e.target.value })} className="border p-1 w-full text-xs" /></th>
              <th className="p-1"><input value={filtros.correo_institucional ?? ''} onChange={(e) => setFiltros({ ...filtros, correo_institucional: e.target.value })} className="border p-1 w-full text-xs" /></th>
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
                <td className="p-2 uppercase">{s.tipo_solicitud}</td>
                <td className="p-2">{s.nombre}</td>
                <td className="p-2">{s.area ?? '-'}</td>
                <td className="p-2">{s.correo_institucional ?? '-'}</td>
                <td className="p-2">{ESTATUS_LABEL[s.estatus] ?? s.estatus}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleImprimir(s)}
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

        {data.length === 0 && <p className="text-gray-500 mt-4">Sin solicitudes de correo.</p>}

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
        <NuevaSolicitudCorreoModal onClose={() => setMostrarModal(false)} onCreado={cargar} />
      )}

      {editarId !== null && (
        <EditarSolicitudCorreoModal
          idSolicitud={editarId}
          onClose={() => setEditarId(null)}
          onSaved={cargar}
        />
      )}
    </div>
  );
}
