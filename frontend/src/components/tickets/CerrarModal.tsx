import { useEffect, useState } from 'react';
import { getPoas, cerrarSolicitud } from '../../services/solicitudService';

interface Poa {
  id: number;
  poa: string;
}

interface Props {
  solicitudId: number;
  onClose: () => void;
  onCerrado: () => void;
}

export default function CerrarModal({ solicitudId, onClose, onCerrado }: Props) {
  const [poas, setPoas] = useState<Poa[]>([]);
  const [idPoa, setIdPoa] = useState<number | ''>('');
  const [numServicios, setNumServicios] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getPoas().then(setPoas).catch(() => {});
  }, []);

  const handleAceptar = async () => {
    if (!idPoa) {
      setError('Selecciona un POA');
      return;
    }
    if (numServicios < 0) {
      setError('El número de equipos o servicios no puede ser negativo');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await cerrarSolicitud(solicitudId, {
        id_poa: Number(idPoa),
        num_servicios: numServicios,
        observaciones: observaciones.trim() || undefined,
      });
      onCerrado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo cerrar la solicitud');
    } finally {
      setEnviando(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[420px] shadow-xl border border-gray-100">
        <h2 className="font-bold text-lg text-gray-800 mb-4">Cerrar servicio</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">POA:</label>
        <select
          value={idPoa}
          onChange={(e) => setIdPoa(e.target.value ? Number(e.target.value) : '')}
          className={inputClass}
        >
          <option value="">Seleccionar</option>
          {poas.map((p) => (
            <option key={p.id} value={p.id}>{p.poa}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Equipos o Servicios:</label>
        <input
          type="number"
          min={0}
          value={numServicios}
          onChange={(e) => setNumServicios(Math.max(0, Number(e.target.value)))}
          className={inputClass}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones"
          rows={3}
          className={`${inputClass} mb-2 resize-none`}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAceptar}
            disabled={enviando}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-50 transition-colors"
          >
            {enviando ? 'Cerrando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}