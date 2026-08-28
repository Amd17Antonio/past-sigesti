import { useEffect, useMemo, useState } from 'react';
import {
  getUsuarios, getRoles, crearUsuario, actualizarUsuario, eliminarUsuario,
  type UsuarioRow, type RolOption,
} from '../services/usuarioService';
import { getCatalogo } from '../services/catalogoService';
import SortIcon from '../components/common/SortIcon';

interface AreaOption { id: number; area: string }

const COLUMNAS: { key: string; label: string }[] = [
  { key: 'usuario', label: 'Usuario' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'rol', label: 'Rol' },
  { key: 'area', label: 'Área' },
];

export default function CatalogoUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const [roles, setRoles] = useState<RolOption[]>([]);
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<UsuarioRow | null>(null);
  const [restableciendoClave, setRestableciendoClave] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = () => {
    getUsuarios().then(setUsuarios).catch(() => setUsuarios([]));
  };

  useEffect(() => {
    cargar();
    getRoles().then(setRoles).catch(() => setRoles([]));
    getCatalogo('areas').then((r) => setAreas(r.registros as AreaOption[])).catch(() => setAreas([]));
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const valorColumna = (u: UsuarioRow, key: string): string => {
    if (key === 'rol') return u.rol ?? '';
    if (key === 'area') return u.area ?? '';
    return String((u as any)[key] ?? '');
  };

  const filtrados = usuarios.filter((u) =>
    COLUMNAS.every(({ key }) => {
      const f = filtros[key];
      if (!f) return true;
      return valorColumna(u, key).toLowerCase().includes(f.toLowerCase());
    })
  );

  const ordenados = useMemo(() => {
    if (!sortKey) return filtrados;
    return [...filtrados].sort((a, b) => {
      const va = valorColumna(a, sortKey);
      const vb = valorColumna(b, sortKey);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtrados, sortKey, sortDir]);

  const abrirCrear = () => {
    setForm({ usuario: '', clave: '', nombre: '', rol_id: '', id_area: '' });
    setError('');
    setRestableciendoClave(false);
    setCreando(true);
  };

  const abrirEditar = (u: UsuarioRow) => {
    setForm({
      usuario: u.usuario,
      nombre: u.nombre,
      rol_id: String(u.rol_id),
      id_area: u.id_area ? String(u.id_area) : '',
      status: u.status ? '1' : '0',
    });
    setError('');
    setRestableciendoClave(false);
    setEditando(u);
  };

  const handleGuardar = async () => {
    if (!form.usuario || !form.nombre || !form.rol_id) {
      setError('Usuario, nombre y rol son obligatorios.');
      return;
    }
    if (creando && (!form.clave || form.clave.length < 6)) {
      setError('La contraseña es obligatoria y debe tener al menos 6 caracteres.');
      return;
    }
    if (editando && restableciendoClave && (!form.clave || form.clave.length < 6)) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      if (editando) {
        await actualizarUsuario(editando.id, {
          usuario: form.usuario,
          clave: restableciendoClave ? form.clave : undefined,
          nombre: form.nombre,
          rol_id: Number(form.rol_id),
          id_area: form.id_area ? Number(form.id_area) : null,
          status: form.status === '1',
        });
      } else {
        await crearUsuario({
          usuario: form.usuario,
          clave: form.clave,
          nombre: form.nombre,
          rol_id: Number(form.rol_id),
          id_area: form.id_area ? Number(form.id_area) : null,
        });
      }
      setCreando(false);
      setEditando(null);
      cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo guardar el usuario.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (u: UsuarioRow) => {
    if (!window.confirm(`¿Dar de baja al usuario "${u.usuario}"? Podrás reactivarlo después editándolo.`)) return;
    try {
      await eliminarUsuario(u.id);
      cargar();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'No se pudo dar de baja.');
    }
  };

  const modalAbierto = creando || !!editando;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Usuarios del Sistema</h1>
        <button onClick={abrirCrear} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors shadow-sm">
          + Agregar Usuario
        </button>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ordenados.map((u) => (
              <tr key={u.id} className="hover:bg-blue-50/30 align-top transition-colors">
                <td className="p-3 font-medium text-gray-800">{u.usuario}</td>
                <td className="p-3 text-gray-700">{u.nombre}</td>
                <td className="p-3 text-gray-700">{u.rol ?? '-'}</td>
                <td className="p-3 text-gray-700">{u.area ?? '-'}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${u.status ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                    {u.status ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 flex gap-3 items-center">
                  <button onClick={() => abrirEditar(u)} title="Editar" className="hover:scale-110 transition-transform">✏️</button>
                  <button onClick={() => { abrirEditar(u); setRestableciendoClave(true); }} title="Restablecer contraseña" className="hover:scale-110 transition-transform">🔑</button>
                  <button onClick={() => handleEliminar(u)} title="Dar de baja" className="hover:scale-110 transition-transform">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordenados.length === 0 && <p className="text-gray-500 mt-4 text-center">Sin resultados encontrados.</p>}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-blue-100">
            <div className="bg-blue-600 text-white px-4 py-3 font-semibold flex justify-between items-center shadow-sm">
              <span>{editando ? 'Editar usuario' : 'Agregar usuario'}</span>
              <button onClick={() => { setCreando(false); setEditando(null); }} className="text-white hover:text-blue-200 font-bold transition-colors">✕</button>
            </div>

            <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Usuario *</label>
                <input
                  value={form.usuario ?? ''}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  placeholder="Nombre de usuario"
                />
              </div>

              {creando && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contraseña * (mín. 6 caracteres)</label>
                  <input
                    type="password"
                    value={form.clave ?? ''}
                    onChange={(e) => setForm({ ...form, clave: e.target.value })}
                    className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    placeholder="••••••"
                  />
                </div>
              )}

              {editando && !restableciendoClave && (
                <div>
                  <button
                    type="button"
                    onClick={() => setRestableciendoClave(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    ¿El usuario olvidó su contraseña? Restablecer
                  </button>
                </div>
              )}

              {editando && restableciendoClave && (
                <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100 space-y-2 shadow-sm">
                  <label className="block text-xs font-semibold text-blue-900">Nueva contraseña * (mín. 6 caracteres)</label>
                  <input
                    type="password"
                    value={form.clave ?? ''}
                    onChange={(e) => setForm({ ...form, clave: e.target.value })}
                    className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    placeholder="Nueva contraseña"
                    autoFocus
                  />
                  <div>
                    <button
                      type="button"
                      onClick={() => setRestableciendoClave(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Cancelar restablecimiento
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre completo *</label>
                <input
                  value={form.nombre ?? ''}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  placeholder="Nombre y apellidos"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rol *</label>
                <select
                  value={form.rol_id ?? ''}
                  onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
                  className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                >
                  <option value="">-- Seleccionar --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Área</label>
                <select
                  value={form.id_area ?? ''}
                  onChange={(e) => setForm({ ...form, id_area: e.target.value })}
                  className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                >
                  <option value="">-- Sin área --</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.area}</option>
                  ))}
                </select>
              </div>

              {editando && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Estatus</label>
                  <select
                    value={form.status ?? '1'}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="border border-blue-200 rounded-md p-2 w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2.5 text-red-700 text-sm rounded-r shadow-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-blue-100">
              <button onClick={() => { setCreando(false); setEditando(null); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={enviando}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 transition-colors shadow-sm"
              >
                {enviando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}