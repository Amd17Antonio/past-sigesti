import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSolicitudesCorreo,
  imprimirOficioCorreo,
  actualizarAsignacionCorreo,
} from '../services/solicitudCorreoService';
import type { SolicitudCorreo } from '../types/SolicitudCorreo';
//import EditarAsignacionModal from '../components/common/EditarAsignacionModal';
import SortIcon from '../components/common/SortIcon';
import EditarResguardoCorreoModal from '../components/correo/EditarResguardoCorreoModal';

const COLUMNAS: { key: keyof SolicitudCorreo; label: string }[] = [
  { key: 'correo_institucional', label: 'Correo' },
  { key: 'nombre', label: 'Nombre' },
];

export default function ResguardoCorreo() {
  const navigate = useNavigate();
  const [data, setData] = useState<SolicitudCorreo[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [porPagina, setPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);
  const [sortKey, setSortKey] = useState<keyof SolicitudCorreo | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<SolicitudCorreo | null>(null);

  const cargar = () => {
    getSolicitudesCorreo({ pagina: 1, por_pagina: 1000, estatus: 'activo' }).then((r) => {
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

  const handleSort = (key: keyof SolicitudCorreo) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtrados = useMemo(() => {
    return data.filter((s) =>
      COLUMNAS.every(({ key }) => {
        const filtro = filtros[key];
        if (!filtro) return true;
        return String(s[key] ?? '').toLowerCase().includes(filtro.toLowerCase());
      })
    );
  }, [data, filtros]);

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

  const handleImprimir = async (id: number) => {
    try {
      await imprimirOficioCorreo(id);
    } catch {
      alert('No se pudo generar el oficio en PDF.');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t font-semibold">
        RESGUARDO DE CORREO — CUENTAS ACTIVAS
      </div>

      <div className="border border-t-0 rounded-b p-4">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => navigate('/solicitud-correo')}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            ← Solicitud Correo
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span>Mostrar</span>
            <select value={porPagina} onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }} className="border rounded p-1">
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>registros</span>
          </div>
        </div>

        <div className="overflow-x-auto">
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
                <th className="p-2 text-left w-16">Editar</th>
                <th className="p-2 text-left">PDF</th>
              </tr>
              <tr className="bg-gray-50">
                {COLUMNAS.map((c) => (
                  <th key={c.key} className="p-1">
                    <input
                      value={filtros[c.key] ?? ''}
                      onChange={(e) => handleFiltroColumna(c.key, e.target.value)}
                      className="border p-1 w-full text-xs font-normal"
                    />
                  </th>
                ))}
                <th className="p-1"></th>
                <th className="p-1"></th>
              </tr>
            </thead>
            <tbody>
              {paginadas.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2 font-medium">{s.correo_institucional ?? '-'}</td>
                  <td className="p-2 uppercase">{s.nombre}</td>
                  <td className="p-2 w-16">
                    <button
                      onClick={() => setEditando(s)}
                      title="Editar correo asignado"
                      className="p-1.5 rounded hover:bg-amber-100 hover:ring-1 hover:ring-amber-300 transition-colors"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleImprimir(s.id)}
                      className="text-blue-700 hover:underline text-xs font-medium"
                    >
                      GENERAR PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginadas.length === 0 && <p className="text-gray-500 mt-4">Sin cuentas activas.</p>}

        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Mostrando registros del {ordenados.length === 0 ? 0 : inicio + 1} al {Math.min(inicio + porPagina, ordenados.length)} de un total de {ordenados.length} registros
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={paginaSegura === 1} className="px-3 py-1 border rounded disabled:opacity-40">Anterior</button>
            <span className="px-3 py-1 bg-purple-800 text-white rounded">{paginaSegura}</span>
            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={paginaSegura === totalPaginas} className="px-3 py-1 border rounded disabled:opacity-40">Siguiente</button>
          </div>
        </div>
      </div>

      {editando && (
  <EditarResguardoCorreoModal
    folio={editando.id}
    onGuardar={(payload) => actualizarAsignacionCorreo(editando.id, payload as any)}
    onClose={() => setEditando(null)}
    onActualizado={cargar}
  />
)}
    </div>
  );
}