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
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span>Mostrar</span>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border rounded p-1">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>registros</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Buscar:</span>
          <input value={busquedaGlobal} onChange={(e) => setBusquedaGlobal(e.target.value)} className="border p-1 rounded" />
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Folio Detalle</th>
            <th className="p-2 text-left">Solicitante</th>
            <th className="p-2 text-left">Extensión</th>
            <th className="p-2 text-left">Área</th>
            <th className="p-2 text-left">Desc. Problema</th>
            <th className="p-2 text-left">Fecha Inicio</th>
            <th className="p-2 text-left">Fecha Cierre</th>
            <th className="p-2 text-left">Técnico</th>
            <th className="p-2 text-left">Seguimiento</th>
            <th className="p-2 text-left">Respuesta</th>
            {renderAcciones && <th className="p-2 text-left">{labelAcciones ?? 'Acciones'}</th>}
          </tr>
          <tr className="bg-gray-50">
            <th className="p-1"><input value={filtros.folio} onChange={(e) => handleFiltro('folio', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.solicitante} onChange={(e) => handleFiltro('solicitante', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.extension} onChange={(e) => handleFiltro('extension', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.area} onChange={(e) => handleFiltro('area', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.desc} onChange={(e) => handleFiltro('desc', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.fechaInicio} onChange={(e) => handleFiltro('fechaInicio', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.fechaCierre} onChange={(e) => handleFiltro('fechaCierre', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.tecnico} onChange={(e) => handleFiltro('tecnico', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.seguimiento} onChange={(e) => handleFiltro('seguimiento', e.target.value)} className="border p-1 w-full rounded" /></th>
            <th className="p-1"><input value={filtros.respuesta} onChange={(e) => handleFiltro('respuesta', e.target.value)} className="border p-1 w-full rounded" /></th>
            {renderAcciones && <th className="p-1"></th>}
          </tr>
        </thead>
        <tbody>
          {paginadas.map((s) => (
            <tr key={s.id} className="border-t align-top">
              <td className="p-2">👁 {s.id}</td>
              <td className="p-2">{s.solicitante ?? '-'}</td>
              <td className="p-2">{s.extension ?? '-'}</td>
              <td className="p-2">{s.area ?? '-'}</td>
              <td className="p-2">{s.descripcion ?? '-'}</td>
              <td className="p-2">{s.fecha_solicitud ?? '-'}</td>
              <td className="p-2">{s.fecha_cierre ?? '-'}</td>
              <td className="p-2">{s.nombre ?? '-'}</td>
              <td className="p-2 max-w-xs whitespace-pre-wrap text-xs">{s.seguimiento ?? '-'}</td>
              <td className="p-2">{s.observaciones ?? '-'}</td>
              {renderAcciones && <td className="p-2">{renderAcciones(s)}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {filtradas.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Mostrando registros del {filtradas.length === 0 ? 0 : inicio + 1} al{' '}
          {Math.min(inicio + pageSize, filtradas.length)} de un total de {filtradas.length} registros
        </p>

        <div className="flex gap-1">
          {getPaginas(pagina, totalPaginas).map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className={`px-3 py-1 rounded text-sm ${p === pagina ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-700'}`}
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