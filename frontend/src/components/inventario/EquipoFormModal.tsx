import { useEffect, useState } from 'react';
import { getCatalogo } from '../../services/catalogoService';
import {
  registrarEquipo, actualizarEquipo, verificarSerie, type EquipoRow,
} from '../../services/equipoService';
import { formatMac, isValidMac } from '../../utils/mac';

interface Opcion { id: number; [key: string]: any }

interface Props {
  equipo: EquipoRow | null; // null = modo crear
  onClose: () => void;
  onGuardado: () => void;
}

export default function EquipoFormModal({ equipo, onClose, onGuardado }: Props) {
  const [tipos, setTipos] = useState<Opcion[]>([]);
  const [marcas, setMarcas] = useState<Opcion[]>([]);
  const [modelos, setModelos] = useState<Opcion[]>([]);
  const [sos, setSos] = useState<Opcion[]>([]);

  const [form, setForm] = useState({
    id_tipo: equipo?.id_tipo ? String(equipo.id_tipo) : '',
    id_marca: equipo?.id_marca ? String(equipo.id_marca) : '',
    id_modelo: equipo?.id_modelo ? String(equipo.id_modelo) : '',
    id_so: equipo?.id_so ? String(equipo.id_so) : '',
    no_serie: equipo?.no_serie ?? '',
    no_inventario: equipo?.no_inventario ?? '',
    observacion: equipo?.observacion ?? '',
  });
  const [macEthernet, setMacEthernet] = useState(equipo?.mac_ethernet ?? '');
  const [macWifi, setMacWifi] = useState(equipo?.mac_wifi ?? '');
  const [serieDisponible, setSerieDisponible] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getCatalogo('tipo-equipo').then((r) => setTipos(r.registros));
    getCatalogo('marcas').then((r) => setMarcas(r.registros));
    getCatalogo('modelos').then((r) => setModelos(r.registros));
    getCatalogo('so').then((r) => setSos(r.registros));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSerieBlur = async () => {
    if (!form.no_serie || form.no_serie.toUpperCase() === 'S/N') {
      setSerieDisponible(null);
      return;
    }
    if (equipo && equipo.no_serie === form.no_serie) {
      setSerieDisponible(null); // no cambió, no hace falta validar
      return;
    }
    const disponible = await verificarSerie(form.no_serie);
    setSerieDisponible(disponible);
  };

  const handleGuardar = async () => {
    setError('');
    if (!form.id_tipo || !form.id_marca || !form.no_inventario) {
      setError('Tipo, Marca y No. de Inventario son obligatorios.');
      return;
    }
    if (serieDisponible === false) {
      setError('Ese número de serie ya está registrado en otro equipo.');
      return;
    }
    if (macEthernet && !isValidMac(macEthernet)) {
      setError('La MAC Ethernet no tiene un formato válido.');
      return;
    }
    if (macWifi && !isValidMac(macWifi)) {
      setError('La MAC Wi-Fi no tiene un formato válido.');
      return;
    }

    setEnviando(true);
    try {
      if (equipo) {
        await actualizarEquipo(equipo.id, {
          id_tipo: Number(form.id_tipo),
          id_marca: Number(form.id_marca),
          id_modelo: form.id_modelo ? Number(form.id_modelo) : undefined,
          id_so: form.id_so ? Number(form.id_so) : undefined,
          no_serie: form.no_serie || undefined,
          no_inventario: form.no_inventario,
          mac_ethernet: macEthernet || undefined,
          mac_wifi: macWifi || undefined,
          observacion: form.observacion || undefined,
        });
      } else {
        await registrarEquipo({
          id_tipo: Number(form.id_tipo),
          id_marca: Number(form.id_marca),
          id_modelo: Number(form.id_modelo),
          id_so: Number(form.id_so),
          no_serie: form.no_serie || undefined,
          no_inventario: form.no_inventario,
          observacion: form.observacion || undefined,
        });
      }
      onGuardado();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No se pudo guardar el equipo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[26rem] max-h-[90vh] overflow-y-auto border border-blue-100">
        <div className="bg-blue-600 text-white px-5 py-3 font-semibold flex justify-between items-center">
          <span>{equipo ? `Editar equipo #${equipo.id}` : 'Nuevo Equipo'}</span>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Tipo Equipo:</label>
            <select name="id_tipo" value={form.id_tipo} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">--Seleccionar--</option>
              {tipos.map((t) => <option key={t.id} value={t.id}>{t.TipoEquipo}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Marca:</label>
            <select name="id_marca" value={form.id_marca} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">--Seleccionar--</option>
              {marcas.map((m) => <option key={m.id} value={m.id}>{m.marca}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Modelo:</label>
            <select name="id_modelo" value={form.id_modelo} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">--Seleccionar--</option>
              {modelos
                .filter((m) => !form.id_marca || m.id_marca === Number(form.id_marca))
                .map((m) => <option key={m.id} value={m.id}>{m.modelo}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">No. Serie:</label>
            <div className="flex gap-2 mt-1">
              <input
                name="no_serie" value={form.no_serie}
                onChange={(e) => { handleChange(e); setSerieDisponible(null); }}
                onBlur={handleSerieBlur}
                className="border border-slate-300 rounded p-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, no_serie: 'S/N' })}
                className="text-blue-600 border border-blue-600 hover:bg-blue-50 rounded px-3 text-sm transition-colors"
              >
                S/N
              </button>
            </div>
            {serieDisponible === false && <p className="text-xs text-red-500 mt-1">Ese número de serie ya existe.</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">No. Inventario:</label>
            <input name="no_inventario" value={form.no_inventario} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Sistema Operativo:</label>
            <select name="id_so" value={form.id_so} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">--Seleccionar--</option>
              {sos.map((s) => <option key={s.id} value={s.id}>{s.sistema}</option>)}
            </select>
          </div>

          {equipo && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700">MAC Ethernet:</label>
                <input
                  value={macEthernet}
                  onChange={(e) => setMacEthernet(formatMac(e.target.value))}
                  maxLength={17}
                  className="border border-slate-300 rounded p-2 w-full mt-1 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">MAC Wi-Fi:</label>
                <input
                  value={macWifi}
                  onChange={(e) => setMacWifi(formatMac(e.target.value))}
                  maxLength={17}
                  className="border border-slate-300 rounded p-2 w-full mt-1 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700">Observaciones:</label>
            <input name="observacion" value={form.observacion} onChange={handleChange} className="border border-slate-300 rounded p-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          {error && <p className="text-red-600 bg-red-50 p-2 rounded text-sm border border-red-200">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-100 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded text-sm text-slate-700 transition-colors">Cancelar</button>
          <button onClick={handleGuardar} disabled={enviando} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50 transition-colors shadow-sm">
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}