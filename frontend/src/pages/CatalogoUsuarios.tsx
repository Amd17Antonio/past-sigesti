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
  const [clavesVisibles, setClavesVisibles] = useState<Set<number>>(new Set());

  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState<UsuarioRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = () => {
    getUsuarios().then(setUsuarios);
  };

  useEffect(() => {
    cargar();
    getRoles().then(setRoles);
    getCatalogo('areas').then((r) => setAreas(r.registros as AreaOption[]));
  }, []);

  const toggleClave = (id: number) => {
    setClavesVisibles((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrados, sortKey, sortDir]);

  const abrirCrear = () => {
    setForm({ usuario: '', clave: '', nombre: '', rol_id: '', id_area: '' });
    setError('');
    setCreando(true);
  };

  const abrirEditar = (u: UsuarioRow) => {
    setForm({
      usuario: u.usuario,
      clave: '',
      nombre: u.nombre,
      rol_id: String(u.rol_id),
      id_area: u.id_area ? String(u.id_area) : '',
      status: u.status ? '1' : '0',
    });
    setError('');
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
    setEnviando(true);
    setError('');
    try {
      if (editando) {
        await actualizarUsuario(editando.id, {
          usuario: form.usuario,
          clave: form.clave || undefined,
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
        <h1 className="text-xl font-bold">Usuarios del Sistema</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
          + Agregar Usuario
        </button>
      </div>

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
            <th className="p-2 text-left">Contraseña</th>
            <th className="p-2 text-left">Estatus</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
          <tr className="bg-gray-50">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-1">
                <input
                  value={filtros[c.key] ?? ''}
                  onChange={(e) => setFiltros({ ...filtros, [c.key]: e.target.value })}
                  className="border p-1 w-full text-xs font-normal"
                />
              </th>
            ))}
            <th></th><th></th><th></th>
          </tr>
        </thead>
        <tbody>
          {ordenados.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.usuario}</td>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.rol ?? '-'}</td>
              <td className="p-2">{u.area ?? '-'}</td>
              <td className="p-2 font-mono text-xs">
                <button onClick={() => toggleClave(u.id)} className="flex items-center gap-1">
                  {clavesVisibles.has(u.id) ? u.clave : '••••••••'}
                  <span className="text-xs">{clavesVisibles.has(u.id) ? '🙈' : '👁'}</span>
                </button>
              </td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${u.status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {u.status ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <button onClick={() => abrirEditar(u)} title="Editar">✏️</button>
                <button onClick={() => handleEliminar(u)} title="Dar de baja">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ordenados.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-96 overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
              {editando ? 'Editar usuario' : 'Agregar usuario'}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-sm font-medium">Usuario *:</label>
                <input
                  value={form.usuario ?? ''}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                  className="border p-2 w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Contraseña {editando ? '(dejar vacío para no cambiar)' : '* (mín. 6 caracteres)'}:
                </label>
                <input
                  type="text"
                  value={form.clave ?? ''}
                  onChange={(e) => setForm({ ...form, clave: e.target.value })}
                  className="border p-2 w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nombre completo *:</label>
                <input
                  value={form.nombre ?? ''}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="border p-2 w-full mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rol *:</label>
                <select
                  value={form.rol_id ?? ''}
                  onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
                  className="border p-2 w-full mt-1"
                >
                  <option value="">--Seleccionar--</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Área:</label>
                <select
                  value={form.id_area ?? ''}
                  onChange={(e) => setForm({ ...form, id_area: e.target.value })}
                  className="border p-2 w-full mt-1"
                >
                  <option value="">--Sin área--</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.area}</option>
                  ))}
                </select>
              </div>
              {editando && (
                <div>
                  <label className="text-sm font-medium">Estatus:</label>
                  <select
                    value={form.status ?? '1'}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="border p-2 w-full mt-1"
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50">
              <button onClick={() => { setCreando(false); setEditando(null); }} className="px-4 py-2 border rounded text-sm">
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={enviando}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50"
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