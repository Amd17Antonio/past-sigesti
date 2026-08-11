import { useEffect, useState } from 'react';
import { getResumenEncuesta, type ResumenEncuesta } from '../../services/encuestaService';

export default function Metas() {
  const [del, setDel] = useState('');
  const [al, setAl] = useState('');
  const [data, setData] = useState<ResumenEncuesta | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = () => {
    setCargando(true);
    getResumenEncuesta({ del: del || undefined, al: al || undefined })
      .then(setData)
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = data ? data.buenas + data.regulares + data.malas : 0;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const barras = data ? [
    { label: 'Bueno', valor: data.buenas, color: 'bg-green-600' },
    { label: 'Regular', valor: data.regulares, color: 'bg-yellow-500' },
    { label: 'Malo', valor: data.malas, color: 'bg-red-600' },
  ] : [];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Metas — Evaluación del servicio</h1>

      <div className="flex flex-wrap items-end gap-3 mb-6 bg-gray-50 border rounded p-4">
        <div>
          <label className="block text-xs font-medium mb-1">Del:</label>
          <input type="date" value={del} onChange={(e) => setDel(e.target.value)} className="border rounded p-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Al:</label>
          <input type="date" value={al} onChange={(e) => setAl(e.target.value)} className="border rounded p-1.5 text-sm" />
        </div>
        <button onClick={cargar} className="bg-purple-800 text-white px-4 py-1.5 rounded text-sm">
          Filtrar
        </button>
        {(del || al) && (
          <button
            onClick={() => { setDel(''); setAl(''); setTimeout(cargar, 0); }}
            className="text-sm text-gray-500 underline"
          >
            Limpiar
          </button>
        )}
      </div>

      {cargando && <p className="text-gray-500 text-sm">Cargando...</p>}

      {!cargando && data && (
        <>
          <div className="bg-white border rounded p-5 mb-6">
            <p className="text-sm text-gray-500 mb-4">Total de respuestas: {total}</p>
            <div className="space-y-3">
              {barras.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{b.label}</span>
                    <span>{b.valor} ({pct(b.valor)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                    <div
                      className={`h-4 ${b.color} transition-all`}
                      style={{ width: `${pct(b.valor)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {total === 0 && <p className="text-sm text-gray-400 mt-3">Sin evaluaciones en este rango.</p>}
          </div>

          <div className="bg-white border rounded p-5">
            <h2 className="font-semibold mb-3">Observaciones recibidas</h2>
            {data.observaciones.length === 0 && (
              <p className="text-sm text-gray-400">No hay observaciones en este rango.</p>
            )}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.observaciones.map((o, i) => (
                <div key={i} className="border-b pb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Folio {o.id_solicitud} — {o.solicitante ?? 'N/A'}</span>
                    <span>{o.fecha}</span>
                  </div>
                  <p className="text-sm">{o.observaciones}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}