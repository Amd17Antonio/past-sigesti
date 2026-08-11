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
    getPoas().then(setPoas);
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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-[420px] shadow-lg">
        <h2 className="font-bold text-lg mb-4">Cerrar servicio</h2>

        <label className="block text-sm font-medium mb-1">POA :</label>
        <select
          value={idPoa}
          onChange={(e) => setIdPoa(e.target.value ? Number(e.target.value) : '')}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="">Seleccionar</option>
          {poas.map((p) => (
            <option key={p.id} value={p.id}>{p.poa}</option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">Número de Equipos o Servicios:</label>
        <input
          type="number"
          min={0}
          value={numServicios}
          onChange={(e) => setNumServicios(Math.max(0, Number(e.target.value)))}
          className="border p-2 w-full mb-4 rounded"
        />

        <label className="block text-sm font-medium mb-1">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones"
          rows={3}
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
            {enviando ? 'Cerrando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}