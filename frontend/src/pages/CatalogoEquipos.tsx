import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEquipos, eliminarEquipo, type EquipoRow } from '../services/equipoService';
import SortIcon from '../components/common/SortIcon';
import EquipoFormModal from '../components/inventario/EquipoFormModal';
import ExtrasEquipoModal from '../components/inventario/ExtrasEquipoModal';
import DictamenesEquipoModal from '../components/inventario/DictamenesEquipoModal';

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'marca', label: 'Marca' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'no_serie', label: 'No. Serie' },
  { key: 'no_inventario', label: 'No. Inventario' },
  { key: 'mac', label: 'Mac' },
];

export default function CatalogoEquipos() {
  const navigate = useNavigate();
  const [data, setData] = useState<EquipoRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [seleccionado, setSeleccionado] = useState<EquipoRow | null>(null);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [softwareId, setSoftwareId] = useState<number | null>(null);
  const [extrasId, setExtrasId] = useState<number | null>(null);
  const [dictamenesId, setDictamenesId] = useState<number | null>(null);

  const cargar = () => {
    getEquipos({
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

  const inicio = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const fin = Math.min(pagina * porPagina, total);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/catalogos/grupo/equipo-computo')}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-1.5 rounded shadow-sm mb-4 transition-colors flex items-center gap-1.5 w-fit"
      >
        <span>←</span> Regresar
      </button>

      <div className="bg-blue-900 text-white px-4 py-3 font-bold rounded-t-lg shadow-sm">
        Catálogo de equipos de cómputo
      </div>

      <div className="border-x border-blue-100 bg-white px-4 py-2.5 flex gap-4 text-sm shadow-sm">
        <button onClick={() => setCreando(true)} className="text-emerald-700 font-medium flex items-center gap-1 hover:text-emerald-800 transition-colors">
          <span>⊕</span> Nuevo Equipo
        </button>
        <button
          onClick={() => seleccionado && setEditando(true)}
          disabled={!seleccionado}
          className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <span>✏</span> Editar Equipo
        </button>
      </div>

      <div className="overflow-x-auto border border-blue-100 rounded-b-lg shadow-sm bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white uppercase text-xs border-b border-blue-800">
              <th className="p-3 font-semibold text-center w-28">Extras | Dict.</th>
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-3 font-semibold cursor-pointer hover:bg-blue-800 transition-colors" onClick={() => handleSort(c.key)}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <SortIcon active={sortBy === c.key} direction={sortDir} />
                  </span>
                </th>
              ))}
            </tr>
            <tr className="bg-blue-50/70 border-b border-blue-100">
              <th className="p-2"></th>
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-2">
                  <input
                    value={filtros[c.key] ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                    placeholder="Filtrar..."
                    className="border border-blue-200 rounded p-1.5 w-full text-xs font-normal bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSeleccionado(r)}
                className={`cursor-pointer transition-colors align-top ${seleccionado?.id === r.id ? 'bg-blue-50/70 font-medium' : 'hover:bg-blue-50/30'}`}
              >
                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => setExtrasId(r.id)} title="Extras" className="text-emerald-600 hover:text-emerald-800 font-bold text-base transition-colors">+</button>
                    <button onClick={() => setDictamenesId(r.id)} title="Dictámenes" className="hover:scale-110 transition-transform">📄</button>
                  </div>
                </td>
                <td className="p-3 text-gray-800">{r.tipo ?? '-'}</td>
                <td className="p-3 text-gray-800">{r.marca ?? '-'}</td>
                <td className="p-3 text-gray-800">{r.modelo ?? '-'}</td>
                <td className="p-3 text-gray-800">{r.no_serie ?? '-'}</td>
                <td className="p-3 text-gray-800">{r.no_inventario ?? '-'}</td>
                <td className="p-3 font-mono text-xs text-gray-700">{r.mac ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && <p className="text-gray-500 text-sm mt-4 text-center py-4 bg-white border border-blue-100 rounded-lg shadow-sm">Sin resultados</p>}

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <select
            value={porPagina}
            onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
            className="border border-blue-200 rounded p-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-sm"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs">Página {pagina} de {totalPaginas}</span>
          <button onClick={() => setPagina(1)} disabled={pagina === 1} className="px-2.5 py-1 border border-blue-200 bg-white rounded disabled:opacity-40 hover:bg-blue-50 transition-colors shadow-sm">⏮</button>
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-2.5 py-1 border border-blue-200 bg-white rounded disabled:opacity-40 hover:bg-blue-50 transition-colors shadow-sm">◀</button>
          <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-2.5 py-1 border border-blue-200 bg-white rounded disabled:opacity-40 hover:bg-blue-50 transition-colors shadow-sm">▶</button>
          <button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas} className="px-2.5 py-1 border border-blue-200 bg-white rounded disabled:opacity-40 hover:bg-blue-50 transition-colors shadow-sm">⏭</button>
          <button onClick={cargar} title="Recargar" className="px-2.5 py-1 border border-blue-200 bg-white rounded hover:bg-blue-50 transition-colors shadow-sm">↻</button>
        </div>
        <span className="text-xs font-medium text-gray-700">Mostrando {inicio} a {fin} de {total} elementos</span>
      </div>

      {creando && (
        <EquipoFormModal equipo={null} onClose={() => setCreando(false)} onGuardado={cargar} />
      )}
      {editando && seleccionado && (
        <EquipoFormModal
          equipo={seleccionado}
          onClose={() => setEditando(false)}
          onGuardado={() => { cargar(); setSeleccionado(null); }}
        />
      )}
      {extrasId !== null && (
        <ExtrasEquipoModal equipoId={extrasId} onClose={() => setExtrasId(null)} />
      )}
      {dictamenesId !== null && (
        <DictamenesEquipoModal equipoId={dictamenesId} onClose={() => setDictamenesId(null)} />
      )}
    </div>
  );
}