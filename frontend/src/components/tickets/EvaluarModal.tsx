import { useEffect, useState } from 'react';
import { getPreguntas, yaEvaluada, enviarEvaluacion } from '../../services/encuestaService';

interface Pregunta { id: number; pregunta: string }

const OPCIONES: { valor: 'B' | 'R' | 'M'; label: string; color: string }[] = [
  { valor: 'B', label: 'Bueno', color: 'bg-green-600' },
  { valor: 'R', label: 'Regular', color: 'bg-yellow-500' },
  { valor: 'M', label: 'Malo', color: 'bg-red-600' },
];

export default function EvaluarModal({
  solicitudId, onClose, onEvaluado,
}: { solicitudId: number; onClose: () => void; onEvaluado?: () => void }) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<Record<number, 'B' | 'R' | 'M'>>({});
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(true);
  const [yaFueEvaluada, setYaFueEvaluada] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    Promise.all([getPreguntas(), yaEvaluada(solicitudId)]).then(([p, evaluada]) => {
      setPreguntas(p);
      setYaFueEvaluada(evaluada);
      setCargando(false);
    });
  }, [solicitudId]);

  const seleccionar = (idPregunta: number, valor: 'B' | 'R' | 'M') => {
    setRespuestas((r) => ({ ...r, [idPregunta]: valor }));
  };

  const handleEnviar = async () => {
    if (Object.keys(respuestas).length < preguntas.length) {
      setError('Responde todas las preguntas antes de enviar.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await enviarEvaluacion(
        solicitudId,
        preguntas.map((p) => ({ id_pregunta: p.id, tipo_respuesta: respuestas[p.id] })),
        observaciones || undefined
      );
      setEnviado(true);
      onEvaluado?.();
    } catch {
      setError('No se pudo enviar tu evaluación, intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Evaluar servicio — Folio {solicitudId}</h2>

        {cargando && <p className="text-sm text-gray-500">Cargando...</p>}

        {!cargando && yaFueEvaluada && !enviado && (
          <p className="text-sm text-gray-600">Ya evaluaste esta solicitud. ¡Gracias!</p>
        )}

        {!cargando && enviado && (
          <p className="text-sm text-green-600">¡Gracias por tu evaluación!</p>
        )}

        {!cargando && !yaFueEvaluada && !enviado && (
          <>
            <div className="space-y-4">
              {preguntas.map((p) => (
                <div key={p.id}>
                  <p className="text-sm font-medium mb-2">{p.pregunta}</p>
                  <div className="flex gap-2">
                    {OPCIONES.map((op) => (
                      <button
                        key={op.valor}
                        type="button"
                        onClick={() => seleccionar(p.id, op.valor)}
                        className={`px-3 py-1.5 rounded text-xs text-white transition ${
                          respuestas[p.id] === op.valor ? op.color : 'bg-gray-300'
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="text-sm font-medium">Observaciones (opcional):</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  className="border rounded p-2 w-full mt-1 text-sm"
                  placeholder="Cuéntanos más sobre el servicio recibido..."
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
              <button
                onClick={handleEnviar}
                disabled={enviando}
                className="px-4 py-2 bg-purple-800 text-white rounded disabled:opacity-50"
              >
                {enviando ? 'Enviando...' : 'Enviar evaluación'}
              </button>
            </div>
          </>
        )}

        {(yaFueEvaluada || enviado) && (
          <div className="flex justify-end mt-6">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}