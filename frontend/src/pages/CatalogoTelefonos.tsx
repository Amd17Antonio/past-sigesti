import { useEffect, useMemo, useState } from 'react';
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
  const [registros, setRegistros] = useState<TelefonoRow[]>([]);
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof TelefonoRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<TelefonoRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = () => { getCatalogoTelefonos().then(setRegistros); };
  useEffect(() => { cargar(); }, []);

  const nombreCompleto = (r: TelefonoRow) =>
    [r.nombre, r.apellido_paterno, r.apellido_materno].filter(Boolean).join(' ');

  const handleSort = (key: keyof TelefonoRow) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtrados = registros.filter((r) => {
    const valores: Record<string, string> = {
      id: String(r.id), nombre: nombreCompleto(r), extension: r.extension ?? '',
      puesto: r.puesto ?? '', area: r.area ?? '', modelo: r.modelo ?? '', mac: r.mac ?? '',
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
    await eliminarTelefono(r.id);
    cargar();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Catálogo de Teléfonos</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {COLUMNAS.map((c) => (
              <th key={c.key} className="p-2 text-left cursor-pointer" onClick={() => handleSort(c.key)}>
                <span className="inline-flex items-center">{c.label}<SortIcon active={sortKey === c.key} direction={sortDir} /></span>
              </th>
            ))}
            <th className="p-2 text-left">Vinculado a</th>
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
          {ordenados.map((r) => (
            <tr key={r.id} className="border-t align-top">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{nombreCompleto(r)}</td>
              <td className="p-2">{r.extension}</td>
              <td className="p-2">{r.puesto ?? '-'}</td>
              <td className="p-2">{r.area ?? '-'}</td>
              <td className="p-2">{r.modelo ?? '-'}</td>
              <td className="p-2 font-mono text-xs">{r.mac ?? '-'}</td>
              <td className="p-2 text-xs">
                {r.total_solicitudes > 0 && <p>{r.total_solicitudes} solicitud(es)</p>}
                {r.vinculado_como_jefe_de && <p>Jefe de: {r.vinculado_como_jefe_de}</p>}
                {r.vinculado_como_secretaria_de && <p>Secretaria de: {r.vinculado_como_secretaria_de}</p>}
                {!r.total_solicitudes && !r.vinculado_como_jefe_de && !r.vinculado_como_secretaria_de && '-'}
              </td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${r.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {r.status}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <button onClick={() => abrirEditar(r)} title="Editar">✏️</button>
                <button onClick={() => handleEliminar(r)} title="Dar de baja línea">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ordenados.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      {editando && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-[26rem] overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 font-semibold">Editar línea telefónica</div>
            <div className="p-4 space-y-3">
              <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="border p-2 w-full" />
              <input placeholder="Apellido Paterno" value={form.apellido_paterno} onChange={(e) => setForm({ ...form, apellido_paterno: e.target.value })} className="border p-2 w-full" />
              <input placeholder="Apellido Materno" value={form.apellido_materno} onChange={(e) => setForm({ ...form, apellido_materno: e.target.value })} className="border p-2 w-full" />
              <input placeholder="Puesto" value={form.puesto} onChange={(e) => setForm({ ...form, puesto: e.target.value })} className="border p-2 w-full" />
              <input placeholder="Correo institucional" value={form.correo_institucional} onChange={(e) => setForm({ ...form, correo_institucional: e.target.value })} className="border p-2 w-full" />
              <input placeholder="Extensión" value={form.extension} onChange={(e) => setForm({ ...form, extension: e.target.value })} className="border p-2 w-full" />
              <input placeholder="Modelo" value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} className="border p-2 w-full" />
              <input placeholder="No. Serie" value={form.numero_serie} onChange={(e) => setForm({ ...form, numero_serie: e.target.value })} className="border p-2 w-full" />
              <input placeholder="MAC" value={form.mac} onChange={(e) => setForm({ ...form, mac: e.target.value })} className="border p-2 w-full font-mono" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Edificio" value={form.edificio} onChange={(e) => setForm({ ...form, edificio: e.target.value })} className="border p-2" />
                <input placeholder="Nivel" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} className="border p-2" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50">
              <button onClick={() => setEditando(null)} className="px-4 py-2 border rounded text-sm">Cancelar</button>
              <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50">
                {enviando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}