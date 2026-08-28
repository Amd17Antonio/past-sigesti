import { useEffect, useState } from 'react';
import { getPreguntas, yaEvaluada, enviarEvaluacion } from '../../services/encuestaService';

interface Pregunta { id: number; pregunta: string }

const OPCIONES: { valor: 'B' | 'R' | 'M'; label: string; activeBg: string }[] = [
  { valor: 'B', label: 'Bueno', activeBg: '#16a34a' }, // Verde (Se mantiene semántico para calificación)
  { valor: 'R', label: 'Regular', activeBg: '#eab308' }, // Amarillo (Se mantiene semántico para calificación)
  { valor: 'M', label: 'Malo', activeBg: '#dc2626' }, // Rojo (Se mantiene semántico para calificación)
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-blue-100 my-8">
        <h2 className="text-lg font-bold text-blue-950 mb-4 border-b border-blue-100 pb-2">
          Evaluar servicio — Folio {solicitudId}
        </h2>

        {cargando && <p className="text-sm text-gray-500 py-4 text-center">Cargando...</p>}

        {!cargando && yaFueEvaluada && !enviado && (
          <p className="text-sm text-gray-700 py-4 text-center font-medium">Ya evaluaste esta solicitud. ¡Gracias!</p>
        )}

        {!cargando && enviado && (
          <p className="text-sm text-green-700 py-4 text-center font-medium">¡Gracias por tu evaluación!</p>
        )}

        {!cargando && !yaFueEvaluada && !enviado && (
          <>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {preguntas.map((p) => (
                <div key={p.id} className="bg-blue-50/30 p-3.5 rounded-lg border border-blue-100 shadow-sm">
                  <p className="text-sm font-semibold text-gray-900 mb-2.5">{p.pregunta}</p>
                  <div className="flex gap-2">
                    {OPCIONES.map((op) => {
                      const seleccionado = respuestas[p.id] === op.valor;
                      return (
                        <button
                          key={op.valor}
                          type="button"
                          onClick={() => seleccionar(p.id, op.valor)}
                          style={{
                            backgroundColor: seleccionado ? op.activeBg : '#f3f4f6',
                            color: seleccionado ? '#ffffff' : '#1f2937',
                            borderColor: seleccionado ? op.activeBg : '#d1d5db',
                          }}
                          className={`px-4 py-1.5 rounded-md text-xs font-bold transition shadow-xs border ${
                            seleccionado ? 'ring-2 ring-offset-1 ring-blue-400 scale-105' : 'hover:bg-gray-200'
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Observaciones (opcional):</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  placeholder="Cuéntanos más sobre el servicio recibido..."
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mt-3 font-semibold bg-red-50 p-2 rounded border border-red-100">{error}</p>}

            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-blue-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviar}
                disabled={enviando}
                className="px-4 py-2 text-sm font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
              >
                {enviando ? 'Enviando...' : 'Enviar evaluación'}
              </button>
            </div>
          </>
        )}

        {(yaFueEvaluada || enviado) && (
          <div className="flex justify-end pt-4 mt-4 border-t border-blue-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}