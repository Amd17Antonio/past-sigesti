import { useState } from 'react';
import { buscarUsuarioTelefoniaPorExtension } from '../../services/solicitudTelefoniaService';

interface Props {
  label?: string;
  onEncontrado: (usuario: any) => void;
  onNoEncontrado?: (extension: string) => void;
}

export default function BuscarPorExtension({ label = 'Extensión', onEncontrado, onNoEncontrado }: Props) {
  const [extension, setExtension] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');

  const handleBuscar = async () => {
    if (!extension) return;
    setBuscando(true);
    setError('');
    try {
      const data = await buscarUsuarioTelefoniaPorExtension(extension);
      onEncontrado(data);
    } catch {
      setError('No se encontró usuario con esa extensión.');
      onNoEncontrado?.(extension);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}:</label>
      <div className="flex gap-2 mt-1">
        <input value={extension} onChange={(e) => setExtension(e.target.value)} className="border p-2 flex-1" />
        <button type="button" onClick={handleBuscar} disabled={buscando} className="bg-blue-600 text-white px-4 rounded text-sm">
          🔍 {buscando ? '...' : 'Buscar'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}