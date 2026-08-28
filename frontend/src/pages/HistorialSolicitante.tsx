import { useEffect, useState } from 'react';
import { getHistorial } from '../services/solicitudService';
import HistorialTable, { type HistorialItem } from '../components/historial/HistorialTable';
import EvaluarModal from '../components/tickets/EvaluarModal';

interface HistorialItemConEvaluacion extends HistorialItem {
  evaluada?: boolean;
}

export default function HistorialSolicitante() {
  const [datos, setDatos] = useState<HistorialItemConEvaluacion[]>([]);
  const [evaluarId, setEvaluarId] = useState<number | null>(null);

  const cargar = () => {
    getHistorial().then(setDatos);
  };

  useEffect(() => {
    cargar();
  }, []);

  const marcarComoEvaluada = (id: number) => {
    setDatos((prev) => prev.map((d) => (d.id === id ? { ...d, evaluada: true } : d)));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Mis Solicitudes Finalizadas</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
        <HistorialTable
          data={datos}
          labelAcciones="Evaluar"
          renderAcciones={(item: HistorialItemConEvaluacion) =>
            item.evaluada ? (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 border border-gray-200 rounded text-xs font-medium inline-block">
                Evaluada
              </span>
            ) : (
              <button
                onClick={() => setEvaluarId(item.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-sm"
              >
                Evaluar
              </button>
            )
          }
        />
      </div>

      {evaluarId !== null && (() => {
        const idActual = evaluarId;
        return (
          <EvaluarModal
            solicitudId={idActual}
            onClose={() => setEvaluarId(null)}
            onEvaluado={() => {
              marcarComoEvaluada(idActual);
              cargar();
            }}
          />
        );
      })()}
    </div>
  );
}