import { useState } from 'react';
import { buscarEquipo, buscarEquipoPorSerie } from '../../services/equipoService';
import { agregarEquipoSolicitud } from '../../services/solicitudUieService';
import RegistrarEquipoModal from '../internet/RegistrarEquipoModal';
import ChecklistMantenimientoModal from './ChecklistMantenimientoModal';

type TipoBusqueda = 'inventario' | 'serie';

export default function AgregarEquipoModal({
  idSolicitud, onClose, onSaved,
}: { idSolicitud: number; onClose: () => void; onSaved: () => void }) {
  const [valorBusqueda, setValorBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [equipoEncontrado, setEquipoEncontrado] = useState<any>(null);
  const [preguntandoTipo, setPreguntandoTipo] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState<TipoBusqueda>('inventario');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: control del checklist post-vinculación
  const [idEquipoSolicitudVinculado, setIdEquipoSolicitudVinculado] = useState<number | null>(null);

  const buscar = async () => {
    if (!valorBusqueda.trim()) return;
    setBuscando(true);
    setBuscado(false);
    setPreguntandoTipo(false);
    setEquipoEncontrado(null);
    setError(null);

    const valor = valorBusqueda.trim();

    try {
      const data = await buscarEquipo(valor);
      setEquipoEncontrado(data);
    } catch {
      try {
        const data = await buscarEquipoPorSerie(valor);
        setEquipoEncontrado(data);
      } catch {
        setEquipoEncontrado(null);
      }
    } finally {
      setBuscando(false);
      setBuscado(true);
    }
  };

  const handleDeseaRegistrar = () => {
    const deseaRegistrar = window.confirm(
      'No se encontró ningún equipo con ese número. ¿Deseas registrarlo como equipo nuevo?'
    );
    if (deseaRegistrar) {
      setPreguntandoTipo(true);
    }
  };

  const confirmarTipoYRegistrar = (tipo: TipoBusqueda) => {
    setTipoBusqueda(tipo);
    setPreguntandoTipo(false);
    setMostrarRegistro(true);
  };

  const vincular = async (idEquipo: number) => {
    setGuardando(true);
    setError(null);
    try {
      const res = await agregarEquipoSolicitud(idSolicitud, idEquipo);

      if (res.ya_sugerido_baja) {
        window.alert('⚠ Este equipo ya cuenta con un dictamen que sugiere baja.');
      }

      onSaved();
      // En vez de cerrar de inmediato, abre el checklist de mantenimiento
      setIdEquipoSolicitudVinculado(res.id_equipo_solicitud);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error al vincular el equipo');
      setGuardando(false);
    }
  };

  const handleEquipoRegistrado = (equipo: any) => {
    setMostrarRegistro(false);
    vincular(equipo.id);
  };

  // Si ya se vinculó, mostramos el checklist en vez del buscador
  if (idEquipoSolicitudVinculado !== null) {
    return (
      <ChecklistMantenimientoModal
        idEquipoSolicitud={idEquipoSolicitudVinculado}
        onClose={onClose}
        onGuardado={onSaved}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Agregar equipo a la solicitud</h2>

        <label className="block text-sm mb-1">No. Inventario o No. Serie</label>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded w-full px-2 py-1"
            value={valorBusqueda}
            onChange={(e) => { setValorBusqueda(e.target.value); setBuscado(false); setPreguntandoTipo(false); }}
            onKeyDown={(e) => e.key === 'Enter' && buscar()}
            placeholder="Ej. 1168865 o SN-A1B2C3"
            autoFocus
          />
          <button
            onClick={buscar}
            disabled={!valorBusqueda.trim() || buscando}
            className="px-4 py-1 rounded bg-gray-700 text-white disabled:opacity-50 whitespace-nowrap"
          >
            {buscando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {buscado && equipoEncontrado && (
          <div className="border rounded p-3 mb-4 bg-green-50">
            <p className="text-sm mb-2">
              ✅ Equipo encontrado: <strong>{equipoEncontrado.tipo}</strong> {equipoEncontrado.marca} {equipoEncontrado.modelo} — {equipoEncontrado.sistema}
            </p>

            {/* NUEVO: alerta al buscar, antes de vincular */}
            {equipoEncontrado.ya_sugerido_baja && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
                ⚠ Este equipo ya cuenta con un dictamen que sugiere baja.
              </div>
            )}

            <button
              onClick={() => vincular(equipoEncontrado.id)}
              disabled={guardando}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {guardando ? 'Vinculando...' : 'Vincular este equipo'}
            </button>
          </div>
        )}

        {buscado && !equipoEncontrado && !preguntandoTipo && (
          <div className="mb-4">
            <p className="text-sm text-amber-700 mb-2">
              ⚠️ No se encontró ese número.
            </p>
            <button
              onClick={handleDeseaRegistrar}
              className="px-4 py-2 rounded bg-purple-800 text-white text-sm"
            >
              + Registrar equipo nuevo
            </button>
          </div>
        )}

        {preguntandoTipo && (
          <div className="border rounded p-3 mb-4 bg-blue-50">
            <p className="text-sm mb-3">
              El número <strong>{valorBusqueda.trim()}</strong> que ingresaste, ¿es de Inventario o de Serie?
            </p>
            <div className="flex gap-2">
              <button onClick={() => confirmarTipoYRegistrar('inventario')} className="px-4 py-2 rounded bg-blue-600 text-white text-sm">
                Es No. de Inventario
              </button>
              <button onClick={() => confirmarTipoYRegistrar('serie')} className="px-4 py-2 rounded bg-blue-600 text-white text-sm">
                Es No. de Serie
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cerrar</button>
        </div>
      </div>

      {mostrarRegistro && (
        <RegistrarEquipoModal
          valorBusqueda={valorBusqueda.trim()}
          tipoBusqueda={tipoBusqueda}
          onClose={() => setMostrarRegistro(false)}
          onRegistrado={handleEquipoRegistrado}
        />
      )}
    </div>
  );
}