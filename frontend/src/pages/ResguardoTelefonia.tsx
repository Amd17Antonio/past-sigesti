import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSolicitudesTelefonia,
  imprimirResguardoTelefonia,
  exportarResguardoTelefoniaExcel,
} from '../services/solicitudTelefoniaService';
import type { SolicitudTelefoniaRow } from '../types/SolicitudTelefonia';
import EditarResguardoTelefoniaModal from '../components/telefonia/EditarResguardoTelefoniaModal';
import SortIcon from '../components/common/SortIcon';

const COLUMNAS: { key: keyof SolicitudTelefoniaRow; label: string }[] = [
  { key: 'extension_asignada', label: 'Extensión' },
  { key: 'nombre', label: 'Nombre' },
];

// Convierte 'YYYY-MM-DD' a 'DD/MM/YYYY' para mostrar en el resumen.
const formatFecha = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export default function ResguardoTelefonia() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<SolicitudTelefoniaRow[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<keyof SolicitudTelefoniaRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<SolicitudTelefoniaRow | null>(null);

  // Filtro de fechas (Del / Al): afecta tanto la tabla como el Excel.
  const [fechaDel, setFechaDel] = useState('');
  const [fechaAl, setFechaAl] = useState('');
  const [exportando, setExportando] = useState(false);
  const [errorExport, setErrorExport] = useState<string | null>(null);

  const cargar = () => {
    getSolicitudesTelefonia().then(setSolicitudes);
  };

  useEffect(() => {
    cargar();
  }, []);

  const activas = useMemo(
    () => solicitudes.filter((s) => s.estatus === 'activo'),
    [solicitudes]
  );

  const handleFiltroColumna = (key: string, value: string) => {
    setFiltros({ ...filtros, [key]: value });
    setPagina(1);
  };

  const handleFechaDelChange = (value: string) => {
    setFechaDel(value);
    setPagina(1);
  };

  const handleFechaAlChange = (value: string) => {
    setFechaAl(value);
    setPagina(1);
  };

  const handleSort = (key: keyof SolicitudTelefoniaRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Si no hay fechas seleccionadas, muestra todo.
  // Si hay una o ambas fechas, filtra por fecha_activo dentro del rango.
  const activasPorFecha = useMemo(() => {
    if (!fechaDel && !fechaAl) return activas;

    return activas.filter((s) => {
      const fechaActivo = (s as any).fecha_activo as string | null | undefined;
      if (!fechaActivo) return false;
      const fecha = fechaActivo.slice(0, 10);
      if (fechaDel && fecha < fechaDel) return false;
      if (fechaAl && fecha > fechaAl) return false;
      return true;
    });
  }, [activas, fechaDel, fechaAl]);

  const filtradas = useMemo(() => {
    return activasPorFecha.filter((s) =>
      COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      })
    );
  }, [activasPorFecha, filtros]);

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

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  const paginadas = ordenadas.slice(inicio, inicio + porPagina);

  // Texto resumen del rango de fechas seleccionado.
  const resumenFechas = useMemo(() => {
    const cantidad = activasPorFecha.length;
    const plural = cantidad === 1 ? 'resguardo' : 'resguardos';

    if (fechaDel && fechaAl) {
      return `Del ${formatFecha(fechaDel)} al ${formatFecha(fechaAl)} se registraron ${cantidad} ${plural}.`;
    }
    if (fechaDel && !fechaAl) {
      return `Desde el ${formatFecha(fechaDel)} se registraron ${cantidad} ${plural}.`;
    }
    if (!fechaDel && fechaAl) {
      return `Hasta el ${formatFecha(fechaAl)} se registraron ${cantidad} ${plural}.`;
    }
    return null;
  }, [fechaDel, fechaAl, activasPorFecha]);

  const handleGenerarPdf = async (id: number) => {
    try {
      await imprimirResguardoTelefonia(id);
    } catch {
      alert('No se pudo generar el PDF de resguardo.');
    }
  };

  const handleExportarExcel = async () => {
    setErrorExport(null);
    setExportando(true);
    try {
      await exportarResguardoTelefoniaExcel({
        del: fechaDel || undefined,
        al: fechaAl || undefined,
      });
    } catch {
      setErrorExport('No se pudo generar el Excel de resguardos.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="p-6">
      {/* Cabecera Principal */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg font-semibold text-base shadow-sm">
        RESGUARDO DE TELEFONÍA — SERVICIOS ACTIVOS
      </div>

      <div className="border border-t-0 border-blue-100 rounded-b-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <button
            onClick={() => navigate('/solicitud-telefono')}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1"
          >
            ← Solicitud Teléfono
          </button>
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

        {/* Filtro de fechas + exportar a Excel */}
        <div className="flex flex-wrap items-end gap-4 mb-4 p-4 bg-blue-50/50 border border-blue-100 rounded-md">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Del:</label>
            <input
              type="date"
              value={fechaDel}
              onChange={(e) => handleFechaDelChange(e.target.value)}
              className="border border-blue-200 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Al:</label>
            <input
              type="date"
              value={fechaAl}
              onChange={(e) => handleFechaAlChange(e.target.value)}
              className="border border-blue-200 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleExportarExcel}
            disabled={exportando}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {exportando ? 'Generando...' : 'Exportar a Excel'}
          </button>
          {(fechaDel || fechaAl) && (
            <button
              onClick={() => { setFechaDel(''); setFechaAl(''); setPagina(1); }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline self-center"
            >
              Quitar filtro de fechas
            </button>
          )}
          {errorExport && <span className="text-red-600 text-sm">{errorExport}</span>}
        </div>

        {resumenFechas && (
          <p className="text-sm font-medium text-gray-700 mb-4 px-1">{resumenFechas}</p>
        )}

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
                <th className="p-3 text-left w-16">Editar</th>
                <th className="p-3 text-left">PDF</th>
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
                <th className="p-2"></th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {paginadas.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors align-middle">
                  <td className="p-3 font-medium text-gray-800">{s.extension_asignada ?? '-'}</td>
                  <td className="p-3 uppercase text-gray-700">{s.nombre}</td>
                  <td className="p-3 w-16">
                    <button
                      onClick={() => setEditando(s)}
                      title="Editar información del usuario"
                      className="p-1.5 rounded-md hover:bg-amber-100 border border-transparent hover:border-amber-300 transition-colors shadow-sm"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleGenerarPdf(s.id)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-medium transition-colors shadow-sm inline-block"
                    >
                      GENERAR PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginadas.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
            Sin servicios activos encontrados.
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

      {editando && (editando.extension_asignada || editando.extension) && (
        <EditarResguardoTelefoniaModal
          extension={editando.extension_asignada || editando.extension || ''}
          onClose={() => setEditando(null)}
          onActualizado={cargar}
        />
      )}
      {editando && !editando.extension_asignada && !editando.extension && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center border border-blue-100">
            <p className="text-gray-700 text-sm mb-4">
              Este registro no tiene ninguna extensión asociada, no se puede consultar su ficha.
            </p>
            <button
              onClick={() => setEditando(null)}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}