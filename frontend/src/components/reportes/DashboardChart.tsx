interface Props {
  labels?: string[];
  values: number[];
  color?: string;
}

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export default function DashboardChart({ labels = MESES, values, color = '#2563eb' }: Props) {
  const width = 560;
  const height = 220;
  const padding = 30;
  const max = Math.max(1, ...values);

  const puntos = values.map((v, i) => {
    const x = padding + (i * (width - padding * 2)) / (values.length - 1);
    const y = height - padding - (v / max) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPath = `M${puntos[0]} L${puntos.join(' L')} L${width - padding},${height - padding} L${padding},${height - padding} Z`;
  const linePath = `M${puntos.join(' L')}`;

  const stepsY = 5;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {Array.from({ length: stepsY + 1 }).map((_, i) => {
        const y = padding + (i * (height - padding * 2)) / stepsY;
        const valor = Math.round(max - (i * max) / stepsY);
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeWidth={1} />
            <text x={4} y={y + 4} fontSize={10} fill="#64748b">{valor}</text>
          </g>
        );
      })}

      <path d={areaPath} fill={color} opacity={0.12} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {puntos.map((p, i) => {
        const [x, y] = p.split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r={3.5} fill={color} stroke="#ffffff" strokeWidth={1.5} />;
      })}

      {labels.map((l, i) => {
        const x = padding + (i * (width - padding * 2)) / (labels.length - 1);
        return (
          <text key={l} x={x} y={height - 6} fontSize={9} fill="#475569" textAnchor="middle">
            {l}
          </text>
        );
      })}
    </svg>
  );
}