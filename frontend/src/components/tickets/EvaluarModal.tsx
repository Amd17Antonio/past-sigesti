import { useEffect, useState } from 'react';
import { getPreguntas, yaEvaluada, enviarEvaluacion } from '../../services/encuestaService';

interface Pregunta { id: number; pregunta: string }

const OPCIONES: { valor: 'B' | 'R' | 'M'; label: string; colorActivo: string }[] = [
  { valor: 'B', label: 'Bueno', colorActivo: 'bg-green-600 text-white shadow-sm' },
  { valor: 'R', label: 'Regular', colorActivo: 'bg-amber-500 text-white shadow-sm' },
  { valor: 'M', label: 'Malo', colorActivo: 'bg-red-600 text-white shadow-sm' },
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
    }).catch(() => {
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
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 w-full max-w-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Evaluar servicio — Folio {solicitudId}</h2>

        {cargando && <p className="text-sm text-gray-500">Cargando...</p>}

        {!cargando && yaFueEvaluada && !enviado && (
          <p className="text-sm text-gray-600 mb-4">Ya evaluaste esta solicitud. ¡Gracias!</p>
        )}

        {!cargando && enviado && (
          <p className="text-sm text-green-600 font-medium mb-4">¡Gracias por tu evaluación!</p>
        )}

        {!cargando && !yaFueEvaluada && !enviado && (
          <>
            <div className="space-y-4">
              {preguntas.map((p) => (
                <div key={p.id} className="p-3 bg-gray-50 rounded-md border border-gray-100">
                  <p className="text-sm font-medium text-gray-800 mb-2">{p.pregunta}</p>
                  <div className="flex gap-2">
                    {OPCIONES.map((op) => {
                      const seleccionado = respuestas[p.id] === op.valor;
                      return (
                        <button
                          key={op.valor}
                          type="button"
                          onClick={() => seleccionar(p.id, op.valor)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                            seleccionado
                              ? op.colorActivo
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {op.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (opcional):</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Cuéntanos más sobre el servicio recibido..."
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

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
                onClick={handleEnviar}
                disabled={enviando}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-50 transition-colors"
              >
                {enviando ? 'Enviando...' : 'Enviar evaluación'}
              </button>
            </div>
          </>
        )}

        {(yaFueEvaluada || enviado) && (
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}