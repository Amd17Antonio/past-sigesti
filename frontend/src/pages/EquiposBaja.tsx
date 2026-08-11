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

  useEffect(() => { cargar(); // eslint-disable-next-line
  }, [pagina, porPagina, sortBy, sortDir]);

  useEffect(() => {
    const t = setTimeout(() => { setPagina(1); cargar(); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
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
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">Equipos sugeridos para baja</h1>
        <button
          onClick={handleExportar}
          disabled={exportando}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          📊 {exportando ? 'Exportando...' : 'Exportar a Excel'}
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-2 text-left cursor-pointer" onClick={() => handleSort(c.key)}>
                <span className="inline-flex items-center">{c.label}<SortIcon active={sortBy === c.key} direction={sortDir} /></span>
              </th>
            ))}
            <th className="p-2 text-left">Dictamen</th>
          </tr>
          <tr className="bg-gray-50">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-1">
                {c.key !== 'no_dictamen' && (
                  <input
                    value={filtros[c.key] ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                    className="border p-1 w-full text-xs font-normal"
                  />
                )}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id_dictamen} className="border-t align-top">
              <td className="p-2">{r.no_dictamen}</td>
              <td className="p-2">{r.solicitante}</td>
              <td className="p-2">{r.area}</td>
              <td className="p-2">{r.tipo ?? '-'}</td>
              <td className="p-2">{r.marca ?? '-'}</td>
              <td className="p-2">{r.no_inventario ?? '-'}</td>
              <td className="p-2 max-w-xs text-xs">{r.dictamen}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <p className="text-gray-500 mt-4">Sin equipos sugeridos para baja.</p>}

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center gap-2">
          <select value={porPagina} onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }} className="border rounded p-1">
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>Página {pagina} de {totalPaginas}</span>
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-2 py-1 border rounded disabled:opacity-40">◀</button>
          <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-2 py-1 border rounded disabled:opacity-40">▶</button>
        </div>
        <span>Mostrando {inicio} a {fin} de {total} elementos</span>
      </div>
    </div>
  );
}