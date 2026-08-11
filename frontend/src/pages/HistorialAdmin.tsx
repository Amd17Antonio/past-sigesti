import { useEffect, useMemo, useState } from 'react';
import { getHistorial } from '../services/solicitudService';
import SortIcon from '../components/common/SortIcon';
import DetalleSolicitudModal from '../components/solicitudes/DetalleSolicitudModal';

interface SolicitudHistorial {
  id: number;
  solicitante: string;
  extension: number | null;
  area: string;
  descripcion: string;
  fecha_solicitud: string;
  fecha_cierre: string | null;
  nombre: string;
  observaciones: string | null;
}

const COLUMNAS: { key: keyof SolicitudHistorial; label: string }[] = [
  { key: 'id', label: 'Folio Detalle' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'extension', label: 'Extensión' },
  { key: 'area', label: 'Área' },
  { key: 'descripcion', label: 'Desc. Problema' },
  { key: 'fecha_solicitud', label: 'Fecha Inicio' },
  { key: 'fecha_cierre', label: 'Fecha Cierre' },
  { key: 'nombre', label: 'Técnico' },
  { key: 'observaciones', label: 'Respuesta' },
];

export default function HistorialAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudHistorial[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof SolicitudHistorial | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [detalleId, setDetalleId] = useState<number | null>(null);

  useEffect(() => {
    getHistorial().then(setSolicitudes);
  }, []);

  const handleSort = (key: keyof SolicitudHistorial) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtradas = solicitudes
    .filter((s) =>
      JSON.stringify(s).toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((s) =>
      COLUMNAS.every(({ key }) => {
        const f = filtros[key];
        if (!f) return true;
        return String(s[key] ?? '').toLowerCase().includes(f.toLowerCase());
      })
    );

  const ordenadas = useMemo(() => {
    if (!sortKey) return filtradas;
    return [...filtradas].sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtradas, sortKey, sortDir]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Historial de Solicitudes</h1>
        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-2 text-left cursor-pointer" onClick={() => handleSort(c.key)}>
                <span className="inline-flex items-center">
                  {c.label}
                  <SortIcon active={sortKey === c.key} direction={sortDir} />
                </span>
              </th>
            ))}
          </tr>
          <tr className="bg-gray-50">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-1">
                <input
                  value={filtros[c.key] ?? ''}
                  onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                  className="border p-1 w-full text-xs font-normal"
                  placeholder="Filtrar..."
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordenadas.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">
                <button
                  onClick={() => setDetalleId(s.id)}
                  className="mr-1 hover:opacity-70"
                  title="Ver detalle"
                >
                  👁
                </button>
                {s.id}
              </td>
              <td className="p-2">{s.solicitante}</td>
              <td className="p-2">{s.extension ?? '-'}</td>
              <td className="p-2">{s.area}</td>
              <td className="p-2">{s.descripcion}</td>
              <td className="p-2">{s.fecha_solicitud}</td>
              <td className="p-2">{s.fecha_cierre ?? '-'}</td>
              <td className="p-2">{s.nombre}</td>
              <td className="p-2">{s.observaciones ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ordenadas.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      {detalleId !== null && (
        <DetalleSolicitudModal
          idSolicitud={detalleId}
          onClose={() => setDetalleId(null)}
        />
      )}
    </div>
  );
}