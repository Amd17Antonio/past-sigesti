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
        <label className="text-sm font-medium">{label}:</label>

        <div className="flex gap-2 mt-1">
          <input
            autoFocus
            value={nuevoValor}
            onChange={(e) => setNuevoValor(e.target.value)}
            placeholder={placeholder ?? `Nuevo ${label.toLowerCase()}`}
            className="border rounded p-2 flex-1"
          />

          <button
            type="button"
            onClick={handleGuardarNuevo}
            disabled={guardando}
            className="bg-green-600 text-white px-3 rounded disabled:opacity-50"
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
            className="bg-gray-300 px-3 rounded"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}:</label>

      <select
        value={value}
        onChange={handleSelectChange}
        className="border rounded p-2 w-full mt-1"
      >
        <option value="">--Seleccionar--</option>

        {opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {opcion[campoTexto]}
          </option>
        ))}

        <option value="__agregar__">
          + Agregar nuevo...
        </option>
      </select>
    </div>
  );
}