import { useEffect, useState } from 'react';
import { agregarSeguimiento, getSeguimiento } from '../../services/solicitudService';

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

// Parsea el texto guardado en formato "[dd/mm/yyyy HH:mm - usuario] texto"
function parsearHistorial(raw: string | null): EntradaSeguimiento[] {
  if (!raw) return [];
  const lineas = raw.split('\n');
  const entradas: EntradaSeguimiento[] = [];

  for (const linea of lineas) {
    const match = linea.match(/^\[(.+?) - (.+?)\]\s(.*)$/);
    if (match) {
      entradas.push({ fecha: match[1], usuario: match[2], texto: match[3] });
    } else if (entradas.length > 0) {
      // línea de continuación de un texto con salto de línea propio
      entradas[entradas.length - 1].texto += '\n' + linea;
    }
  }
  return entradas;
}

export default function SeguimientoModal({ solicitudId, onClose, onGuardado }: Props) {
  const [historial, setHistorial] = useState<EntradaSeguimiento[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getSeguimiento(solicitudId)
      .then((raw) => setHistorial(parsearHistorial(raw)))
      .catch(() => setError('No se pudo cargar el historial de seguimiento'))
      .finally(() => setCargandoHistorial(false));
  }, [solicitudId]);

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
      <div className="bg-white rounded-lg p-6 w-[480px] shadow-xl border border-gray-100 max-h-[85vh] flex flex-col">
        <h2 className="font-bold text-lg text-gray-800 mb-4">Servicio Técnico</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Historial de seguimiento
        </label>
        <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50 overflow-y-auto max-h-52">
          {cargandoHistorial && (
            <p className="text-gray-400 text-sm">Cargando...</p>
          )}
          {!cargandoHistorial && historial.length === 0 && (
            <p className="text-gray-400 text-sm">Sin seguimientos registrados aún.</p>
          )}
          {!cargandoHistorial && historial.map((h, i) => (
            <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}>
              <p className="text-xs text-blue-600 font-medium mb-0.5">
                {h.fecha} — {h.usuario}
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{h.texto}</p>
            </div>
          ))}
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo seguimiento</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe la nota de seguimiento"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2 resize-none"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-2">
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
            {enviando ? 'Guardando...' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
}