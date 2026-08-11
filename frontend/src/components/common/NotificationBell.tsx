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
    getNotificaciones().then(setItems);

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
      <button ref={btnRef} onClick={toggle} className="relative px-3 py-4 hover:bg-purple-700">
        <span className="text-xl">🔔</span>
        {contador > 0 && (
          <span className="absolute top-2 right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {contador > 9 ? '9+' : contador}
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: coords.top, left: Math.max(8, coords.left) }}
          className="bg-white text-gray-800 shadow-xl rounded-b w-80 max-h-96 overflow-y-auto z-[9999] border"
        >
          <div className="flex justify-between items-center px-3 py-2 border-b sticky top-0 bg-white">
            <span className="font-semibold text-sm">Notificaciones</span>
            {contador > 0 && (
              <button onClick={handleMarcarTodas} className="text-xs text-purple-700 hover:underline">
                Marcar todas leídas
              </button>
            )}
          </div>

          {items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Sin notificaciones</p>
          )}

          {items.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClickNotif(n)}
              className={`flex gap-2 px-3 py-2 border-b cursor-pointer hover:bg-gray-50 ${!n.leida ? 'bg-blue-50' : ''}`}
            >
              <span className="text-lg">{ICONOS[n.tipo] ?? '🔔'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${!n.leida ? 'font-semibold' : ''}`}>{n.titulo}</p>
                {n.mensaje && <p className="text-xs text-gray-500 truncate">{n.mensaje}</p>}
                <p className="text-[11px] text-gray-400 mt-0.5">{tiempoRelativo(n.created_at)}</p>
              </div>
              {!n.leida && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}