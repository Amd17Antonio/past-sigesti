import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  seguimiento: string | null;
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
  { key: 'seguimiento', label: 'Seguimiento' },
  { key: 'observaciones', label: 'Respuesta' },
];

export default function HistorialAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudHistorial[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof SolicitudHistorial | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const navigate = useNavigate();

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
      {/* Cabecera y buscador global */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">Historial de Solicitudes</h1>
          <button
            onClick={() => navigate('/solicitudes-uie')}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1"
          >
            ← Regresar
          </button>
        </div>
        <input
          placeholder="Buscar de forma general..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-blue-200 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-72 shadow-sm"
        />
      </div>

      {/* Contenedor de la Tabla */}
      <div className="overflow-x-auto border border-blue-100 rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-50/70 text-blue-900 uppercase text-xs">
            <tr>
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-3 cursor-pointer select-none hover:bg-blue-100/50 transition-colors" onClick={() => handleSort(c.key)}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <SortIcon active={sortKey === c.key} direction={sortDir} />
                  </span>
                </th>
              ))}
            </tr>
            <tr className="bg-gray-50 border-t border-blue-100">
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-2">
                  <input
                    value={filtros[c.key] ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                    placeholder="Filtrar..."
                    className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {ordenadas.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50/40 transition-colors align-top">
                <td className="p-3 font-medium text-gray-800 flex items-center gap-2">
                  <button
                    onClick={() => setDetalleId(s.id)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 p-1 rounded transition-colors shadow-sm"
                    title="Ver detalle"
                  >
                    👁
                  </button>
                  {s.id}
                </td>
                <td className="p-3 text-gray-700">{s.solicitante}</td>
                <td className="p-3 text-gray-700">{s.extension ?? '-'}</td>
                <td className="p-3 text-gray-700">{s.area}</td>
                <td className="p-3 text-gray-700 max-w-xs">{s.descripcion}</td>
                <td className="p-3 text-gray-700">{s.fecha_solicitud}</td>
                <td className="p-3 text-gray-700">{s.fecha_cierre ?? '-'}</td>
                <td className="p-3 text-gray-700">{s.nombre}</td>
                <td className="p-3 max-w-xs whitespace-pre-wrap text-xs text-gray-600">{s.seguimiento ?? '-'}</td>
                <td className="p-3 text-gray-700">{s.observaciones ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordenadas.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
          Sin resultados encontrados.
        </div>
      )}

      {detalleId !== null && (
        <DetalleSolicitudModal
          idSolicitud={detalleId}
          onClose={() => setDetalleId(null)}
        />
      )}
    </div>
  );
}