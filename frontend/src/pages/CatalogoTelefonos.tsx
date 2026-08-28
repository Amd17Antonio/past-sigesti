import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCatalogoTelefonos, actualizarTelefono, eliminarTelefono } from '../services/catalogoTelefoniaService';
import SortIcon from '../components/common/SortIcon';

interface TelefonoRow {
  id: number; nombre: string; apellido_paterno: string; apellido_materno: string;
  extension: string; puesto: string; correo_institucional: string; mac: string;
  modelo: string; numero_serie: string; edificio: string; nivel: string; status: string;
  area: string; categoria: string; total_solicitudes: number;
  vinculado_como_jefe_de: string | null; vinculado_como_secretaria_de: string | null;
}

const COLUMNAS: { key: keyof TelefonoRow; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'extension', label: 'Extensión' },
  { key: 'puesto', label: 'Puesto' },
  { key: 'area', label: 'Área' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'mac', label: 'MAC' },
];

export default function CatalogoTelefonos() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<TelefonoRow[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof TelefonoRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<TelefonoRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = () => { 
    getCatalogoTelefonos().then(setRegistros).catch(() => setRegistros([])); 
  };
  
  useEffect(() => { cargar(); }, []);

  const nombreCompleto = (r: TelefonoRow) =>
    [r.nombre, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(' ');

  const handleSort = (key: keyof TelefonoRow) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtrados = registros.filter((r) => {
    const valores: Record<string, string> = {
      id: String(r.id), 
      nombre: nombreCompleto(r), 
      extension: r.extension ?? '',
      puesto: r.puesto ?? '', 
      area: r.area ?? '', 
      modelo: r.modelo ?? '', 
      mac: r.mac ?? '',
    };
    return COLUMNAS.every(({ key }) => {
      const f = filtros[key];
      if (!f) return true;
      return valores[key].toLowerCase().includes(f.toLowerCase());
    });
  });

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

  const abrirEditar = (r: TelefonoRow) => {
    setForm({
      nombre: r.nombre ?? '', apellido_paterno: r.apellido_paterno ?? '', apellido_materno: r.apellido_materno ?? '',
      puesto: r.puesto ?? '', correo_institucional: r.correo_institucional ?? '', extension: r.extension ?? '',
      modelo: r.modelo ?? '', numero_serie: r.numero_serie ?? '', mac: r.mac ?? '',
      edificio: r.edificio ?? '', nivel: r.nivel ?? '',
    });
    setError('');
    setEditando(r);
  };

  const handleGuardar = async () => {
    if (!editando) return;
    setEnviando(true);
    setError('');
    try {
      await actualizarTelefono(editando.id, form);
      setEditando(null);
      cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo guardar.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (r: TelefonoRow) => {
    if (!window.confirm(`¿Dar de baja la línea telefónica de ${nombreCompleto(r)}?`)) return;
    try {
      await eliminarTelefono(r.id);
      cargar();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'No se pudo eliminar.');
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/catalogos/grupo/telefonia')}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded mb-4 transition-colors shadow-sm"
      >
        ← Regresar
      </button>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Catálogo de Teléfonos</h1>
      </div>

      <div className="overflow-x-auto border border-blue-100 rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white uppercase text-xs">
            <tr>
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-3 cursor-pointer select-none hover:bg-blue-800 transition-colors" onClick={() => handleSort(c.key)}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <SortIcon active={sortKey === c.key} direction={sortDir} />
                  </span>
                </th>
              ))}
              <th className="p-3">Vinculado a</th>
              <th className="p-3">Estatus</th>
              <th className="p-3">Acciones</th>
            </tr>
            <tr className="bg-blue-50/70 border-t border-blue-100">
              {COLUMNAS.map((c) => (
                <th key={c.key} className="p-2">
                  <input
                    value={filtros[c.key] ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                    placeholder="Filtrar..."
                    className="border border-blue-200 rounded p-1.5 w-full text-xs font-normal bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
                </th>
              ))}
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ordenados.map((r) => (
              <tr key={r.id} className="hover:bg-blue-50/30 align-top transition-colors">
                <td className="p-3 text-gray-700">{r.id}</td>
                <td className="p-3 font-medium text-gray-800">{nombreCompleto(r)}</td>
                <td className="p-3 text-gray-700">{r.extension}</td>
                <td className="p-3 text-gray-700">{r.puesto ?? '-'}</td>
                <td className="p-3 text-gray-700">{r.area ?? '-'}</td>
                <td className="p-3 text-gray-700">{r.modelo ?? '-'}</td>
                <td className="p-3 font-mono text-xs text-gray-600">{r.mac ?? '-'}</td>
                <td className="p-3 text-xs text-gray-600 space-y-0.5">
                  {r.total_solicitudes > 0 && <p>{r.total_solicitudes} solicitud(es)</p>}
                  {r.vinculado_como_jefe_de && <p>Jefe de: {r.vinculado_como_jefe_de}</p>}
                  {r.vinculado_como_secretaria_de && <p>Secretaria de: {r.vinculado_como_secretaria_de}</p>}
                  {!r.total_solicitudes && !r.vinculado_como_jefe_de && !r.vinculado_como_secretaria_de && '-'}
                </td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${r.status === 'Activo' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 flex gap-3 items-center">
                  <button onClick={() => abrirEditar(r)} title="Editar" className="hover:scale-110 transition-transform">✏️</button>
                  <button onClick={() => handleEliminar(r)} title="Dar de baja línea" className="hover:scale-110 transition-transform">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordenados.length === 0 && <p className="text-gray-500 mt-4 text-center">Sin resultados encontrados.</p>}

      {editando && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-blue-100">
            <div className="bg-blue-600 text-white px-4 py-3 font-semibold flex justify-between items-center shadow-sm">
              <span>Editar línea telefónica</span>
              <button onClick={() => setEditando(null)} className="text-white hover:text-blue-200 font-bold transition-colors">✕</button>
            </div>
            
            <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
                <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Apellido Paterno</label>
                  <input placeholder="Apellido Paterno" value={form.apellido_paterno} onChange={(e) => setForm({ ...form, apellido_paterno: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Apellido Materno</label>
                  <input placeholder="Apellido Materno" value={form.apellido_materno} onChange={(e) => setForm({ ...form, apellido_materno: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Puesto</label>
                <input placeholder="Puesto" value={form.puesto} onChange={(e) => setForm({ ...form, puesto: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correo Institucional</label>
                <input placeholder="Correo institucional" value={form.correo_institucional} onChange={(e) => setForm({ ...form, correo_institucional: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Extensión</label>
                  <input placeholder="Extensión" value={form.extension} onChange={(e) => setForm({ ...form, extension: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Modelo</label>
                  <input placeholder="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">No. Serie</label>
                  <input placeholder="No. Serie" value={form.numero_serie} onChange={(e) => setForm({ ...form, numero_serie: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">MAC</label>
                  <input placeholder="MAC" value={form.mac} onChange={(e) => setForm({ ...form, mac: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm font-mono bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Edificio</label>
                  <input placeholder="Edificio" value={form.edificio} onChange={(e) => setForm({ ...form, edificio: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nivel</label>
                  <input placeholder="Nivel" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm" />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2.5 text-red-700 text-sm rounded-r shadow-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-blue-100">
              <button onClick={() => setEditando(null)} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">Cancelar</button>
              <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 transition-colors shadow-sm">
                {enviando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}