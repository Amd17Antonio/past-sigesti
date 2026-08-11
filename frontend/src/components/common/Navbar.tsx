import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CATALOGOS } from '../catalogos/CatalogosConfig';
import NotificationBell from './NotificationBell';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-4 text-sm font-medium whitespace-nowrap ${isActive ? 'bg-purple-800' : 'hover:bg-purple-700'}`;

interface DropdownProps {
  label: string;
  items: { to: string; label: string }[];
}

function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const actualizarPosicion = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom, left: rect.left });
    }
  };

  const toggle = () => {
    actualizarPosicion();
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleScrollResize = () => actualizarPosicion();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollResize, true);
    window.addEventListener('resize', handleScrollResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollResize, true);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="px-4 py-4 text-sm font-medium whitespace-nowrap hover:bg-purple-700 flex items-center gap-1"
      >
        {label} <span className="text-xs">▾</span>
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left }}
          className="bg-white text-gray-800 shadow-lg rounded-b min-w-[200px] z-[9999]"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-purple-50"
            >
              {item.label}
            </NavLink>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const rol = user?.rol?.nombre;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-purple-900 text-white relative z-40">
      <div className="flex flex-nowrap items-center justify-between whitespace-nowrap overflow-x-auto">
        <div className="flex flex-nowrap items-center shrink-0">
          <span className="px-4 py-4 font-semibold shrink-0">
            👤 {user?.nombre?.split(' ')[0] ?? user?.usuario}
          </span>

          {rol === 'Administrador' && (
            <>
              <NavLink to="/solicitudes-uie" className={linkClass}>Solicitudes</NavLink>
              <NavLink to="/pendientes" className={linkClass}>Pendientes</NavLink>
              <NavLink to="/asignadas" className={linkClass}>Asignadas</NavLink>
              <NavLink to="/mis-asignadas" className={linkClass}>Mis Asignadas</NavLink>
              <NavLink to="/historial" className={linkClass}>Historial</NavLink>
              <NavLink to="/dictamenes" className={linkClass}>Dictámenes</NavLink>
              <NavLink to="/mantenimiento" className={linkClass}>Mantenimiento</NavLink>
              <Dropdown
                label="Consultas"
                items={[
                  { to: '/consultas/metas', label: 'Metas' },
                  { to: '/consultas/actividades', label: 'Actividades' },
                ]}
              />
              <Dropdown
                label="Catálogos"
                items={[
                  { to: '/catalogos/usuarios', label: 'Usuarios' },
                  ...CATALOGOS.map((c) => ({ to: `/catalogos/${c.slug}`, label: c.titulo })),
                  { to: '/catalogos/telefonos', label: 'Teléfonos' },
                  { to: '/consultas/equipos', label: 'Equipo de Cómputo' },
                ]}
              />
              <NavLink to="/solicitud-internet" className={linkClass}>Internet</NavLink>
              <NavLink to="/solicitud-telefono" className={linkClass}>Teléfono</NavLink>
              <NotificationBell />
            </>
          )}

          {rol === 'Capturista' && (
            <>
              <NavLink to="/solicitudes-uie" className={linkClass}>Solicitudes</NavLink>
              <NavLink to="/solicitudes" className={linkClass}>Tickets</NavLink>
              <NavLink to="/asignadas" className={linkClass}>Asignadas</NavLink>
              <NavLink to="/pendientes" className={linkClass}>Pendientes</NavLink>
              <NavLink to="/historial" className={linkClass}>Historial</NavLink>
              <NotificationBell />
            </>
          )}

          {rol === 'Soporte Técnico' && (
            <>
              <NavLink to="/asignadas" className={linkClass}>Asignadas</NavLink>
              <NavLink to="/pendientes" className={linkClass}>Pendientes</NavLink>
              <NavLink to="/historial" className={linkClass}>Historial</NavLink>
              <NavLink to="/solicitud-internet" className={linkClass}>Internet</NavLink>
              <NavLink to="/solicitud-telefono" className={linkClass}>Teléfono</NavLink>
              <NotificationBell />
            </>
          )}

          {rol === 'Recursos Materiales' && (
  <NavLink to="/equipos-baja" className={linkClass}>Equipos para Baja</NavLink>
)}

          {rol === 'Usuario Solicitante' && (
            <>
              <NavLink to="/solicitudes/nueva" className={linkClass}>Solicitud</NavLink>
              <NavLink to="/pendientes" className={linkClass}>Pendientes</NavLink>
              <NavLink to="/historial" className={linkClass}>Historial</NavLink>
              <NavLink to="/dictamenes" className={linkClass}>Consultar Dictamen</NavLink>
              <a
  href="http://tiny.cc/Identidad-SHTFP"
  target="_blank"
  rel="noopener noreferrer"
  className="px-4 py-4 text-sm font-medium whitespace-nowrap hover:bg-purple-700"
>
  Identidad
</a>
            </>
          )}
        </div>

        <button onClick={handleLogout} className="px-4 py-4 text-sm font-medium hover:bg-purple-700 shrink-0">
          Salir
        </button>
      </div>
    </nav>
  );
}