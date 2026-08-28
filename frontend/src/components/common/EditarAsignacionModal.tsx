import { useState } from 'react';
import type { CampoActivacion } from './CambiarEstatusModal';

interface Props {
  folio: number;
  titulo?: string;
  campos: CampoActivacion[];
  valoresIniciales: Record<string, string | null | undefined>;
  onGuardar: (payload: Record<string, any>) => Promise<void>;
  onClose: () => void;
  onActualizado: () => void;
}

export default function EditarAsignacionModal({
  folio,
  titulo = 'Editar asignación',
  campos,
  valoresIniciales,
  onGuardar,
  onClose,
  onActualizado,
}: Props) {
  const inicial: Record<string, string> = {};
  campos.forEach((c) => {
    inicial[c.name] = valoresIniciales[c.name] ?? '';
  });

  const [valores, setValores] = useState<Record<string, string>>(inicial);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleCambio = (name: string, value: string) => {
    setValores((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setError('');
    for (const campo of campos) {
      if (campo.requerido && !valores[campo.name]?.trim()) {
        setError(`El campo "${campo.label}" es obligatorio.`);
        return;
      }
    }
    setEnviando(true);
    try {
      const payload: Record<string, any> = {};
      campos.forEach((c) => {
        payload[c.name] = valores[c.name] || undefined;
      });
      await onGuardar(payload);
      onActualizado();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo guardar la información.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-blue-100 overflow-hidden max-h-[90vh] flex flex-col my-8">
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-blue-100 bg-blue-50/20">
          <h2 className="text-lg font-bold text-blue-950">{titulo} — Folio: {folio}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {campos.map((campo) => (
            <div key={campo.name}>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {campo.label}
                {campo.requerido && <span className="text-red-500"> *</span>}
              </label>
              {campo.tipo === 'select' ? (
                <select
                  value={valores[campo.name] ?? ''}
                  onChange={(e) => handleCambio(campo.name, e.target.value)}
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="">Selecciona...</option>
                  {campo.opciones?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={valores[campo.name] ?? ''}
                  onChange={(e) => handleCambio(campo.name, e.target.value)}
                  placeholder={campo.placeholder}
                  className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              )}
            </div>
          ))}

          {error && <p className="text-red-600 text-sm font-semibold bg-red-50 p-2 rounded border border-red-100">{error}</p>}

          <div className="flex justify-end gap-2 pt-4 border-t border-blue-100 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={enviando}
              className="px-4 py-2 text-sm font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition"
            >
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}