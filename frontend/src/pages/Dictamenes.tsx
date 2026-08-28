import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SortIcon from '../components/common/SortIcon';
import NuevoDictamenModal from '../components/dictamenes/NuevoDictamenModal';
import EditarDictamenModal from '../components/dictamenes/EditarDictamenModal';
import { getDictamenes, abrirDictamenPdf, type DictamenRow } from '../services/dictamenService';

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'folio_sistema', label: 'Folio Sistema' },
  { key: 'folio_dictamen', label: 'Folio Dictamen' },
  { key: 'fecha_dictamen', label: 'Fecha Dictamen' },
  { key: 'expediente', label: 'Expediente' },
  { key: 'area', label: 'Área' },
  { key: 'no_inventario', label: 'Equipos' },
];

export default function Dictamenes() {
  const { user } = useAuth();
  const esAdmin = user?.rol?.nombre === 'Administrador';

  const [data, setData] = useState<DictamenRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [mostrarNuevo, setMostrarNuevo] = useState(false);

  // Editar: se identifica por folio_sistema (id_solicitud)
  const [editandoIdSolicitud, setEditandoIdSolicitud] = useState<number | null>(null);

  // Descarga del PDF
  const [descargando, setDescargando] = useState<number | null>(null);

  const cargar = () => {
    getDictamenes({
      pagina, por_pagina: porPagina,
      sort_by: sortBy ?? undefined, sort_dir: sortDir,
      ...filtros,
    }).then((r) => {
      setData(r.registros);
      setTotal(r.total);
      setTotalPaginas(r.total_paginas);
    });
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, porPagina, sortBy, sortDir]);

  useEffect(() => {
    const t = setTimeout(() => { setPagina(1); cargar(); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(key); setSortDir('asc'); }
  };

  const handleAbrirPdf = async (id: number) => {
    setDescargando(id);
    try {
      await abrirDictamenPdf(id);
    } catch {
      alert('No se pudo generar el PDF del dictamen.');
    } finally {
      setDescargando(null);
    }
  };

  const inicio = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const fin = Math.min(pagina * porPagina, total);

  return (
    <div className="p-6">
      {/* Cabecera de controles */}
      <div className="flex justify-between items-center mb-4">
        {esAdmin ? (
          <button 
            onClick={() => setMostrarNuevo(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            + Nuevo Dictamen
          </button>
        ) : <div />}
        
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Mostrar</span>
          <select
            value={porPagina}
            onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
            className="border border-blue-200 rounded-md p-1.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>registros</span>
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="overflow-x-auto border border-blue-100 rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50/70 text-blue-900 uppercase text-xs">
            <tr>
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-3 cursor-pointer select-none hover:bg-blue-100/50 transition-colors" onClick={() => handleSort(c.key)}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <SortIcon active={sortBy === c.key} direction={sortDir} />
                  </span>
                </th>
              ))}
              {esAdmin && <th className="p-3">Acciones</th>}
            </tr>
            <tr className="bg-gray-50 border-t border-blue-100">
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-2">
                  <input
                    value={filtros[c.key] ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                    placeholder="Filtrar..."
                    className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </th>
              ))}
              {esAdmin && <th className="p-2"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {data.map((d) => (
              <tr key={d.id} className="hover:bg-blue-50/40 transition-colors align-top">
                <td className="p-3 font-medium text-gray-800">{d.folio_sistema}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleAbrirPdf(d.id)}
                    disabled={descargando === d.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs disabled:opacity-50 transition-colors shadow-sm inline-flex items-center gap-1"
                    title="Descargar / ver dictamen en PDF"
                  >
                    {descargando === d.id ? '...' : `⬇ ${d.folio_dictamen}`}
                  </button>
                </td>
                <td className="p-3 text-gray-700">{d.fecha_dictamen ?? '-'}</td>
                <td className="p-3 text-gray-700">{d.expediente ?? '-'}</td>
                <td className="p-3 text-gray-700">{d.area}</td>
                <td className="p-3 text-gray-700">{d.no_inventario ?? '-'}</td>
                {esAdmin && (
                  <td className="p-3">
                    <button 
                      onClick={() => setEditandoIdSolicitud(d.folio_sistema)} 
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded text-xs transition-colors font-medium shadow-sm"
                    >
                      ✏ Editar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
          Sin resultados encontrados.
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Mostrando registros del {inicio} al {fin} de un total de {total.toLocaleString()} registros</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setPagina((p) => Math.max(1, p - 1))} 
            disabled={pagina === 1} 
            className="px-3 py-1 border border-blue-200 rounded bg-white hover:bg-blue-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            Anterior
          </button>
          <span className="px-3 py-1 bg-blue-600 text-white font-medium rounded shadow-sm">{pagina}</span>
          <button 
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} 
            disabled={pagina === totalPaginas} 
            className="px-3 py-1 border border-blue-200 rounded bg-white hover:bg-blue-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modales */}
      {mostrarNuevo && (
        <NuevoDictamenModal onClose={() => setMostrarNuevo(false)} onCreado={cargar} />
      )}
      {editandoIdSolicitud !== null && (
        <EditarDictamenModal
          idSolicitud={editandoIdSolicitud}
          onClose={() => setEditandoIdSolicitud(null)}
          onActualizado={cargar}
        />
      )}
    </div>
  );
}