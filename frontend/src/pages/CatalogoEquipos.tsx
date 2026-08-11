import { useEffect, useState } from 'react';
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
    <div className="p-6">
      <div className="bg-blue-50 border px-4 py-2 font-semibold text-blue-900 rounded-t">
        Catálogo de equipos de cómputo
      </div>

      <div className="border-x px-3 py-2 flex gap-4 text-sm">
        <button onClick={() => setCreando(true)} className="text-green-700 flex items-center gap-1 hover:underline">
          ⊕ Nuevo Equipo
        </button>
        <button
          onClick={() => seleccionado && setEditando(true)}
          disabled={!seleccionado}
          className="text-blue-700 flex items-center gap-1 hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          ✏ Editar Equipo
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Extras | Dictámenes</th>
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-2 text-left cursor-pointer" onClick={() => handleSort(c.key)}>
                <span className="inline-flex items-center">
                  {c.label}
                  <SortIcon active={sortBy === c.key} direction={sortDir} />
                </span>
              </th>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <th></th>
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-1">
                <input
                  value={filtros[c.key] ?? ''}
                  onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                  className="border p-1 w-full text-xs font-normal"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr
              key={r.id}
              onClick={() => setSeleccionado(r)}
              className={`border-t cursor-pointer ${seleccionado?.id === r.id ? 'bg-blue-50' : ''}`}
            >
              <td className="p-2 flex items-center gap-15" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setExtrasId(r.id)} title="Extras" className="text-green-700 font-bold text-base">+</button>
                <button onClick={() => setDictamenesId(r.id)} title="Dictámenes">📄</button>
              </td>
              <td className="p-2">{r.tipo ?? '-'}</td>
              <td className="p-2">{r.marca ?? '-'}</td>
              <td className="p-2">{r.modelo ?? '-'}</td>
              <td className="p-2">{r.no_serie ?? '-'}</td>
              <td className="p-2">{r.no_inventario ?? '-'}</td>
              <td className="p-2 font-mono text-xs">{r.mac ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      <div className="flex justify-between items-center mt-3 text-sm">
        <div className="flex items-center gap-2">
          <select
            value={porPagina}
            onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
            className="border rounded p-1"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>Página {pagina} de {totalPaginas}</span>
          <button onClick={() => setPagina(1)} disabled={pagina === 1} className="px-2 py-1 border rounded disabled:opacity-40">⏮</button>
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-2 py-1 border rounded disabled:opacity-40">◀</button>
          <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-2 py-1 border rounded disabled:opacity-40">▶</button>
          <button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas} className="px-2 py-1 border rounded disabled:opacity-40">⏭</button>
          <button onClick={cargar} title="Recargar" className="px-2 py-1 border rounded">↻</button>
        </div>
        <span>Mostrando {inicio} a {fin} de {total} elementos</span>
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