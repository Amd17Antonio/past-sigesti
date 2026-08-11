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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Cerrar servicio</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">POA:</label>
            <select value={idPoa} onChange={(e) => setIdPoa(e.target.value)} className="border rounded w-full p-2 text-sm">
              <option value="">Seleccionar</option>
              {poas.map((p) => <option key={p.id} value={p.id}>{p.poa}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número de Equipos o Servicios:</label>
            <input
              type="number"
              min={0}
              value={numServicios}
              onChange={(e) => setNumServicios(e.target.value)}
              className="border rounded w-full p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              placeholder="Observaciones"
              className="border rounded w-full p-2 text-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button
            onClick={handleAceptar}
            disabled={guardando}
            className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}