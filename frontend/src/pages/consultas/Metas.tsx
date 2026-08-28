import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResumenEncuesta, type ResumenEncuesta } from '../../services/encuestaService';

export default function Metas() {
  const navigate = useNavigate();
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-blue-950">Metas — Evaluación del servicio</h1>

        <button
          onClick={() => navigate('/catalogos/preguntas')}
          className="bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-lg px-4 py-2 text-left shadow-sm transition-colors flex items-center gap-3"
        >
          <span className="text-xl">📝</span>
          <span className="font-medium text-gray-800 text-sm">Preguntas (Encuesta)</span>
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-6 bg-blue-50/20 border border-blue-200 rounded-lg p-4 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Del:</label>
          <input
            type="date"
            value={del}
            onChange={(e) => setDel(e.target.value)}
            className="border border-blue-200 rounded p-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Al:</label>
          <input
            type="date"
            value={al}
            onChange={(e) => setAl(e.target.value)}
            className="border border-blue-200 rounded p-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <button
          onClick={cargar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition shadow-sm"
        >
          Filtrar
        </button>
        {(del || al) && (
          <button
            onClick={() => { setDel(''); setAl(''); setTimeout(cargar, 0); }}
            className="text-sm text-gray-500 hover:text-gray-700 underline pb-1"
          >
            Limpiar
          </button>
        )}
      </div>

      {cargando && <p className="text-gray-500 text-sm">Cargando...</p>}

      {!cargando && data && (
        <>
          <div className="bg-white border border-blue-200 rounded-lg p-5 mb-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-950 mb-4">Total de respuestas: {total}</p>
            <div className="space-y-3">
              {barras.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{b.label}</span>
                    <span className="text-gray-600">{b.valor} ({pct(b.valor)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200">
                    <div
                      className={`h-4 ${b.color} transition-all rounded-full`}
                      style={{ width: `${pct(b.valor)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {total === 0 && <p className="text-sm text-gray-400 mt-3">Sin evaluaciones en este rango.</p>}
          </div>

          <div className="bg-white border border-blue-200 rounded-lg p-5 shadow-sm">
            <h2 className="font-semibold text-blue-950 mb-3 text-base">Observaciones recibidas</h2>
            {data.observaciones.length === 0 && (
              <p className="text-sm text-gray-400">No hay observaciones en este rango.</p>
            )}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {data.observaciones.map((o, i) => (
                <div key={i} className="border-b border-blue-100 pb-3 last:border-b-0">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="font-medium text-blue-900">Folio {o.id_solicitud} — {o.solicitante ?? 'N/A'}</span>
                    <span>{o.fecha}</span>
                  </div>
                  <p className="text-sm text-gray-700">{o.observaciones}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}