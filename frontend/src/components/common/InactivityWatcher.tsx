import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TIEMPO_INACTIVIDAD_MS = 15 * 60 * 1000; // 15 minutos
const TIEMPO_AVISO_MS = 60 * 1000; // avisa 1 minuto antes de cerrar

const EVENTOS_ACTIVIDAD = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

export default function InactivityWatcher() {
  const { user, logout } = useAuth();
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const timeoutLogout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutAviso = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cerrarPorInactividad = async () => {
    setMostrarAviso(false);
    await logout();
    window.location.href = '/';
  };

  const reiniciarTemporizadores = () => {
    if (timeoutLogout.current) clearTimeout(timeoutLogout.current);
    if (timeoutAviso.current) clearTimeout(timeoutAviso.current);
    setMostrarAviso(false);

    timeoutAviso.current = setTimeout(() => {
      setMostrarAviso(true);
    }, TIEMPO_INACTIVIDAD_MS - TIEMPO_AVISO_MS);

    timeoutLogout.current = setTimeout(cerrarPorInactividad, TIEMPO_INACTIVIDAD_MS);
  };

  useEffect(() => {
    if (!user) return;

    reiniciarTemporizadores();

    EVENTOS_ACTIVIDAD.forEach((evento) =>
      window.addEventListener(evento, reiniciarTemporizadores)
    );

    return () => {
      EVENTOS_ACTIVIDAD.forEach((evento) =>
        window.removeEventListener(evento, reiniciarTemporizadores)
      );
      if (timeoutLogout.current) clearTimeout(timeoutLogout.current);
      if (timeoutAviso.current) clearTimeout(timeoutAviso.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!mostrarAviso) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
      <div className="bg-white rounded shadow-lg w-80 p-5 text-center">
        <p className="font-semibold text-gray-800 mb-2">¿Sigues ahí?</p>
        <p className="text-sm text-gray-600 mb-4">
          Tu sesión se cerrará en 1 minuto por inactividad.
        </p>
        <button
          onClick={reiniciarTemporizadores}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Seguir conectado
        </button>
      </div>
    </div>
  );
}
