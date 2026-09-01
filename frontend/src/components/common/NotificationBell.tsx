import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  getNotificaciones,
  getContadorNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLeidas,
} from '../../services/notificacionService';
import type { NotificacionItem } from '../../types/Notificacion';

const ICONOS: Record<string, string> = {
  mantenimiento: '🛠️',
  solicitud: '📝',
};

function tiempoRelativo(fecha: string): string {
  const diffMs = Date.now() - new Date(fecha).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  return `hace ${Math.floor(horas / 24)} d`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificacionItem[]>([]);
  const [contador, setContador] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const cargarContador = () => {
    getContadorNotificaciones().then(setContador).catch(() => {});
  };

  useEffect(() => {
    cargarContador();
    const t = setInterval(cargarContador, 30000); // poll cada 30s
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    getNotificaciones().then((data) => {
      setItems(data);
      setContador(data.filter((n) => !n.leida).length); // sincroniza el badge al abrir
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggle = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left - 280 });
    }
    setOpen((o) => !o);
  };

  const handleClickNotif = async (n: NotificacionItem) => {
    if (!n.leida) {
      await marcarNotificacionLeida(n.id);
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: 1 } : x)));
      setContador((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    if (n.url) navigate(n.url);
  };

  const handleMarcarTodas = async () => {
    await marcarTodasLeidas();
    setItems((prev) => prev.map((x) => ({ ...x, leida: 1 })));
    setContador(0);
  };

  return (
    <>
      <button ref={btnRef} onClick={toggle} className="relative px-3 py-4 hover:bg-blue-950 transition-colors">
        <span className="text-xl">🔔</span>
        {contador > 0 && (
          <span className="absolute top-2 right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {contador > 9 ? '9+' : contador}
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: coords.top, left: Math.max(8, coords.left) }}
          className="bg-white text-gray-800 shadow-2xl rounded-b-lg w-80 max-h-96 overflow-y-auto z-[9999] border border-blue-200"
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-blue-100 sticky top-0 bg-white shadow-xs">
            <span className="font-semibold text-sm text-blue-950">Notificaciones</span>
            {contador > 0 && (
              <button onClick={handleMarcarTodas} className="text-xs text-blue-700 hover:underline font-medium">
                Marcar todas leídas
              </button>
            )}
          </div>

          {items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Sin notificaciones</p>
          )}

          <div className="divide-y divide-blue-50">
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => handleClickNotif(n)}
                className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50/40 transition-colors ${!n.leida ? 'bg-blue-50/70' : ''}`}
              >
                <span className="text-lg">{ICONOS[n.tipo] ?? '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate text-gray-800 ${!n.leida ? 'font-semibold text-blue-950' : ''}`}>{n.titulo}</p>
                  {n.mensaje && <p className="text-xs text-gray-500 truncate">{n.mensaje}</p>}
                  <p className="text-[11px] text-gray-400 mt-0.5">{tiempoRelativo(n.created_at)}</p>
                </div>
                {!n.leida && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5 shadow-xs" />}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}