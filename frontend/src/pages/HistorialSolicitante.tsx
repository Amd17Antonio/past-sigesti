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
      <h1 className="text-xl font-bold mb-4">Mis Solicitudes Finalizadas</h1>
      <HistorialTable
        data={datos}
        labelAcciones="Evaluar"
        renderAcciones={(item: HistorialItemConEvaluacion) =>
          item.evaluada ? (
            <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs">
              Evaluada
            </span>
          ) : (
            <button
              onClick={() => setEvaluarId(item.id)}
              className="px-2 py-1 bg-green-700 text-white rounded text-xs"
            >
              Evaluar
            </button>
          )
        }
      />

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