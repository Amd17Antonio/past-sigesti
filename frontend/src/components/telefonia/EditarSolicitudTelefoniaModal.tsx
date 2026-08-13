import { useState } from 'react';
import { actualizarSolicitudTelefonia } from '../../services/solicitudTelefoniaService';

interface Props {
  solicitud: { id: number; tramite: string; estatus: string };
  onClose: () => void;
  onActualizado: () => void;
}

export default function EditarSolicitudTelefoniaModal({ solicitud, onClose, onActualizado }: Props) {
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleGuardar = async () => {
    setEnviando(true);
    setError('');
    try {
      await actualizarSolicitudTelefonia(solicitud.id, { observaciones: observaciones || undefined });
      onActualizado();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo actualizar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-96 overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
          Editar solicitud #{solicitud.id} — {solicitud.tramite.replace(/_/g, ' ')}
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Agregar observación:</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3} className="border p-2 w-full mt-1" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm">Cancelar</button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50">
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}