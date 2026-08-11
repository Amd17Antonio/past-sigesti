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
      <div className="bg-white rounded shadow-lg w-[32rem] max-h-[85vh] overflow-y-auto">
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold">Dictámenes — Equipo #{equipoId}</div>

        <div className="p-4">
          {registros.length === 0 && <p className="text-gray-500 text-sm">Sin dictámenes registrados para este equipo.</p>}
          {registros.map((d) => (
            <div key={d.id} className="border rounded p-3 mb-2 text-sm">
              <p><strong>Folio:</strong> {d.folio}/{d.ejercicio}</p>
              <p><strong>Fecha:</strong> {d.fecha_dictamen ?? '-'}</p>
              <p><strong>Servicio:</strong> {d.servicio ?? '-'}</p>
              <p><strong>Dictamen:</strong> {d.dictamen ?? '-'}</p>
              {d.sugiere_baja == 1 && <p className="text-red-600 font-medium">⚠ Sugiere baja</p>}
            </div>
          ))}
        </div>

        <div className="flex justify-end px-4 py-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm">Cerrar</button>
        </div>
      </div>
    </div>
  );
}