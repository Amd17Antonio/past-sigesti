import { useEffect, useState } from 'react';
import { agregarSeguimiento } from '../../services/solicitudService';
import { getSolicitudUieDetalle } from '../../services/solicitudUieService';

interface Props {
  solicitudId: number;
  onClose: () => void;
  onGuardado: () => void;
}

interface EntradaSeguimiento {
  fecha: string;
  usuario: string;
  texto: string;
}

function parsearSeguimiento(texto: string | null): EntradaSeguimiento[] {
  if (!texto) return [];
  return texto
    .split('\n')
    .filter((linea) => linea.trim() !== '')
    .map((linea) => {
      const match = linea.match(/^\[(.+?) - (.+?)\]\s*(.*)$/);
      if (match) {
        return { fecha: match[1], usuario: match[2], texto: match[3] };
      }
      return { fecha: '', usuario: '', texto: linea };
    })
    .reverse(); // más reciente primero
}

export default function SeguimientoModal({ solicitudId, onClose, onGuardado }: Props) {
  const [historial, setHistorial] = useState<EntradaSeguimiento[]>([]);
  const [nuevo, setNuevo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargarHistorial = () => {
    setCargando(true);
    getSolicitudUieDetalle(solicitudId)
      .then(({ solicitud }) => setHistorial(parsearSeguimiento(solicitud.seguimiento)))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitudId]);

  const handleGuardar = async () => {
    if (!nuevo.trim()) {
      setError('Escribe un seguimiento antes de guardar.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await agregarSeguimiento(solicitudId, nuevo.trim());
      setNuevo('');
      cargarHistorial();
      onGuardado();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo guardar el seguimiento.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-blue-100 my-8">
        <h2 className="text-lg font-bold text-blue-950 mb-4 border-b border-blue-100 pb-2">
          Servicio Técnico — Folio {solicitudId}
        </h2>

        {cargando ? (
          <p className="text-sm text-gray-500 py-4 text-center">Cargando historial...</p>
        ) : (
          historial.length > 0 && (
            <div className="mb-4 border border-blue-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-blue-100 bg-blue-50/20 shadow-sm">
              {historial.map((h, i) => (
                <div key={i} className="p-3 text-sm bg-white/80">
                  <div className="flex justify-between text-xs text-blue-900 font-semibold mb-1">
                    <span>{h.usuario || 'Usuario'}</span>
                    <span className="text-gray-500">{h.fecha}</span>
                  </div>
                  <p className="text-gray-800">{h.texto}</p>
                </div>
              ))}
            </div>
          )
        )}

        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nuevo seguimiento:</label>
          <textarea
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            rows={4}
            placeholder="Escribe el seguimiento aquí..."
            className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-3 font-semibold bg-red-50 p-2 rounded border border-red-100">{error}</p>}

        <div className="flex justify-end gap-2 pt-3 border-t border-blue-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
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