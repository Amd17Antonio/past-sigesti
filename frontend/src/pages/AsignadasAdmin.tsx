import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAsignadas } from '../services/solicitudService';
import AsignarModal from '../components/tickets/AsignarModal';
import DetalleSolicitudModal from '../components/solicitudes/DetalleSolicitudModal';
import SortIcon from '../components/common/SortIcon';

interface SolicitudAsignada {
  id: number;
  solicitante: string | null;
  extension: number | null;
  area: string | null;
  descripcion: string | null;
  nombre: string | null;
  no_inventario: string | null;
  status_uie: number;
}

interface Filtros {
  folio: string;
  solicitante: string;
  extension: string;
  asunto: string;
  area: string;
  asignado: string;
  inventario: string;
}

const FILTROS_VACIOS: Filtros = {
  folio: '', solicitante: '', extension: '', asunto: '', area: '', asignado: '', inventario: '',
};

type SortKey = 'id' | 'solicitante' | 'extension' | 'descripcion' | 'area' | 'nombre' | 'no_inventario';

const COLUMNAS: { key: SortKey; label: string; filtro: keyof Filtros }[] = [
  { key: 'id', label: 'Folio Detalle', filtro: 'folio' },
  { key: 'solicitante', label: 'Solicitante', filtro: 'solicitante' },
  { key: 'extension', label: 'Extensión', filtro: 'extension' },
  { key: 'descripcion', label: 'Asunto', filtro: 'asunto' },
  { key: 'area', label: 'Área', filtro: 'area' },
  { key: 'nombre', label: 'Asignado a', filtro: 'asignado' },
  { key: 'no_inventario', label: 'No. Inventario', filtro: 'inventario' },
];

function getPaginas(actual: number, total: number): (number | '...')[] {
  const delta = 2;
  const rango: (number | '...')[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= actual - delta && i <= actual + delta)) {
      rango.push(i);
    } else if (rango[rango.length - 1] !== '...') {
      rango.push('...');
    }
  }
  return rango;
}

export default function AsignadasAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAsignada[]>([]);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [reasignarId, setReasignarId] = useState<number | null>(null);
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const cargar = () => {
    getAsignadas().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const filtradas = useMemo(() => {
    const resultado = solicitudes.filter((s) => {
      const coincideFiltros =
        String(s.id).includes(filtros.folio) &&
        (s.solicitante ?? '').toLowerCase().includes(filtros.solicitante.toLowerCase()) &&
        String(s.extension ?? '').includes(filtros.extension) &&
        (s.descripcion ?? '').toLowerCase().includes(filtros.asunto.toLowerCase()) &&
        (s.area ?? '').toLowerCase().includes(filtros.area.toLowerCase()) &&
        (s.nombre ?? '').toLowerCase().includes(filtros.asignado.toLowerCase()) &&
        (s.no_inventario ?? '').toLowerCase().includes(filtros.inventario.toLowerCase());

      const coincideGlobal = busquedaGlobal
        ? JSON.stringify(s).toLowerCase().includes(busquedaGlobal.toLowerCase())
        : true;

      return coincideFiltros && coincideGlobal;
    });

    if (sortBy) {
      resultado.sort((a, b) => {
        const valA = a[sortBy] ?? '';
        const valB = b[sortBy] ?? '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDir === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDir === 'asc' ? -1 : 1;
        if (strA > strB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [solicitudes, filtros, busquedaGlobal, sortBy, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / pageSize));

  useEffect(() => {
    setPagina(1);
  }, [filtros, busquedaGlobal, pageSize]);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [totalPaginas, pagina]);

  const inicio = (pagina - 1) * pageSize;
  const paginadas = filtradas.slice(inicio, inicio + pageSize);

  const handleFiltro = (campo: keyof Filtros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold text-blue-950">Asignadas</h1>
        <button
          onClick={() => navigate('/solicitudes-uie')}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
        >
          ← Regresar
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 flex-wrap gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span>Mostrar</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-blue-200 rounded p-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>registros</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Buscar:</span>
          <input
            value={busquedaGlobal}
            onChange={(e) => setBusquedaGlobal(e.target.value)}
            className="border border-blue-200 p-1 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            {COLUMNAS.map((c) => (
              <th
                key={c.key}
                className="p-2 text-left cursor-pointer select-none border-b border-gray-200"
                onClick={() => handleSort(c.key)}
              >
                <span className="inline-flex items-center">
                  {c.label}
                  <SortIcon active={sortBy === c.key} direction={sortDir} />
                </span>
              </th>
            ))}
            <th className="p-2 text-left border-b border-gray-200">Reasignar</th>
          </tr>
          <tr className="bg-gray-50">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-1 border-b border-gray-200">
                <input
                  value={filtros[c.filtro]}
                  onChange={(e) => handleFiltro(c.filtro, e.target.value)}
                  className="border border-blue-200 p-1 w-full rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </th>
            ))}
            <th className="p-1 border-b border-gray-200"></th>
          </tr>
        </thead>
        <tbody>
          {paginadas.map((s) => (
            <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50 align-top">
              <td className="p-2">
                <button
                  onClick={() => setDetalleId(s.id)}
                  className="text-gray-600 hover:text-indigo-600 transition"
                  title="Ver detalle"
                >
                  👁 {s.id}
                </button>
              </td>
              <td className="p-2">{s.solicitante ?? '-'}</td>
              <td className="p-2">{s.extension ?? '-'}</td>
              <td className="p-2">{s.descripcion ?? '-'}</td>
              <td className="p-2">{s.area ?? 'Sin área asignada'}</td>
              <td className="p-2">{s.nombre ?? '-'}</td>
              <td className="p-2">{s.no_inventario ?? '-'}</td>
              <td className="p-2">
                {s.status_uie > 0 ? (
                  <span className="text-gray-400 text-xs">Asignador por CGD</span>
                ) : (
                  <button
                    onClick={() => setReasignarId(s.id)}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition"
                    title="Reasignar"
                  >
                    ➔
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtradas.length === 0 && <p className="text-gray-500 mt-4 text-sm">Sin resultados</p>}

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Mostrando registros del {filtradas.length === 0 ? 0 : inicio + 1} al{' '}
          {Math.min(inicio + pageSize, filtradas.length)} de un total de {filtradas.length} registros
        </p>

        <div className="flex gap-1">
          {getPaginas(pagina, totalPaginas).map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400 text-sm">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className={`px-3 py-1 rounded text-sm transition ${
                  p === pagina ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      </div>

      {reasignarId !== null && (
        <AsignarModal
          solicitudId={reasignarId}
          onClose={() => setReasignarId(null)}
          onAsignado={cargar}
          titulo="Reasignar"
        />
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