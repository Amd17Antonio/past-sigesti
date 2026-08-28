import { useEffect, useState } from 'react';
import { getPoaOptions, getActividades } from '../../services/reporteService';
import type { PoaOption, ActividadRow, ContadorDictamen } from '../../types/Reporte';

export default function Reportes() {
  const [poaOptions, setPoaOptions] = useState<PoaOption[]>([]);
  const [idPoa, setIdPoa] = useState<number | null>(null);
  const [del, setDel] = useState('');
  const [al, setAl] = useState('');

  const [data, setData] = useState<ActividadRow[]>([]);
  const [contador, setContador] = useState<ContadorDictamen | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [buscado, setBuscado] = useState(false);

  useEffect(() => {
    getPoaOptions().then((opts) => {
      setPoaOptions(opts);
      if (opts.length > 0) setIdPoa(opts[0].id);
    });
  }, []);

  const buscar = () => {
    getActividades({
      id_poa: idPoa ?? undefined,
      del: del || undefined,
      al: al || undefined,
      pagina,
      por_pagina: porPagina,
    }).then((r) => {
      setData(r.registros);
      setContador(r.contador);
      setTotal(r.total);
      setTotalPaginas(r.total_paginas);
      setBuscado(true);
    });
  };

  useEffect(() => {
    if (buscado) buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, porPagina]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white border border-blue-200 rounded-lg shadow-sm">
        <div className="px-5 py-3.5 border-b border-blue-200 font-bold text-white bg-blue-900 rounded-t-lg shadow-sm">
          Reporte de actividades
        </div>

        <div className="p-5 flex flex-wrap gap-4 items-end bg-blue-50/20 border-b border-blue-100">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Del:</label>
            <input
              type="date"
              value={del}
              onChange={(e) => setDel(e.target.value)}
              className="border border-blue-200 rounded p-2 block w-48 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Al:</label>
            <input
              type="date"
              value={al}
              onChange={(e) => setAl(e.target.value)}
              className="border border-blue-200 rounded p-2 block w-48 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-[300px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Programa Operativo Anual (POA)</label>
            <select
              value={idPoa ?? ''}
              onChange={(e) => setIdPoa(Number(e.target.value))}
              className="border border-blue-200 rounded p-2 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {poaOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.poa}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => { setPagina(1); buscar(); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition shadow-sm"
          >
            Buscar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-900 text-white uppercase text-xs border-b border-blue-800">
              <tr>
                <th className="p-3 font-semibold">No</th>
                <th className="p-3 font-semibold">Solicitud</th>
                <th className="p-3 font-semibold">Fecha</th>
                <th className="p-3 font-semibold">Servicio</th>
                <th className="p-3 font-semibold">Num. Servicios</th>
                <th className="p-3 font-semibold">POA</th>
                <th className="p-3 font-semibold">No. de Dictamen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 bg-white">
              {data.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-3 font-medium text-gray-800">{r.id}</td>
                  <td className="p-3 text-gray-600">{r.solicitante ?? '-'}</td>
                  <td className="p-3 text-gray-600">{r.fecha ? r.fecha.slice(0, 10) : '-'}</td>
                  <td className="p-3 text-gray-600">{r.servicio ?? '-'}</td>
                  <td className="p-3 text-gray-600">{r.num_servicios ?? '-'}</td>
                  <td className="p-3 text-gray-600">{r.poa ?? '-'}</td>
                  <td className="p-3 text-blue-900 font-medium">{r.no_dictamen ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {buscado && data.length === 0 && (
          <p className="text-center text-gray-500 py-8 text-sm">Sin registros que mostrar</p>
        )}

        <div className="flex justify-between items-center px-5 py-4 border-t border-blue-100 text-sm text-gray-600 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs">Por página:</span>
            <select
              value={porPagina}
              onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
              className="border border-blue-200 rounded p-1.5 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPagina(1)} disabled={pagina === 1} className="px-2.5 py-1 text-xs border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-40 transition shadow-sm">⏮</button>
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-2.5 py-1 text-xs border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-40 transition shadow-sm">◀</button>
            <span className="px-2 text-xs font-medium text-gray-700">Página {pagina} de {totalPaginas}</span>
            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-2.5 py-1 text-xs border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-40 transition shadow-sm">▶</button>
            <button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas} className="px-2.5 py-1 text-xs border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-40 transition shadow-sm">⏭</button>
          </div>
          <span className="text-xs font-medium text-gray-700">Se han encontrado {total} registros</span>
        </div>

        {contador && (
          <div className="px-5 pb-4 pt-3 flex gap-6 text-sm justify-end border-t border-blue-100 bg-blue-50/20 rounded-b-lg">
            <span className="text-green-700 font-medium text-xs">✔ {contador.con_dictamen} con número de dictamen</span>
            <span className="text-red-700 font-medium text-xs">✘ {contador.sin_dictamen} sin número de dictamen</span>
          </div>
        )}
      </div>
    </div>
  );
}