import { useEffect, useState } from 'react';
import { getEquiposBaja, exportarEquiposBaja, type EquipoBajaRow } from '../services/equipoBajaService';
import SortIcon from '../components/common/SortIcon';

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'no_dictamen', label: 'No. Dictamen' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'area', label: 'Área' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'marca', label: 'Marca' },
  { key: 'no_inventario', label: 'No. Inventario' },
];

export default function EquiposBaja() {
  const [data, setData] = useState<EquipoBajaRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [exportando, setExportando] = useState(false);

  const cargar = () => {
    getEquiposBaja({
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

  const handleExportar = async () => {
    setExportando(true);
    try {
      await exportarEquiposBaja(filtros);
    } finally {
      setExportando(false);
    }
  };

  const inicio = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const fin = Math.min(pagina * porPagina, total);

  return (
    <div className="p-6">
      {/* Cabecera de la vista */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Equipos sugeridos para baja</h1>
        <button
          onClick={handleExportar}
          disabled={exportando}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-colors shadow-sm inline-flex items-center gap-2"
        >
          📊 {exportando ? 'Exportando...' : 'Exportar a Excel'}
        </button>
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
              <th className="p-3">Dictamen</th>
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
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {data.map((r) => (
              <tr key={r.id_dictamen} className="hover:bg-blue-50/40 transition-colors align-top">
                <td className="p-3 font-medium text-gray-800">{r.no_dictamen}</td>
                <td className="p-3 text-gray-700">{r.solicitante}</td>
                <td className="p-3 text-gray-700">{r.area}</td>
                <td className="p-3 text-gray-700">{r.tipo ?? '-'}</td>
                <td className="p-3 text-gray-700">{r.marca ?? '-'}</td>
                <td className="p-3 text-gray-700">{r.no_inventario ?? '-'}</td>
                <td className="p-3 text-xs text-gray-600 max-w-xs">{r.dictamen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
          Sin equipos sugeridos para baja.
        </div>
      )}

      {/* Paginación y Controles Inferiores */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <select 
            value={porPagina} 
            onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }} 
            className="border border-blue-200 rounded-md p-1.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>Página {pagina} de {totalPaginas}</span>
          <div className="flex gap-1 ml-2">
            <button 
              onClick={() => setPagina((p) => Math.max(1, p - 1))} 
              disabled={pagina === 1} 
              className="px-2.5 py-1 border border-blue-200 rounded bg-white hover:bg-blue-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              ◀
            </button>
            <button 
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} 
              disabled={pagina === totalPaginas} 
              className="px-2.5 py-1 border border-blue-200 rounded bg-white hover:bg-blue-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              ▶
            </button>
          </div>
        </div>
        <span>Mostrando {inicio} a {fin} de {total} elementos</span>
      </div>
    </div>
  );
}