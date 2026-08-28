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
      <div className="bg-white rounded p-6 w-[480px] shadow-lg max-h-[85vh] flex flex-col">
        <h2 className="font-bold text-lg mb-4">Servicio Técnico</h2>

        <label className="block text-sm font-medium mb-1">
          Historial de seguimiento
        </label>
        <div className="border rounded p-2 mb-4 bg-gray-50 overflow-y-auto max-h-52">
          {cargandoHistorial && (
            <p className="text-gray-400 text-sm">Cargando...</p>
          )}
          {!cargandoHistorial && historial.length === 0 && (
            <p className="text-gray-400 text-sm">Sin seguimientos registrados aún.</p>
          )}
          {!cargandoHistorial && historial.map((h, i) => (
            <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t' : ''}>
              <p className="text-xs text-gray-500 font-medium">
                {h.fecha} — {h.usuario}
              </p>
              <p className="text-sm whitespace-pre-wrap">{h.texto}</p>
            </div>
          ))}
        </div>

        <label className="block text-sm font-medium mb-1">Nuevo seguimiento</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe la nota de seguimiento"
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