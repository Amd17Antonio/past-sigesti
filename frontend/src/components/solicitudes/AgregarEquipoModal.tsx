import { useState } from 'react';
import { buscarEquipo } from '../../services/equipoService';
import { agregarEquipoSolicitud } from '../../services/solicitudUieService';
import RegistrarEquipoModal from '../internet/RegistrarEquipoModal';

export default function AgregarEquipoModal({
  idSolicitud, onClose, onSaved,
}: { idSolicitud: number; onClose: () => void; onSaved: () => void }) {
  const [noInventario, setNoInventario] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [equipoEncontrado, setEquipoEncontrado] = useState<any>(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = async () => {
    if (!noInventario.trim()) return;
    setBuscando(true);
    setBuscado(false);
    setError(null);
    try {
      const data = await buscarEquipo(noInventario.trim());
      setEquipoEncontrado(data);
      setMostrarRegistro(false);
    } catch {
      setEquipoEncontrado(null);
      setMostrarRegistro(true);
    } finally {
      setBuscando(false);
      setBuscado(true);
    }
  };

  const vincular = async (idEquipo: number) => {
    setGuardando(true);
    setError(null);
    try {
      await agregarEquipoSolicitud(idSolicitud, idEquipo);
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error al vincular el equipo');
      setGuardando(false);
    }
  };

  // Callback de RegistrarEquipoModal: al registrar, vincula automáticamente
  const handleEquipoRegistrado = (equipo: any) => {
    setMostrarRegistro(false);
    vincular(equipo.id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Agregar equipo a la solicitud</h2>

        <label className="block text-sm mb-1">No. Inventario</label>
        <div className="flex gap-2 mb-4">
          <input
            className="border rounded w-full px-2 py-1"
            value={noInventario}
            onChange={(e) => { setNoInventario(e.target.value); setBuscado(false); }}
            onKeyDown={(e) => e.key === 'Enter' && buscar()}
            placeholder="Ej. 1168865"
            autoFocus
          />
          <button
            onClick={buscar}
            disabled={!noInventario.trim() || buscando}
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
            <button
              onClick={() => vincular(equipoEncontrado.id)}
              disabled={guardando}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {guardando ? 'Vinculando...' : 'Vincular este equipo'}
            </button>
          </div>
        )}

        {buscado && !equipoEncontrado && !mostrarRegistro && (
          <p className="text-sm text-amber-700 mb-4">
            ⚠️ No se encontró ese número de inventario.
          </p>
        )}

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cerrar</button>
        </div>
      </div>

      {mostrarRegistro && (
        <RegistrarEquipoModal
          noInventario={noInventario.trim()}
          onClose={() => setMostrarRegistro(false)}
          onRegistrado={handleEquipoRegistrado}
        />
      )}
    </div>
  );
}