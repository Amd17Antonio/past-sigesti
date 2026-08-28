import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSolicitudesVpn,
  actualizarAsignacionVpn,
  exportarResguardoVpnExcel,
} from '../services/solicitudVpnService';
import type { SolicitudVpn } from '../types/SolicitudVpn';
import SortIcon from '../components/common/SortIcon';
import EditarResguardoVpnModal from '../components/vpn/EditarResguardoVpnModal';

const COLUMNAS: { key: keyof SolicitudVpn; label: string }[] = [
  { key: 'link_sistema', label: 'Link del sistema' },
  { key: 'ip_puerto', label: 'IP y puerto' },
  { key: 'nombre_usuario', label: 'Nombre' },
];

// Convierte 'YYYY-MM-DD' a 'DD/MM/YYYY' para mostrar en el resumen.
const formatFecha = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export default function ResguardoVpn() {
  const navigate = useNavigate();
  const [data, setData] = useState<SolicitudVpn[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<keyof SolicitudVpn | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<SolicitudVpn | null>(null);

  // Filtro de fechas (Del / Al): afecta tanto la tabla como el Excel.
  const [fechaDel, setFechaDel] = useState('');
  const [fechaAl, setFechaAl] = useState('');
  const [exportando, setExportando] = useState(false);
  const [errorExport, setErrorExport] = useState<string | null>(null);

  const cargar = () => {
    getSolicitudesVpn({ pagina: 1, por_pagina: 1000, estatus: 'activo' }).then((r) => {
      setData(r.registros);
    });
  };

  useEffect(() => {
    cargar();
  }, []);

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

  const handleSort = (key: keyof SolicitudVpn) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Filtrado por fecha_activo dentro del rango seleccionado
  const dataPorFecha = useMemo(() => {
    if (!fechaDel && !fechaAl) return data;

    return data.filter((s) => {
      const fechaActivo = (s as any).fecha_activo as string | null | undefined;
      if (!fechaActivo) return false;
      const fecha = fechaActivo.slice(0, 10);
      if (fechaDel && fecha < fechaDel) return false;
      if (fechaAl && fecha > fechaAl) return false;
      return true;
    });
  }, [data, fechaDel, fechaAl]);

  const filtrados = useMemo(() => {
    return dataPorFecha.filter((s) =>
      COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      })
    );
  }, [dataPorFecha, filtros]);

  const ordenados = useMemo(() => {
    if (!sortKey) return filtrados;
    return [...filtrados].sort((a, b) => {
      const va = a[sortKey] ?? '';
      const vb = b[sortKey] ?? '';
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtrados, sortKey, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / porPagina));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  const paginadas = ordenados.slice(inicio, inicio + porPagina);

  // Texto resumen del rango de fechas seleccionado.
  const resumenFechas = useMemo(() => {
    const cantidad = dataPorFecha.length;
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
  }, [fechaDel, fechaAl, dataPorFecha]);

  const handleExportarExcel = async () => {
    setErrorExport(null);
    setExportando(true);
    try {
      await exportarResguardoVpnExcel({
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
        RESGUARDO DE VPN — ACCESOS ACTIVOS
      </div>

      <div className="border border-t-0 border-blue-100 rounded-b-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <button
            onClick={() => navigate('/solicitud-vpn')}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1"
          >
            ← Solicitud VPN
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
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {paginadas.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors align-middle">
                  <td className="p-3 font-medium text-gray-800">{s.link_sistema || '-'}</td>
                  <td className="p-3 font-medium text-gray-800">{s.ip_puerto || '-'}</td>
                  <td className="p-3 uppercase text-gray-700">{s.nombre_usuario}</td>
                  <td className="p-3 w-16">
                    <button
                      onClick={() => setEditando(s)}
                      title="Editar acceso"
                      className="p-1.5 rounded-md hover:bg-amber-100 border border-transparent hover:border-amber-300 transition-colors shadow-sm"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginadas.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm bg-white border border-blue-100 rounded-lg mt-2 shadow-sm">
            Sin accesos activos.
          </div>
        )}

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-700 flex-wrap gap-2">
          <span>
            Mostrando registros del {ordenados.length === 0 ? 0 : inicio + 1} al {Math.min(inicio + porPagina, ordenados.length)} de un total de {ordenados.length} registros
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

      {editando && (
        <EditarResguardoVpnModal
          folio={editando.id}
          onGuardar={(payload) => actualizarAsignacionVpn(editando.id, payload as any)}
          onClose={() => setEditando(null)}
          onActualizado={cargar}
        />
      )}
    </div>
  );
}