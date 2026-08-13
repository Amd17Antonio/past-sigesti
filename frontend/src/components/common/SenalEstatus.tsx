import { colorPorEstatus } from '../../utils/estatusColor';

type TipoIcono = 'internet' | 'telefono' | 'vpn' | 'correo';

export default function SenalEstatus({
  estatus, tipo = 'internet', titulo,
}: { estatus: string; tipo?: TipoIcono; titulo?: string }) {
  const color = colorPorEstatus(estatus);
  const props = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, fill: 'none' };

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>{titulo ?? estatus}</title>

      {tipo === 'internet' && (
        <>
          <path d="M2 8.5C7.5 3 16.5 3 22 8.5" {...props} opacity="0.35" />
          <path d="M5.5 12C9 8.7 15 8.7 18.5 12" {...props} opacity="0.65" />
          <path d="M9 15.5C10.8 13.8 13.2 13.8 15 15.5" {...props} />
          <circle cx="12" cy="19.5" r="1.7" fill={color} />
        </>
      )}

      {tipo === 'telefono' && (
        <path
          d="M5 4h3l1.5 4-2 1.5c1 2.5 2.5 4 5 5l1.5-2 4 1.5v3c0 1-1 2-2 2C10 19 4 13 4 7c0-1 1-2 2-2z"
          fill={color}
        />
      )}

      {tipo === 'correo' && (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2" {...props} />
          <path d="M4 7l8 6 8-6" {...props} />
        </>
      )}

      {tipo === 'vpn' && (
        <>
          <rect x="5" y="11" width="14" height="9" rx="2" fill={color} />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" {...props} />
        </>
      )}
    </svg>
  );
}