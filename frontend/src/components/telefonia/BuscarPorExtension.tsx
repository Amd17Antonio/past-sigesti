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
    <div className="w-full">
      <label className="text-xs font-medium text-slate-700">{label}:</label>
      <div className="flex gap-2 mt-1">
        <input 
          value={extension} 
          onChange={(e) => setExtension(e.target.value)} 
          onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
          placeholder="Ingresa la extensión..."
          className="border border-slate-300 p-2 flex-1 rounded text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <button 
          type="button" 
          onClick={handleBuscar} 
          disabled={buscando} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 transition shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <span>🔍</span>
          <span>{buscando ? 'Buscando...' : 'Buscar'}</span>
        </button>
      </div>
      {error && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}