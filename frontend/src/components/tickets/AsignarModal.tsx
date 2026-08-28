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
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl border border-gray-100">
        <h2 className="font-bold text-lg text-gray-800 mb-4">
          {tituloFinal} solicitud #{solicitudId}
        </h2>

        {cargando && <p className="text-gray-500 text-sm">Cargando...</p>}

        {!cargando && opciones.length === 0 && !error && (
          <p className="text-gray-500 text-sm">No tienes personal disponible para asignar.</p>
        )}

        {opciones.length > 0 && !esAutoasignacion && (
          <select
            value={seleccionado ?? ''}
            onChange={(e) => setSeleccionado(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
          >
            <option value="" disabled>Selecciona una persona</option>
            {opciones.map((op) => (
              <option key={op.id} value={op.id}>{op.nombre}</option>
            ))}
          </select>
        )}

        {opciones.length > 0 && esAutoasignacion && (
          <p className="mb-4 text-sm text-gray-700">
            Se te asignará esta solicitud: <strong className="text-gray-900">{opciones[0].nombre}</strong>
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAsignar}
            disabled={!seleccionado || enviando}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-50 transition-colors"
          >
            {enviando ? 'Guardando...' : tituloFinal}
          </button>
        </div>
      </div>
    </div>
  );
}