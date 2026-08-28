import { useEffect, useState } from 'react';
import { getPoas, cerrarSolicitud, type Poa } from '../../services/solicitudService';

interface Props {
  solicitudId: number;
  onClose: () => void;
  onCerrado: () => void;
}

export default function CerrarModal({ solicitudId, onClose, onCerrado }: Props) {
  const [poas, setPoas] = useState<Poa[]>([]);
  const [idPoa, setIdPoa] = useState('');
  const [numServicios, setNumServicios] = useState('1');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getPoas().then(setPoas);
  }, []);

  const handleAceptar = async () => {
    if (!idPoa) {
      setError('Selecciona un POA.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await cerrarSolicitud(solicitudId, {
        id_poa: Number(idPoa),
        num_servicios: Number(numServicios) || 0,
        observaciones: observaciones || undefined,
      });
      onCerrado();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo cerrar el servicio.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-blue-100 my-8">
        <h2 className="text-lg font-bold text-blue-950 mb-4 border-b border-blue-100 pb-2">
          Cerrar servicio
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">POA:</label>
            <select
              value={idPoa}
              onChange={(e) => setIdPoa(e.target.value)}
              className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">-- Seleccionar --</option>
              {poas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.poa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Número de Equipos o Servicios:</label>
            <input
              type="number"
              min={0}
              value={numServicios}
              onChange={(e) => setNumServicios(e.target.value)}
              className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Observaciones (opcional):</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Escribe las observaciones..."
              className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3 font-semibold bg-red-50 p-2 rounded border border-red-100">{error}</p>}

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-blue-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleAceptar}
            disabled={guardando}
            className="px-4 py-2 text-sm font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
          >
            {guardando ? 'Guardando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}