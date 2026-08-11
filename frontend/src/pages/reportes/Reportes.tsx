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
    <div className="p-6">
      <div className="bg-white border rounded shadow-sm">
        <div className="px-4 py-3 border-b font-semibold text-gray-700">Reporte de actividades</div>

        <div className="p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm text-gray-600">Del:</label>
            <input type="date" value={del} onChange={(e) => setDel(e.target.value)} className="border rounded p-2 block w-48" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Al:</label>
            <input type="date" value={al} onChange={(e) => setAl(e.target.value)} className="border rounded p-2 block w-48" />
          </div>
          <div className="flex-1 min-w-[300px]">
            <select
              value={idPoa ?? ''}
              onChange={(e) => setIdPoa(Number(e.target.value))}
              className="border rounded p-2 w-full"
            >
              {poaOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.poa}</option>
              ))}
            </select>
          </div>
          <button onClick={() => { setPagina(1); buscar(); }} className="bg-purple-800 text-white px-5 py-2 rounded text-sm">
            Buscar
          </button>
        </div>

        {contador && (
          <div className="px-4 pb-2 flex gap-4 text-sm">
            <span className="text-green-700 font-medium">✔ {contador.con_dictamen} con número de dictamen</span>
            <span className="text-red-700 font-medium">✘ {contador.sin_dictamen} sin número de dictamen</span>
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">No</th>
              <th className="p-2">Solicitud</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Servicio</th>
              <th className="p-2">Num. Servicios</th>
              <th className="p-2">POA</th>
              <th className="p-2">No. de Dictamen</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.solicitante ?? '-'}</td>
                <td className="p-2">{r.fecha ? r.fecha.slice(0, 10) : '-'}</td>
                <td className="p-2">{r.servicio ?? '-'}</td>
                <td className="p-2">{r.num_servicios ?? '-'}</td>
                <td className="p-2">{r.poa ?? '-'}</td>
                <td className="p-2">{r.no_dictamen ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {buscado && data.length === 0 && (
          <p className="text-center text-gray-500 py-6">Sin registros que mostrar</p>
        )}

        <div className="flex justify-between items-center px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span>Por página:</span>
            <select value={porPagina} onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }} className="border rounded p-1">
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPagina(1)} disabled={pagina === 1} className="px-2 py-1 border rounded disabled:opacity-40">⏮</button>
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-2 py-1 border rounded disabled:opacity-40">◀</button>
            <span>Páginas {pagina} / {totalPaginas}</span>
            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-2 py-1 border rounded disabled:opacity-40">▶</button>
            <button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas} className="px-2 py-1 border rounded disabled:opacity-40">⏭</button>
          </div>
          <span>Se han encontrado {total} registros</span>
        </div>
      </div>
    </div>
  );
}