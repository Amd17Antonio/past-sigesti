import { useEffect, useState } from 'react';
import {
  getMantenimientos,
  getHistorialMantenimiento,
  registrarMantenimiento,
} from '../../services/mantenimientoService';
import type { EquipoConSemaforo, MantenimientoRegistro } from '../../types/Mantenimiento';

const SEMAFORO_CLASES: Record<string, string> = {
  rojo: 'bg-red-500',
  amarillo: 'bg-yellow-400',
  verde: 'bg-green-500',
};

function RegistrarMantenimientoModal({
  equipo,
  onClose,
  onGuardado,
}: {
  equipo: EquipoConSemaforo;
  onClose: () => void;
  onGuardado: () => void;
}) {
  const [historial, setHistorial] = useState<MantenimientoRegistro[]>([]);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [proximaFecha, setProximaFecha] = useState('');
  const [tipo, setTipo] = useState('preventivo');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getHistorialMantenimiento(equipo.id).then(setHistorial);
  }, [equipo.id]);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await registrarMantenimiento(equipo.id, {
        fecha_mantenimiento: fecha,
        proxima_fecha: proximaFecha || undefined,
        tipo,
        descripcion: descripcion || undefined,
      });
      onGuardado();
      onClose();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 border border-blue-200">
        <h2 className="font-bold text-lg text-blue-950 mb-1">Mantenimiento — {equipo.no_inventario}</h2>
        <p className="text-sm text-gray-500 mb-4">{equipo.tipo} {equipo.marca}</p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha de servicio</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border border-blue-200 rounded p-2 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Próximo mantenimiento</label>
            <input
              type="date"
              value={proximaFecha}
              onChange={(e) => setProximaFecha(e.target.value)}
              placeholder="Default: +6 meses"
              className="border border-blue-200 rounded p-2 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border border-blue-200 rounded p-2 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="preventivo">Preventivo</option>
            <option value="correctivo">Correctivo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border border-blue-200 rounded p-2 w-full text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            rows={2}
          />
        </div>

        {historial.length > 0 && (
          <div className="mb-4 border-t border-blue-100 pt-3">
            <p className="text-sm font-semibold text-blue-950 mb-2">Historial</p>
            <div className="max-h-32 overflow-y-auto text-xs space-y-1 pr-1">
              {historial.map((h) => (
                <div key={h.id} className="flex justify-between text-gray-600 border-b border-blue-50 pb-1">
                  <span>{h.fecha_mantenimiento} — {h.tipo ?? 'sin tipo'}</span>
                  <span className="font-medium text-blue-900">{h.usr}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-blue-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-blue-200 rounded hover:bg-blue-50 text-gray-700 transition shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm disabled:opacity-50 transition"
          >
            {guardando ? 'Guardando...' : 'Registrar mantenimiento'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MantenimientosList() {
  const [data, setData] = useState<EquipoConSemaforo[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [noInventario, setNoInventario] = useState('');
  const [soloAlerta, setSoloAlerta] = useState(false);
  const [seleccionado, setSeleccionado] = useState<EquipoConSemaforo | null>(null);

  const cargar = () => {
    getMantenimientos({
      pagina,
      por_pagina: porPagina,
      no_inventario: noInventario || undefined,
      solo_alerta: soloAlerta ? '1' : undefined,
    }).then((r) => {
      setData(r.registros);
      setTotal(r.total);
      setTotalPaginas(r.total_paginas);
    });
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, porPagina, soloAlerta]);

  useEffect(() => {
    const t = setTimeout(() => { setPagina(1); cargar(); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noInventario]);

  const inicio = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const fin = Math.min(pagina * porPagina, total);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-blue-900 border border-blue-200 px-5 py-3.5 font-bold text-white rounded-t-lg flex justify-between items-center shadow-sm">
        <span className="text-base">Mantenimiento de equipos</span>
        <label className="text-sm font-normal flex items-center gap-2 cursor-pointer text-blue-100">
          <input
            type="checkbox"
            checked={soloAlerta}
            onChange={(e) => setSoloAlerta(e.target.checked)}
            className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
          />
          Solo equipos que requieren atención
        </label>
      </div>

      <div className="border-x border-blue-200 bg-blue-50/20 px-5 py-3 border-b border-blue-100">
        <input
          value={noInventario}
          onChange={(e) => setNoInventario(e.target.value)}
          placeholder="Buscar por no. de inventario..."
          className="border border-blue-200 rounded p-2 text-sm w-72 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="overflow-x-auto border-x border-blue-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-white uppercase text-xs border-b border-blue-800">
            <tr>
              <th className="p-3 font-semibold">Estatus</th>
              <th className="p-3 font-semibold">No. Inventario</th>
              <th className="p-3 font-semibold">Tipo</th>
              <th className="p-3 font-semibold">Marca</th>
              <th className="p-3 font-semibold">Resguardante</th>
              <th className="p-3 font-semibold">Último servicio</th>
              <th className="p-3 font-semibold">Próximo</th>
              <th className="p-3 font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 bg-white">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="p-3" title={r.semaforo_motivo}>
                  <span className={`inline-block w-3.5 h-3.5 rounded-full shadow-xs ${SEMAFORO_CLASES[r.semaforo_color]}`} />
                </td>
                <td className="p-3 font-medium text-gray-800">{r.no_inventario ?? '-'}</td>
                <td className="p-3 text-gray-600">{r.tipo ?? '-'}</td>
                <td className="p-3 text-gray-600">{r.marca ?? '-'}</td>
                <td className="p-3 text-gray-600">{r.Resguardante ?? r.Usuario ?? '-'}</td>
                <td className="p-3 text-gray-600">{r.fecha_mantenimiento ?? '-'}</td>
                <td className="p-3 text-gray-600">{r.proxima_fecha ?? '-'}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSeleccionado(r)}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs"
                  >
                    Registrar servicio
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="bg-white border-x border-b border-blue-200 p-8 text-center rounded-b-lg">
          <p className="text-gray-500 text-sm">Sin resultados</p>
        </div>
      )}

      <div className="flex justify-between items-center px-5 py-4 border border-blue-200 bg-blue-50/20 rounded-b-lg text-sm text-gray-600 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <select
            value={porPagina}
            onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
            className="border border-blue-200 rounded p-1.5 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span className="text-xs font-medium text-gray-700">Página {pagina} de {totalPaginas}</span>
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="px-2.5 py-1 text-xs border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-40 transition shadow-sm"
          >
            ◀
          </button>
          <button
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
            className="px-2.5 py-1 text-xs border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-40 transition shadow-sm"
          >
            ▶
          </button>
          <button
            onClick={cargar}
            className="px-2.5 py-1 text-xs border border-blue-200 rounded hover:bg-blue-50 transition shadow-sm"
          >
            ↻
          </button>
        </div>
        <span className="text-xs font-medium text-gray-700">Mostrando {inicio} a {fin} de {total} elementos</span>
      </div>

      {seleccionado && (
        <RegistrarMantenimientoModal
          equipo={seleccionado}
          onClose={() => setSeleccionado(null)}
          onGuardado={cargar}
        />
      )}
    </div>
  );
}