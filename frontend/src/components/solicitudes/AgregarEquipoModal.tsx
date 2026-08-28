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
      setIdEquipoSolicitudVinculado(res.id_equipo_solicitud);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error al vincular el equipo');
      setGuardando(false);
    }
  };

  const handleEquipoRegistrado = (_equipo: any) => {
    setMostrarRegistro(false);
    vincular(_equipo.id);
  };

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-blue-100 overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span>Agregar equipo a la solicitud</span>
          <button onClick={onClose} className="text-blue-100 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">No. Inventario o No. Serie</label>
            <div className="flex gap-2">
              <input
                className="border border-slate-300 rounded p-2 w-full text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={valorBusqueda}
                onChange={(e) => { setValorBusqueda(e.target.value); setBuscado(false); setPreguntandoTipo(false); }}
                onKeyDown={(e) => e.key === 'Enter' && buscar()}
                placeholder="Ej. 1168865 o SN-A1B2C3"
                autoFocus
              />
              <button
                onClick={buscar}
                disabled={!valorBusqueda.trim() || buscando}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 whitespace-nowrap transition-colors shadow-sm"
              >
                {buscando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>

          {buscado && equipoEncontrado && (
            <div className="border border-emerald-200 rounded p-4 bg-emerald-50/60 space-y-3">
              <p className="text-sm text-slate-700">
                ✅ Equipo encontrado: <strong className="text-slate-900">{equipoEncontrado.tipo}</strong> {equipoEncontrado.marca} {equipoEncontrado.modelo} — <span className="text-slate-600">{equipoEncontrado.sistema}</span>
              </p>

              {equipoEncontrado.ya_sugerido_baja && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  ⚠ Este equipo ya cuenta con un dictamen que sugiere baja.
                </div>
              )}

              <button
                onClick={() => vincular(equipoEncontrado.id)}
                disabled={guardando}
                className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-sm text-sm font-medium"
              >
                {guardando ? 'Vinculando...' : 'Vincular este equipo'}
              </button>
            </div>
          )}

          {buscado && !equipoEncontrado && !preguntandoTipo && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded">
              <p className="text-sm text-amber-800 mb-3">
                ⚠️ No se encontró ningún equipo con ese número.
              </p>
              <button
                onClick={handleDeseaRegistrar}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors shadow-sm"
              >
                + Registrar equipo nuevo
              </button>
            </div>
          )}

          {preguntandoTipo && (
            <div className="border border-blue-200 rounded p-4 bg-blue-50/60 space-y-3">
              <p className="text-sm text-slate-700">
                El número <strong className="text-slate-900">{valorBusqueda.trim()}</strong> que ingresaste, ¿es de Inventario o de Serie?
              </p>
              <div className="flex gap-2">
                <button onClick={() => confirmarTipoYRegistrar('inventario')} className="flex-1 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors shadow-sm">
                  Es No. de Inventario
                </button>
                <button onClick={() => confirmarTipoYRegistrar('serie')} className="flex-1 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors shadow-sm">
                  Es No. de Serie
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-sm text-slate-700 transition-colors">
            Cerrar
          </button>
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