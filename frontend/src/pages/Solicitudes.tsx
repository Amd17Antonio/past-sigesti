import { useEffect, useMemo, useState } from 'react';
import { getPendientes } from '../services/solicitudService';
import CrearSolicitudModal from '../components/solicitudes/CrearSolicitudModal';
import SortIcon from '../components/common/SortIcon';

interface Solicitud {
  id: number;
  solicitante: string;
  extension: number | null;
  area: string;
  descripcion: string;
}

const COLUMNAS: { key: keyof Solicitud; label: string }[] = [
  { key: 'id', label: 'Folio' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'extension', label: 'Extensión' },
  { key: 'area', label: 'Área' },
  { key: 'descripcion', label: 'Descripción' },
];

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Solicitud | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const cargar = () => {
    getPendientes().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleFiltroColumna = (key: string, value: string) => {
    setFiltros({ ...filtros, [key]: value });
    setPagina(1);
  };

  const handleSort = (key: keyof Solicitud) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const filtradas = useMemo(() => {
    return solicitudes.filter((s) =>
      COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      })
    );
  }, [solicitudes, filtros]);

  const ordenadas = useMemo(() => {
    if (!sortBy) return filtradas;
    return [...filtradas].sort((a, b) => {
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
  }, [filtradas, sortBy, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  const paginadas = ordenadas.slice(inicio, inicio + porPagina);

  return (
    <div className="p-6">
      {/* Cabecera Principal */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg font-semibold text-base shadow-sm flex justify-between items-center">
        <span>SOLICITUDES PENDIENTES</span>
        <button
          onClick={() => setMostrarModal(true)}
          className="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 rounded-md text-xs font-semibold transition-colors shadow-sm"
        >
          + Agregar solicitud
        </button>
      </div>

      <div className="border border-t-0 border-blue-100 rounded-b-lg p-4 bg-white shadow-sm">
        {/* Controles superiores (Registros por página) */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="text-sm text-gray-700">
            {/* Espacio reservado para alineación o filtros globales si se requieren */}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Mostrar</span>
            <select
              value={porPagina}
              onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
              className="border border-blue-200 rounded p-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        {/* Contenedor de la Tabla */}
        <div className="overflow-x-auto border border-blue-100 rounded-lg bg-white shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50/70 text-blue-900 uppercase text-xs">
              <tr>
                {COLUMNAS.map((c) => (
                  <th
                    key={c.key}
                    className="p-3 cursor-pointer select-none hover:bg-blue-100/50 transition-colors"
                    onClick={() => handleSort(c.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      <SortIcon active={sortBy === c.key} direction={sortDir} />
                    </span>
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50 border-t border-blue-100">
                {COLUMNAS.map((c) => (
                  <th key={c.key} className="p-2">
                    <input
                      value={filtros[c.key] ?? ''}
                      onChange={(e) => handleFiltroColumna(c.key, e.target.value)}
                      placeholder="Filtrar..."
                      className="border border-blue-200 rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {paginadas.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors align-middle">
                  <td className="p-3 font-medium text-gray-800">{s.id}</td>
                  <td className="p-3 uppercase text-gray-700">{s.solicitante}</td>
                  <td className="p-3 font-medium text-gray-800">{s.extension ?? '-'}</td>
                  <td className="p-3 text-gray-700">{s.area}</td>
                  <td className="p-3 text-gray-600">{s.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginadas.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
            Sin resultados encontrados.
          </div>
        )}

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-700 flex-wrap gap-2">
          <span>
            Mostrando registros del {ordenadas.length === 0 ? 0 : inicio + 1} al {Math.min(inicio + porPagina, ordenadas.length)} de un total de {ordenadas.length} registros
          </span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaSegura === 1}
              className="px-3 py-1.5 border border-gray-300 bg-white rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium shadow-sm">
              {paginaSegura}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura === totalPaginas}
              className="px-3 py-1.5 border border-gray-300 bg-white rounded-md text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {mostrarModal && (
        <CrearSolicitudModal onClose={() => setMostrarModal(false)} onCreado={cargar} />
      )}
    </div>
  );
}