import { useEffect, useState } from 'react';
import DashboardChart from '../components/reportes/DashboardChart';
import {
  getDashboardTickets, getDashboardDictamenes, getDashboardActividades,
  type TicketsResumen, type DictamenesResumen, type ActividadesMesAnterior,
} from '../services/dashboardService';

const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

function Tarjeta({ label, valor, color }: { label: string; valor: number; color: string }) {
  return (
    <div className={`${color} text-white rounded-md px-3 py-2 flex-1 min-w-[120px] shadow-sm`}>
      <p className="text-[11px] font-medium opacity-90 leading-tight">{label}</p>
      <p className="text-lg font-bold leading-tight">{valor}</p>
    </div>
  );
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<TicketsResumen | null>(null);
  const [dictamenes, setDictamenes] = useState<DictamenesResumen | null>(null);
  const [actividades, setActividades] = useState<ActividadesMesAnterior | null>(null);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const cargar = () => {
    const params = desde && hasta ? { desde, hasta } : {};
    getDashboardTickets(params).then(setTickets);
    getDashboardDictamenes(params).then(setDictamenes);
  };

  useEffect(() => {
    cargar();
    getDashboardActividades().then(setActividades);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-4 space-y-4 text-xs max-w-6xl mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
        <p className="text-[11px] text-gray-500">Tickets y dictámenes del período</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-700">Período:</span>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="border border-blue-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm" />
        <span className="text-gray-700">a</span>
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="border border-blue-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm" />
        <button onClick={cargar} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition shadow-sm font-medium">Consultar</button>
      </div>

      {/* ---- Tarjetas de resumen de Tickets ---- */}
      <section>
        <h2 className="text-sm font-semibold mb-1.5 text-gray-800">Tickets</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          <Tarjeta label="Tickets creados" valor={tickets?.creados ?? 0} color="bg-blue-600" />
          <Tarjeta label="Tickets asignados" valor={tickets?.asignados ?? 0} color="bg-amber-500" />
          <Tarjeta label="Tickets concluidos" valor={tickets?.concluidos ?? 0} color="bg-emerald-600" />
          <Tarjeta label="Asignados sin atender" valor={tickets?.asignados_sin_atender ?? 0} color="bg-rose-600" />
        </div>

        {/* ---- Gráfica Tickets | Gráfica Dictámenes | Técnico top: mismas dimensiones, misma fila ---- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white border border-blue-100 rounded-md p-2 shadow-sm">
            <p className="font-medium mb-1 text-gray-700">Tickets resueltos en el ejercicio {tickets?.anio}</p>
            {tickets && <DashboardChart values={tickets.serie_mensual} labels={MESES} color="#2563eb" />}
          </div>

          <div className="bg-white border border-blue-100 rounded-md p-2 shadow-sm">
            <p className="font-medium mb-1 text-gray-700">Dictámenes generados en el ejercicio {dictamenes?.anio}</p>
            {dictamenes && <DashboardChart values={dictamenes.serie_mensual} labels={MESES} color="#059669" />}
          </div>

          <div className="bg-white border border-blue-100 rounded-md p-2 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="font-medium mb-1 text-gray-700">Técnico con más tickets concluidos</p>
            <p className="text-sm font-semibold text-gray-800">{tickets?.top_tecnico?.nombre ?? 'Sin datos'}</p>
            {tickets?.top_tecnico && <p className="text-[11px] text-gray-500">{tickets.top_tecnico.total} tickets concluidos</p>}
          </div>
        </div>
      </section>

      {/* ---- REPORTE DE ACTIVIDADES DEL MES ANTERIOR (basado en POA) ---- */}
      <section>
        <h2 className="text-sm font-semibold mb-1.5 text-gray-800">
          Reporte de actividades {actividades?.mes ? `de ${actividades.mes}` : 'del mes anterior'}
        </h2>
        {actividades && actividades.registros.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
            {actividades.registros.map((r) => (
              <div
                key={r.poa}
                className="snap-start shrink-0 basis-[180px] bg-white border border-blue-100 rounded-md px-2 py-1 text-center shadow-sm"
              >
                <p className="text-[9px] text-gray-600 leading-tight">{r.poa}</p>
                <p className="text-sm font-bold text-blue-600 mt-0.5">{r.total}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Sin actividades registradas el mes anterior.</p>
        )}
      </section>
    </div>
  );
}