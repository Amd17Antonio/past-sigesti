import { useEffect, useState } from 'react';
import { getAsignables, asignarSolicitud } from '../../services/solicitudService';

interface Asignable {
  id: number;
  nombre: string;
}

interface Props {
  solicitudId: number;
  onClose: () => void;
  onAsignado: () => void;
}

export default function AsignarModal({ solicitudId, onClose, onAsignado }: Props) {
  const [opciones, setOpciones] = useState<Asignable[]>([]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getAsignables().then((data) => {
      setOpciones(data);
      if (data.length === 1) setSeleccionado(data[0].id); // Soporte Técnico: autoselección
    });
  }, []);

  const handleAsignar = async () => {
    if (!seleccionado) return;
    setEnviando(true);
    setError('');
    try {
      await asignarSolicitud(solicitudId, seleccionado);
      onAsignado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo asignar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 border border-blue-100 my-8">
        <h2 className="text-lg font-bold text-blue-950 mb-4 border-b border-blue-100 pb-2">
          Asignar solicitud #{solicitudId}
        </h2>

        {opciones.length === 0 && (
          <p className="text-gray-500 text-sm mb-4 text-center py-2">No tienes personal disponible para asignar.</p>
        )}

        {opciones.length > 0 && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Técnico o personal:</label>
            <select
              value={seleccionado ?? ''}
              onChange={(e) => setSeleccionado(Number(e.target.value))}
              className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="" disabled>Selecciona una persona</option>
              {opciones.map((op) => (
                <option key={op.id} value={op.id}>{op.nombre}</option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-3 font-semibold bg-red-50 p-2 rounded border border-red-100">{error}</p>}

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-blue-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleAsignar}
            disabled={!seleccionado || enviando}
            className="px-4 py-2 text-sm font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
          >
            {enviando ? 'Asignando...' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  );
}