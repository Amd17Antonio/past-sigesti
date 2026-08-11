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
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-5">
        <h2 className="font-semibold text-lg mb-1">Mantenimiento — {equipo.no_inventario}</h2>
        <p className="text-sm text-gray-500 mb-4">{equipo.tipo} {equipo.marca}</p>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm font-medium">Fecha de servicio</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border rounded p-2 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Próximo mantenimiento</label>
            <input
              type="date"
              value={proximaFecha}
              onChange={(e) => setProximaFecha(e.target.value)}
              placeholder="Default: +6 meses"
              className="border rounded p-2 w-full text-sm"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="border rounded p-2 w-full text-sm">
            <option value="preventivo">Preventivo</option>
            <option value="correctivo">Correctivo</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border rounded p-2 w-full text-sm"
            rows={2}
          />
        </div>

        {historial.length > 0 && (
          <div className="mb-4 border-t pt-3">
            <p className="text-sm font-medium mb-2">Historial</p>
            <div className="max-h-32 overflow-y-auto text-xs space-y-1">
              {historial.map((h) => (
                <div key={h.id} className="flex justify-between text-gray-600">
                  <span>{h.fecha_mantenimiento} — {h.tipo ?? 'sin tipo'}</span>
                  <span>{h.usr}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm border rounded">Cancelar</button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="px-3 py-1.5 text-sm bg-purple-800 text-white rounded disabled:opacity-50"
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
    <div className="p-6">
      <div className="bg-blue-50 border px-4 py-2 font-semibold text-blue-900 rounded-t flex justify-between items-center">
        <span>Mantenimiento de equipos</span>
        <label className="text-sm font-normal flex items-center gap-1">
          <input type="checkbox" checked={soloAlerta} onChange={(e) => setSoloAlerta(e.target.checked)} />
          Solo equipos que requieren atención
        </label>
      </div>

      <div className="border-x px-3 py-2">
        <input
          value={noInventario}
          onChange={(e) => setNoInventario(e.target.value)}
          placeholder="Buscar por no. de inventario..."
          className="border rounded p-1.5 text-sm w-64"
        />
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Estatus</th>
            <th className="p-2 text-left">No. Inventario</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Marca</th>
            <th className="p-2 text-left">Resguardante</th>
            <th className="p-2 text-left">Último servicio</th>
            <th className="p-2 text-left">Próximo</th>
            <th className="p-2 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2" title={r.semaforo_motivo}>
                <span className={`inline-block w-3 h-3 rounded-full ${SEMAFORO_CLASES[r.semaforo_color]}`} />
              </td>
              <td className="p-2">{r.no_inventario ?? '-'}</td>
              <td className="p-2">{r.tipo ?? '-'}</td>
              <td className="p-2">{r.marca ?? '-'}</td>
              <td className="p-2">{r.Resguardante ?? r.Usuario ?? '-'}</td>
              <td className="p-2">{r.fecha_mantenimiento ?? '-'}</td>
              <td className="p-2">{r.proxima_fecha ?? '-'}</td>
              <td className="p-2">
                <button onClick={() => setSeleccionado(r)} className="text-purple-800 hover:underline text-xs">
                  Registrar servicio
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && <p className="text-gray-500 mt-4">Sin resultados</p>}

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center gap-2">
          <select value={porPagina} onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }} className="border rounded p-1">
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>Página {pagina} de {totalPaginas}</span>
          <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} className="px-2 py-1 border rounded disabled:opacity-40">◀</button>
          <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="px-2 py-1 border rounded disabled:opacity-40">▶</button>
          <button onClick={cargar} className="px-2 py-1 border rounded">↻</button>
        </div>
        <span>Mostrando {inicio} a {fin} de {total} elementos</span>
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