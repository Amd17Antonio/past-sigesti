import { useEffect, useState } from 'react';
import { getAsignables, asignarSolicitud } from '../../services/solicitudService';
import { useAuth } from '../../context/AuthContext';
import type { Asignable } from '../../types/User';

interface Props {
  solicitudId: number;
  onClose: () => void;
  onAsignado: () => void;
  titulo?: string;
}

export default function AsignarModal({ solicitudId, onClose, onAsignado, titulo }: Props) {
  const [opciones, setOpciones] = useState<Asignable[]>([]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const { user } = useAuth();
  const esAutoasignacion = user?.rol?.nombre === 'Soporte Técnico';

  useEffect(() => {
    getAsignables()
      .then((data) => {
        setOpciones(data);
        if (data.length === 1) setSeleccionado(data[0].id);
      })
      .catch(() => setError('No se pudo cargar el personal disponible'))
      .finally(() => setCargando(false));
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

  const tituloFinal = titulo ?? (esAutoasignacion ? 'Autoasignar' : 'Asignar');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-96 shadow-lg">
        <h2 className="font-bold text-lg mb-4">
          {tituloFinal} solicitud #{solicitudId}
        </h2>

        {cargando && <p className="text-gray-500">Cargando...</p>}

        {!cargando && opciones.length === 0 && !error && (
          <p className="text-gray-500">No tienes personal disponible para asignar.</p>
        )}

        {opciones.length > 0 && !esAutoasignacion && (
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

        {opciones.length > 0 && esAutoasignacion && (
          <p className="mb-4 text-gray-700">
            Se te asignará esta solicitud: <strong>{opciones[0].nombre}</strong>
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
          <button
            onClick={handleAsignar}
            disabled={!seleccionado || enviando}
            className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50"
          >
            {enviando ? 'Guardando...' : tituloFinal}
          </button>
        </div>
      </div>
    </div>
  );
}