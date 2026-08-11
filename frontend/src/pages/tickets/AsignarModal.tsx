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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-96 shadow-lg">
        <h2 className="font-bold text-lg mb-4">Asignar solicitud #{solicitudId}</h2>

        {opciones.length === 0 && (
          <p className="text-gray-500">No tienes personal disponible para asignar.</p>
        )}

        {opciones.length > 0 && (
          <select
            value={seleccionado ?? ''}
            onChange={(e) => setSeleccionado(Number(e.target.value))}
            className="border p-2 w-full mb-4"
          >
            <option value="" disabled>Selecciona una persona</option>
            {opciones.map((op) => (
              <option key={op.id} value={op.id}>{op.nombre}</option>
            ))}
          </select>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
          <button
            onClick={handleAsignar}
            disabled={!seleccionado || enviando}
            className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50"
          >
            {enviando ? 'Asignando...' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  );
}