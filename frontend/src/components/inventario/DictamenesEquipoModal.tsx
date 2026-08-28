import { useEffect, useState } from 'react';
import { getDictamenesEquipo } from '../../services/equipoService';

interface Props {
  equipoId: number;
  onClose: () => void;
}

export default function DictamenesEquipoModal({ equipoId, onClose }: Props) {
  const [registros, setRegistros] = useState<any[]>([]);

  useEffect(() => {
    getDictamenesEquipo(equipoId).then(setRegistros);
  }, [equipoId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[32rem] max-h-[85vh] overflow-hidden flex flex-col border border-blue-100">
        {/* Encabezado con el azul institucional */}
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold flex justify-between items-center">
          <span>Dictámenes — Equipo #{equipoId}</span>
          <button 
            onClick={onClose} 
            className="text-blue-100 hover:text-white transition-colors text-lg font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {registros.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-6">
              Sin dictámenes registrados para este equipo.
            </p>
          )}

          {registros.map((d) => (
            <div 
              key={d.id} 
              className="bg-blue-50/40 border border-blue-100 rounded-lg p-3 text-sm space-y-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-900">
                  Folio: {d.folio}/{d.ejercicio}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {d.fecha_dictamen ?? '-'}
                </span>
              </div>
              <p className="text-gray-700"><strong>Servicio:</strong> {d.servicio ?? '-'}</p>
              <p className="text-gray-700"><strong>Dictamen:</strong> {d.dictamen ?? '-'}</p>
              
              {d.sugiere_baja == 1 && (
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 rounded text-red-600 text-xs font-semibold">
                  <span>⚠</span> Sugiere baja
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pie de página con el botón en azul */}
        <div className="flex justify-end px-4 py-3 bg-gray-50 border-t">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}