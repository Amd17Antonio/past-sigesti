import { useState } from 'react';
import { agregarSeguimiento } from '../../services/solicitudService';

interface Props {
  solicitudId: number;
  onClose: () => void;
  onGuardado: () => void;
}

export default function SeguimientoModal({ solicitudId, onClose, onGuardado }: Props) {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleAceptar = async () => {
    if (!texto.trim()) {
      setError('Escribe una nota de seguimiento');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await agregarSeguimiento(solicitudId, texto.trim());
      onGuardado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo guardar el seguimiento');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[420px] shadow-lg">
        <h2 className="font-bold text-lg mb-4">Servicio Técnico</h2>

        <label className="block text-sm font-medium mb-1">Seguimiento</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Seguimiento"
          rows={4}
          className="border p-2 w-full mb-2 rounded"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
          <button
            onClick={handleAceptar}
            disabled={enviando}
            className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50"
          >
            {enviando ? 'Guardando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}