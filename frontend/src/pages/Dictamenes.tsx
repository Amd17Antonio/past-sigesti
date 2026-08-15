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

  // Editar: ahora se identifica por folio_sistema (id_solicitud), no por el id del registro dictamen,
  // porque una solicitud puede tener varias capturas y siempre debe editarse la más reciente.
  const [editandoIdSolicitud, setEditandoIdSolicitud] = useState<number | null>(null);

  // Descarga del PDF (badge azul del Folio Dictamen)
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
      <div className="flex justify-between items-center mb-3">
        {esAdmin && (
          <button onClick={() => setMostrarNuevo(true)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            + Nuevo Dictamen
          </button>
        )}
        <div className="flex items-center gap-2 text-sm ml-auto">
          <span>Mostrar</span>
          <select
            value={porPagina}
            onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
            className="border rounded p-1"
          >
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
            {esAdmin && <th className="p-2 text-left">Acciones</th>}
          </tr>
          <tr className="bg-gray-50">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-1">
                <input
                  value={filtros[c.key] ?? ''}
                  onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                  className="border p-1 w-full text-xs font-normal"
                />
              </th>
            ))}
            {esAdmin && <th></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id} className="border-t align-top">
              <td className="p-2">{d.folio_sistema}</td>
              <td className="p-2">
                <button
                  onClick={() => handleAbrirPdf(d.id)}
                  disabled={descargando === d.id}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                  title="Descargar / ver dictamen en PDF"
                >
                  {descargando === d.id ? '...' : `⬇ ${d.folio_dictamen}`}
                </button>
              </td>
              <td className="p-2">{d.fecha_dictamen ?? '-'}</td>
              <td className="p-2">{d.expediente ?? '-'}</td>
              <td className="p-2">{d.area}</td>
              <td className="p-2">{d.no_inventario ?? '-'}</td>
              {esAdmin && (
                <td className="p-2">
                  <button onClick={() => setEditandoIdSolicitud(d.folio_sistema)} className="bg-orange-400 text-white px-3 py-1 rounded text-xs">
                    ✏ Editar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>Mostrando registros del {inicio} al {fin} de un total de {total.toLocaleString()} registros</span>
        <div className="flex gap-2">
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-3 py-1 border rounded disabled:opacity-40">Anterior</button>
          <span className="px-3 py-1 bg-purple-800 text-white rounded">{pagina}</span>
          <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-3 py-1 border rounded disabled:opacity-40">Siguiente</button>
        </div>
      </div>

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