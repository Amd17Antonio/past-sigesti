import { useNavigate } from 'react-router-dom';

export interface BotonCatalogo {
  label: string;
  to: string;
  icono?: string;
}

interface Props {
  titulo: string;
  botones: BotonCatalogo[];
}

export default function CatalogoGrupoLayout({ titulo, botones }: Props) {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-950 mb-6">{titulo}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {botones.map((b) => (
          <button
            key={b.to}
            onClick={() => navigate(b.to)}
            className="bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-lg p-5 text-left shadow-sm transition-colors"
          >
            <span className="text-2xl">{b.icono ?? '📁'}</span>
            <p className="mt-2 font-medium text-gray-800 text-sm">{b.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}