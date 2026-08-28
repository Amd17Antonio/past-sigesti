import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATALOGOS } from '../components/catalogos/CatalogosConfig';
import { CATALOGO_A_GRUPO } from '../components/catalogos/catalogosGrupoMap';
import { getCatalogo, crearRegistroCatalogo, actualizarRegistroCatalogo, eliminarRegistroCatalogo } from '../services/catalogoService';
import SortIcon from '../components/common/SortIcon';

interface Registro { id: number; _activo?: boolean; [key: string]: any }

export default function CatalogoGenerico() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const config = CATALOGOS.find((c) => c.slug === slug);
  const grupoDestino = CATALOGO_A_GRUPO[slug ?? ''] ?? '/catalogos/usuarios';

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [tieneEstatus, setTieneEstatus] = useState(false);
  const [opcionesSelect, setOpcionesSelect] = useState<Record<string, Registro[]>>({});
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editando, setEditando] = useState<Registro | null>(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = () => {
    if (!slug) return;
    getCatalogo(slug).then((r) => {
      setRegistros(r.registros);
      setTieneEstatus(!!r.tieneEstatus);
    });
  };

  useEffect(() => {
    cargar();
    setFiltros({});
    setSortKey(null);
  }, [slug]);

  useEffect(() => {
    if (!config) return;
    config.campos.forEach((campo) => {
      if (campo.tipo === 'select' && campo.opciones) {
        getCatalogo(campo.opciones).then((r) => {
          setOpcionesSelect((prev) => ({ ...prev, [campo.opciones as string]: r.registros }));
        });
      }
    });
  }, [config]);

  if (!config) {
    return <div className="p-6 text-red-500">Catálogo no encontrado.</div>;
  }

  // Para "modelos": no mostrar la columna cruda "id_marca" (select), sino el nombre
  // de la marca ya resuelto (marca_nombre) que trae el join del backend. Así solo
  // aparece una columna "Marca" en vez de dos.
  const columnas = slug === 'modelos'
    ? [
        ...config.campos.filter((c) => c.name !== 'id_marca'),
        { name: 'marca_nombre', label: 'Marca' },
      ]
    : config.campos;

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtrados = registros.filter((r) =>
    columnas.every((c) => {
      const f = filtros[c.name];
      if (!f) return true;
      return String(r[c.name] ?? '').toLowerCase().includes(f.toLowerCase());
    })
  );

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

  const abrirCrear = () => {
    const inicial: Record<string, string> = {};
    config.campos.forEach((c) => (inicial[c.name] = ''));
    setForm(inicial);
    setError('');
    setCreando(true);
  };

  const abrirEditar = (r: Registro) => {
    const inicial: Record<string, string> = {};
    config.campos.forEach((c) => (inicial[c.name] = r[c.name] ?? ''));
    setForm(inicial);
    setError('');
    setEditando(r);
  };

  const handleGuardar = async () => {
    const faltante = config.campos.find((c) => c.required && !form[c.name]);
    if (faltante) {
      setError(`El campo "${faltante.label}" es obligatorio.`);
      return;
    }
    setEnviando(true);
    setError('');
    try {
      if (editando) {
        await actualizarRegistroCatalogo(slug!, editando.id, form);
      } else {
        await crearRegistroCatalogo(slug!, form);
      }
      setEditando(null);
      setCreando(false);
      cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo guardar.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (r: Registro) => {
    const accion = tieneEstatus ? 'dar de baja' : 'eliminar';
    if (!window.confirm(`¿Seguro que quieres ${accion} este registro?`)) return;
    try {
      await eliminarRegistroCatalogo(slug!, r.id);
      cargar();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'No se pudo eliminar.');
    }
  };

  const modalAbierto = creando || !!editando;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(grupoDestino)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded mb-4"
      >
        ← Regresar
      </button>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{config.titulo}</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">+ Agregar</button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            {columnas.map((c) => (
              <th key={c.name} className="p-2 text-left cursor-pointer" onClick={() => handleSort(c.name)}>
                <span className="inline-flex items-center">{c.label}<SortIcon active={sortKey === c.name} direction={sortDir} /></span>
              </th>
            ))}
            {tieneEstatus && <th className="p-2 text-left">Estatus</th>}
            <th className="p-2 text-left">Acciones</th>
          </tr>
          <tr className="bg-gray-50">
            {columnas.map((c) => (
              <th key={c.name} className="p-1">
                <input
                  value={filtros[c.name] ?? ''}
                  onChange={(e) => setFiltros({ ...filtros, [c.name]: e.target.value })}
                  className="border p-1 w-full text-xs font-normal"
                />
              </th>
            ))}
            {tieneEstatus && <th></th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ordenados.map((r) => (
            <tr key={r.id} className="border-t">
              {columnas.map((c) => (
                <td key={c.name} className="p-2">{r[c.name] ?? '-'}</td>
              ))}
              {tieneEstatus && (
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${r._activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {r._activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              )}
              <td className="p-2 flex gap-2">
                <button onClick={() => abrirEditar(r)} title="Editar">✏️</button>
                <button onClick={() => handleEliminar(r)} title={tieneEstatus ? 'Dar de baja' : 'Eliminar'}>🗑</button>
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
              {editando ? 'Editar' : 'Agregar'} — {config.titulo}
            </div>
            <div className="p-4 space-y-3">
              {config.campos.map((c) => (
                <div key={c.name}>
                  <label className="text-sm font-medium">{c.label}{c.required && ' *'}:</label>
                  {c.tipo === 'select' ? (
                    <select
                      value={form[c.name] ?? ''}
                      onChange={(e) => setForm({ ...form, [c.name]: e.target.value })}
                      className="border p-2 w-full mt-1"
                    >
                      <option value="">--Seleccionar--</option>
                      {(opcionesSelect[c.opciones ?? ''] ?? []).map((op) => (
                        <option key={op.id} value={op.id}>
                          {op[CATALOGOS.find((k) => k.slug === c.opciones)?.campoLabel ?? 'id']}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form[c.name] ?? ''}
                      onChange={(e) => setForm({ ...form, [c.name]: e.target.value })}
                      className="border p-2 w-full mt-1"
                    />
                  )}
                </div>
              ))}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50">
              <button onClick={() => { setEditando(null); setCreando(false); }} className="px-4 py-2 border rounded text-sm">Cancelar</button>
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
