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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Servicio Técnico — Folio {solicitudId}</h2>

        {cargando ? (
          <p className="text-sm text-gray-500">Cargando historial...</p>
        ) : (
          historial.length > 0 && (
            <div className="mb-4 border rounded max-h-48 overflow-y-auto divide-y">
              {historial.map((h, i) => (
                <div key={i} className="p-2 text-sm bg-gray-50">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{h.usuario || 'Usuario'}</span>
                    <span>{h.fecha}</span>
                  </div>
                  <p className="text-gray-800">{h.texto}</p>
                </div>
              ))}
            </div>
          )
        )}

        <label className="block text-sm font-medium mb-1">Nuevo seguimiento:</label>
        <textarea
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          rows={4}
          placeholder="Seguimiento"
          className="border rounded w-full p-2 text-sm"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button
            onClick={handleGuardar}
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