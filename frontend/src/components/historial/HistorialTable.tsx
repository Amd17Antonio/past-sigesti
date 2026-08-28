import { useEffect, useMemo, useState, type ReactNode } from 'react';

export interface HistorialItem {
  id: number;
  solicitante: string;
  extension: number | null;
  area: string;
  descripcion: string;
  fecha_solicitud: string;
  fecha_cierre: string | null;
  nombre: string | null;
  observaciones: string | null;
  seguimiento: string | null;   // NUEVO
}

interface Filtros {
  folio: string;
  solicitante: string;
  extension: string;
  area: string;
  desc: string;
  fechaInicio: string;
  fechaCierre: string;
  tecnico: string;
  seguimiento: string;   // NUEVO
  respuesta: string;
}

const FILTROS_VACIOS: Filtros = {
  folio: '', solicitante: '', extension: '', area: '', desc: '',
  fechaInicio: '', fechaCierre: '', tecnico: '', seguimiento: '', respuesta: '',
};

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

interface Props {
  data: HistorialItem[];
  renderAcciones?: (item: HistorialItem) => ReactNode;
  labelAcciones?: string;
}

export default function HistorialTable({ data, renderAcciones, labelAcciones }: Props) {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pagina, setPagina] = useState(1);

  const filtradas = useMemo(() => {
    return data.filter((s) => {
      const coincideFiltros =
        String(s.id).includes(filtros.folio) &&
        (s.solicitante ?? '').toLowerCase().includes(filtros.solicitante.toLowerCase()) &&
        String(s.extension ?? '').includes(filtros.extension) &&
        (s.area ?? '').toLowerCase().includes(filtros.area.toLowerCase()) &&
        (s.descripcion ?? '').toLowerCase().includes(filtros.desc.toLowerCase()) &&
        (s.fecha_solicitud ?? '').includes(filtros.fechaInicio) &&
        (s.fecha_cierre ?? '').includes(filtros.fechaCierre) &&
        (s.nombre ?? '').toLowerCase().includes(filtros.tecnico.toLowerCase()) &&
        (s.seguimiento ?? '').toLowerCase().includes(filtros.seguimiento.toLowerCase()) &&
        (s.observaciones ?? '').toLowerCase().includes(filtros.respuesta.toLowerCase());

      const coincideGlobal = busquedaGlobal
        ? JSON.stringify(s).toLowerCase().includes(busquedaGlobal.toLowerCase())
        : true;

      return coincideFiltros && coincideGlobal;
    });
  }, [data, filtros, busquedaGlobal]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / pageSize));

  useEffect(() => setPagina(1), [filtros, busquedaGlobal, pageSize]);
  useEffect(() => { if (pagina > totalPaginas) setPagina(totalPaginas); }, [totalPaginas, pagina]);

  const inicio = (pagina - 1) * pageSize;
  const paginadas = filtradas.slice(inicio, inicio + pageSize);

  const handleFiltro = (campo: keyof Filtros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-5">
      {/* Controles superiores (Paginación y Búsqueda Global) */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-blue-900 font-medium">
          <span>Mostrar</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded p-1.5 text-sm bg-white text-blue-950"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>registros</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-900 font-medium">
          <span>Buscar:</span>
          <input
            value={busquedaGlobal}
            onChange={(e) => setBusquedaGlobal(e.target.value)}
            placeholder="Buscar en todo..."
            className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1.5 rounded text-sm w-60"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-blue-100 rounded-md shadow-inner">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2.5 text-left font-semibold">Folio Detalle</th>
              <th className="p-2.5 text-left font-semibold">Solicitante</th>
              <th className="p-2.5 text-left font-semibold">Extensión</th>
              <th className="p-2.5 text-left font-semibold">Área</th>
              <th className="p-2.5 text-left font-semibold">Desc. Problema</th>
              <th className="p-2.5 text-left font-semibold">Fecha Inicio</th>
              <th className="p-2.5 text-left font-semibold">Fecha Cierre</th>
              <th className="p-2.5 text-left font-semibold">Técnico</th>
              <th className="p-2.5 text-left font-semibold">Seguimiento</th>
              <th className="p-2.5 text-left font-semibold">Respuesta</th>
              {renderAcciones && <th className="p-2.5 text-left font-semibold">{labelAcciones ?? 'Acciones'}</th>}
            </tr>
            <tr className="bg-blue-50">
              <th className="p-1.5"><input value={filtros.folio} onChange={(e) => handleFiltro('folio', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.solicitante} onChange={(e) => handleFiltro('solicitante', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.extension} onChange={(e) => handleFiltro('extension', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.area} onChange={(e) => handleFiltro('area', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.desc} onChange={(e) => handleFiltro('desc', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.fechaInicio} onChange={(e) => handleFiltro('fechaInicio', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.fechaCierre} onChange={(e) => handleFiltro('fechaCierre', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.tecnico} onChange={(e) => handleFiltro('tecnico', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.seguimiento} onChange={(e) => handleFiltro('seguimiento', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              <th className="p-1.5"><input value={filtros.respuesta} onChange={(e) => handleFiltro('respuesta', e.target.value)} placeholder="Filtrar..." className="border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none p-1 w-full rounded text-xs font-normal bg-white" /></th>
              {renderAcciones && <th className="p-1.5"></th>}
            </tr>
          </thead>
          <tbody>
            {paginadas.map((s) => (
              <tr key={s.id} className="border-t border-blue-50 align-top hover:bg-blue-50/60 transition-colors">
                <td className="p-2.5 font-medium text-blue-900">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-blue-600">👁</span> {s.id}
                  </span>
                </td>
                <td className="p-2.5">{s.solicitante ?? '-'}</td>
                <td className="p-2.5">{s.extension ?? '-'}</td>
                <td className="p-2.5">{s.area ?? '-'}</td>
                <td className="p-2.5">{s.descripcion ?? '-'}</td>
                <td className="p-2.5 whitespace-nowrap">{s.fecha_solicitud ?? '-'}</td>
                <td className="p-2.5 whitespace-nowrap">{s.fecha_cierre ?? '-'}</td>
                <td className="p-2.5">{s.nombre ?? '-'}</td>
                <td className="p-2.5 max-w-xs whitespace-pre-wrap text-xs text-blue-950">{s.seguimiento ?? '-'}</td>
                <td className="p-2.5">{s.observaciones ?? '-'}</td>
                {renderAcciones && <td className="p-2.5">{renderAcciones(s)}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {filtradas.length === 0 && (
          <p className="text-blue-900/60 text-sm p-8 text-center bg-white">Sin resultados disponibles</p>
        )}
      </div>

      {/* Paginación Inferior */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
        <p className="text-sm text-blue-900 font-medium">
          Mostrando registros del {filtradas.length === 0 ? 0 : inicio + 1} al{' '}
          {Math.min(inicio + pageSize, filtradas.length)} de un total de {filtradas.length} registros
        </p>

        <div className="flex gap-1.5">
          {getPaginas(pagina, totalPaginas).map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="px-2.5 py-1 text-blue-400 select-none">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPagina(p as number)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors shadow-sm ${
                  p === pagina
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white border border-blue-200 text-blue-900 hover:bg-blue-50'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}