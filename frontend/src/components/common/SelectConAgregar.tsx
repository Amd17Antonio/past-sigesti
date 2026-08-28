import { useState } from 'react';

interface Opcion {
  id: number;
  [key: string]: any;
}

interface Props {
  label: string;
  opciones: Opcion[];
  campoTexto: string; // Campo a mostrar, por ejemplo: "marca", "TipoEquipo"
  value: string;
  onChange: (id: string) => void;
  onAgregar: (texto: string) => Promise<Opcion>;
  placeholder?: string;
}

export default function SelectConAgregar({
  label,
  opciones,
  campoTexto,
  value,
  onChange,
  onAgregar,
  placeholder,
}: Props) {
  const [agregando, setAgregando] = useState(false);
  const [nuevoValor, setNuevoValor] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === '__agregar__') {
      setAgregando(true);
      return;
    }

    onChange(e.target.value);
  };

  const handleGuardarNuevo = async () => {
    if (!nuevoValor.trim()) return;

    setGuardando(true);
    setError('');

    try {
      const creado = await onAgregar(nuevoValor.trim());

      onChange(String(creado.id));
      setAgregando(false);
      setNuevoValor('');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'No se pudo guardar. ¿Ya existe ese valor?'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (agregando) {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">{label}:</label>

        <div className="flex gap-2">
          <input
            autoFocus
            value={nuevoValor}
            onChange={(e) => setNuevoValor(e.target.value)}
            placeholder={placeholder ?? `Nuevo ${label.toLowerCase()}`}
            className="border border-blue-200 rounded-lg p-2.5 flex-1 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          <button
            type="button"
            onClick={handleGuardarNuevo}
            disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 rounded-lg font-bold disabled:opacity-50 transition shadow-sm"
          >
            {guardando ? '...' : '✓'}
          </button>

          <button
            type="button"
            onClick={() => {
              setAgregando(false);
              setNuevoValor('');
              setError('');
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3.5 rounded-lg transition shadow-sm"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-xs mt-1 font-medium bg-red-50 p-1.5 rounded border border-red-100">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}:</label>

      <select
        value={value}
        onChange={handleSelectChange}
        className="border border-blue-200 rounded-lg p-2.5 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      >
        <option value="">--Seleccionar--</option>

        {opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {opcion[campoTexto]}
          </option>
        ))}

        <option value="__agregar__" className="text-blue-700 font-medium">
          + Agregar nuevo...
        </option>
      </select>
    </div>
  );
}