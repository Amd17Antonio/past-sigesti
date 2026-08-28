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
  
  const config = useMemo(() => CATALOGOS.find((c) => c.slug === slug), [slug]);
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
    }).catch(() => {
      setRegistros([]);
    });
  };

  useEffect(() => {
    cargar();
    setFiltros({});
    setSortKey(null);
  }, [slug]);

  // Cargar catálogos relacionales para los selects del formulario
  useEffect(() => {
    if (!config) return;
    config.campos.forEach((campo) => {
      if (campo.tipo === 'select' && campo.opciones) {
        getCatalogo(campo.opciones).then((r) => {
          setOpcionesSelect((prev) => ({ ...prev, [campo.opciones as string]: r.registros }));
        }).catch(() => {});
      }
    });
  }, [config]);

  if (!config) {
    return <div className="p-6 text-red-500">Catálogo no encontrado.</div>;
  }

  // Ocultar columna id_marca en modelos si viene el join de backend
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
    config.campos.forEach((c) => (inicial[c.name] = String(r[c.name] ?? '')));
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
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded mb-4 transition-colors"
      >
        ← Regresar
      </button>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">{config.titulo}</h1>
        <button onClick={abrirCrear} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
          + Agregar
        </button>
      </div>

      <div className="overflow-x-auto border rounded bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              {columnas.map((c) => (
                <th key={c.name} className="p-3 cursor-pointer select-none hover:bg-gray-200" onClick={() => handleSort(c.name)}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <SortIcon active={sortKey === c.name} direction={sortDir} />
                  </span>
                </th>
              ))}
              {tieneEstatus && <th className="p-3">Estatus</th>}
              <th className="p-3">Acciones</th>
            </tr>
            <tr className="bg-gray-50 border-t">
              {columnas.map((c) => (
                <th key={c.name} className="p-2">
                  <input
                    value={filtros[c.name] ?? ''}
                    onChange={(e) => setFiltros({ ...filtros, [c.name]: e.target.value })}
                    placeholder={`Filtrar...`}
                    className="border rounded p-1 w-full text-xs font-normal focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </th>
              ))}
              {tieneEstatus && <th></th>}
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ordenados.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                {columnas.map((c) => (
                  <td key={c.name} className="p-3 text-gray-700">{r[c.name] ?? '-'}</td>
                ))}
                {tieneEstatus && (
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${r._activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {r._activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                )}
                <td className="p-3 flex gap-3 items-center">
                  <button onClick={() => abrirEditar(r)} title="Editar" className="hover:scale-110 transition-transform">✏️</button>
                  <button onClick={() => handleEliminar(r)} title={tieneEstatus ? 'Dar de baja' : 'Eliminar'} className="hover:scale-110 transition-transform">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordenados.length === 0 && <p className="text-gray-500 mt-4 text-center">Sin resultados encontrados.</p>}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-blue-600 text-white px-4 py-3 font-semibold flex justify-between items-center">
              <span>{editando ? 'Editar' : 'Agregar'} — {config.titulo}</span>
              <button onClick={() => { setEditando(null); setCreando(false); }} className="text-white hover:text-gray-200 font-bold">✕</button>
            </div>
            
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {config.campos.map((c) => {
                const configRelacionada = CATALOGOS.find((k) => k.slug === c.opciones);
                const campoLabelRef = configRelacionada?.campoLabel ?? 'nombre';

                return (
                  <div key={c.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {c.label}{c.required && <span className="text-red-500"> *</span>}
                    </label>
                    
                    {c.tipo === 'select' ? (
                      <select
                        value={form[c.name] ?? ''}
                        onChange={(e) => setForm({ ...form, [c.name]: e.target.value })}
                        className="border rounded-md p-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        <option value="">-- Seleccionar --</option>
                        {(opcionesSelect[c.opciones ?? ''] ?? []).map((op) => (
                          <option key={op.id} value={op.id}>
                            {op[campoLabelRef] ?? op.nombre ?? op.id}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={String(c.tipo) === 'number' ? 'number' : 'text'}
                        value={form[c.name] ?? ''}
                        onChange={(e) => setForm({ ...form, [c.name]: e.target.value })}
                        className="border rounded-md p-2 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={`Ingrese ${c.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                );
              })}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 px-5 py-3 bg-gray-50 border-t">
              <button 
                onClick={() => { setEditando(null); setCreando(false); }} 
                className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
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