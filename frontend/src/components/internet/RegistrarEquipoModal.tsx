import { useEffect, useState } from 'react';
import { getCatalogo, crearItemCatalogo, crearModelo } from '../../services/catalogoService';
import { registrarEquipo, verificarSerie } from '../../services/equipoService';
import SelectConAgregar from '../common/SelectConAgregar';

interface Opcion { id: number; [key: string]: any }

interface Props {
  // Compatibilidad con quien todavía llame al modal solo con "noInventario"
  // (ej. NuevaSolicitudInternetModal, que siempre busca por inventario)
  noInventario?: string;
  // Nueva forma: se indica qué se buscó y con qué valor, para autorrellenar
  // el campo correcto (Inventario o Serie) en este formulario.
  valorBusqueda?: string;
  tipoBusqueda?: 'inventario' | 'serie';
  onClose: () => void;
  onRegistrado: (equipo: any) => void;
}

export default function RegistrarEquipoModal({
  noInventario, valorBusqueda, tipoBusqueda = 'inventario', onClose, onRegistrado,
}: Props) {
  // Si viene el prop viejo "noInventario", se respeta como búsqueda por inventario.
  const valor = valorBusqueda ?? noInventario ?? '';
  const esBusquedaPorSerie = tipoBusqueda === 'serie';

  const [tipos, setTipos] = useState<Opcion[]>([]);
  const [marcas, setMarcas] = useState<Opcion[]>([]);
  const [modelos, setModelos] = useState<Opcion[]>([]);
  const [sos, setSos] = useState<Opcion[]>([]);
  const [form, setForm] = useState({
    id_tipo: '',
    id_marca: '',
    id_modelo: '',
    id_so: '',
    no_serie: esBusquedaPorSerie ? valor : '',
    no_inventario: esBusquedaPorSerie ? '' : valor,
    observacion: '',
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [serieDisponible, setSerieDisponible] = useState<boolean | null>(null);
  const [verificando, setVerificando] = useState(false);

  const cargarCatalogos = () => {
    getCatalogo('tipo-equipo').then((r) => setTipos(r.registros));
    getCatalogo('marcas').then((r) => setMarcas(r.registros));
    getCatalogo('modelos').then((r) => setModelos(r.registros));
    getCatalogo('so').then((r) => setSos(r.registros));
  };

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInventarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, no_inventario: e.target.value });
  };

  const handleSerieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setForm({ ...form, no_serie: valor });
    setSerieDisponible(null);
  };

  const handleSerieBlur = async () => {
    if (!form.no_serie || form.no_serie.toUpperCase() === 'S/N') {
      setSerieDisponible(null);
      return;
    }
    setVerificando(true);
    try {
      const disponible = await verificarSerie(form.no_serie);
      setSerieDisponible(disponible);
    } finally {
      setVerificando(false);
    }
  };

  const handleUsarSN = () => {
    setForm({ ...form, no_serie: 'S/N' });
    setSerieDisponible(null);
  };

  const handleGuardar = async () => {
    setError('');
    if (!form.id_tipo || !form.id_marca || !form.id_modelo || !form.id_so) {
      setError('Completa tipo, marca, modelo y sistema operativo.');
      return;
    }
    if (!form.no_inventario.trim()) {
      setError('El número de inventario es obligatorio.');
      return;
    }
    if (serieDisponible === false) {
      setError('Ese número de serie ya está registrado en otro equipo.');
      return;
    }
    setEnviando(true);
    try {
      const equipo = await registrarEquipo({
        id_tipo: Number(form.id_tipo),
        id_marca: Number(form.id_marca),
        id_modelo: Number(form.id_modelo),
        id_so: Number(form.id_so),
        no_serie: form.no_serie || undefined,
        no_inventario: form.no_inventario.trim(),
        observacion: form.observacion || undefined,
      });
      onRegistrado(equipo);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo registrar el equipo');
    } finally {
      setEnviando(false);
    }
  };

  const marcaSeleccionadaId = form.id_marca ? Number(form.id_marca) : null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded shadow-lg w-[26rem] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold">Registrar Equipo</div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {esBusquedaPorSerie && (
            <p className="text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded p-2">
              Buscaste por número de serie — se autocompletó ese campo. Captura el número de inventario para completar el registro.
            </p>
          )}

          <SelectConAgregar
            label="Tipo Equipo"
            opciones={tipos}
            campoTexto="TipoEquipo"
            value={form.id_tipo}
            onChange={(id) => setForm({ ...form, id_tipo: id })}
            onAgregar={async (texto) => {
              const nuevo = await crearItemCatalogo('tipo-equipo', texto, 'TipoEquipo');
              cargarCatalogos();
              return { id: nuevo.id, TipoEquipo: texto };
            }}
          />

          <SelectConAgregar
            label="Marca"
            opciones={marcas}
            campoTexto="marca"
            value={form.id_marca}
            onChange={(id) => setForm({ ...form, id_marca: id, id_modelo: '' })}
            onAgregar={async (texto) => {
              const nuevo = await crearItemCatalogo('marcas', texto, 'marca');
              cargarCatalogos();
              return { id: nuevo.id, marca: texto };
            }}
          />

          <SelectConAgregar
            label="Modelo"
            opciones={marcaSeleccionadaId ? modelos.filter((m) => m.id_marca === marcaSeleccionadaId) : modelos}
            campoTexto="modelo"
            value={form.id_modelo}
            onChange={(id) => setForm({ ...form, id_modelo: id })}
            onAgregar={async (texto) => {
              if (!marcaSeleccionadaId) {
                throw new Error('Selecciona primero una marca');
              }
              const nuevo = await crearModelo(texto, marcaSeleccionadaId);
              cargarCatalogos();
              return { id: nuevo.id, modelo: texto };
            }}
          />

          <div>
            <label className="text-sm font-medium">No. Serie:</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                name="no_serie"
                value={form.no_serie}
                onChange={handleSerieChange}
                onBlur={handleSerieBlur}
                readOnly={esBusquedaPorSerie}
                className={`border p-2 flex-1 ${esBusquedaPorSerie ? 'bg-gray-100 text-gray-500' : ''}`}
              />
              {!esBusquedaPorSerie && (
                <button
                  type="button"
                  onClick={handleUsarSN}
                  className="text-blue-600 text-sm border border-blue-600 rounded px-2 py-1 hover:bg-blue-50"
                  title="Este equipo no tiene número de serie"
                >
                  S/N
                </button>
              )}
            </div>
            {verificando && <p className="text-xs text-gray-400 mt-1">Verificando...</p>}
            {serieDisponible === false && <p className="text-xs text-red-500 mt-1">Ese número de serie ya existe.</p>}
            {serieDisponible === true && <p className="text-xs text-green-600 mt-1">Disponible.</p>}
          </div>

          <div>
            <label className="text-sm font-medium">No. Inventario:</label>
            {esBusquedaPorSerie ? (
              <input
                name="no_inventario"
                value={form.no_inventario}
                onChange={handleInventarioChange}
                placeholder="Captura el número de inventario"
                className="border p-2 w-full mt-1"
              />
            ) : (
              <input readOnly value={form.no_inventario} className="border p-2 w-full mt-1 bg-gray-100 text-gray-500" />
            )}
          </div>

          <SelectConAgregar
            label="Sistema Operativo"
            opciones={sos}
            campoTexto="sistema"
            value={form.id_so}
            onChange={(id) => setForm({ ...form, id_so: id })}
            onAgregar={async (texto) => {
              const nuevo = await crearItemCatalogo('so', texto, 'sistema');
              cargarCatalogos();
              return { id: nuevo.id, sistema: texto };
            }}
          />

          <div>
            <label className="text-sm font-medium">Observaciones:</label>
            <input name="observacion" value={form.observacion} onChange={handleChange} className="border p-2 w-full mt-1" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-orange-500 text-white rounded text-sm">✕ Cancelar</button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-green-600 text-white rounded text-sm disabled:opacity-50">
            💾 {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
