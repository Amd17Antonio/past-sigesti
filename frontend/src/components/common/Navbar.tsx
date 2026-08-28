import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-4 text-sm font-medium whitespace-nowrap ${isActive ? 'bg-purple-800' : 'hover:bg-purple-700'}`;

interface DropdownItem {
  to: string;
  label: string;
  grupo?: string;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
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

  const grupos: { nombre: string | null; items: DropdownItem[] }[] = [];
  items.forEach((item) => {
    const nombreGrupo = item.grupo ?? null;
    let grupo = grupos.find((g) => g.nombre === nombreGrupo);
    if (!grupo) {
      grupo = { nombre: nombreGrupo, items: [] };
      grupos.push(grupo);
    }
    grupo.items.push(item);
  });

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
          className="bg-white text-gray-800 shadow-lg rounded-b min-w-[220px] max-h-[80vh] overflow-y-auto z-[9999]"
        >
          {grupos.map((grupo, i) => (
            <div key={grupo.nombre ?? `sin-grupo-${i}`}>
              {grupo.nombre && (
                <div className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-purple-700 bg-purple-50">
                  {grupo.nombre}
                </div>
              )}
              {grupo.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-purple-50"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
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
              <NavLink to="/dashboard" className={linkClass}>📊 Dashboard</NavLink>
              <NavLink to="/solicitudes-uie" className={linkClass}>Solicitudes</NavLink>
              <NavLink to="/dictamenes" className={linkClass}>Dictámenes</NavLink>
              <Dropdown
                label="📋 Consultas"
                items={[
                  { to: '/consultas/actividades', label: 'Actividades' },
                  { to: '/mantenimiento', label: 'Mantenimiento' },
                  { to: '/consultas/metas', label: 'Metas' },
                ]}
              />
              <Dropdown
                label="🗃️ Catálogos"
                items={[
                  { to: '/catalogos/grupo/equipo-computo', label: 'Equipo de Cómputo' },
                  { to: '/catalogos/grupo/organizacion', label: 'Organización' },
                  { to: '/catalogos/grupo/telefonia', label: 'Telefonía' },
                  { to: '/catalogos/usuarios', label: 'Usuarios' },
                ]}
              />
              <Dropdown
                label="🌐 Servicios"
                items={[
                  { to: '/solicitud-correo', label: 'Correo' },
                  { to: '/solicitud-internet', label: 'Internet' },
                  { to: '/solicitud-telefono', label: 'Teléfono' },
                  { to: '/solicitud-vpn', label: 'VPN' },
                ]}
              />
              <NotificationBell />
            </>
          )}

          {rol === 'Capturista' && (
            <>
              <NavLink to="/solicitudes-uie" className={linkClass}>Solicitudes</NavLink>
              <NotificationBell />
            </>
          )}

          {rol === 'Soporte Técnico' && (
            <>
              <NavLink to="/asignadas" className={linkClass}>Asignadas</NavLink>
              <NavLink to="/pendientes" className={linkClass}>Pendientes</NavLink>
              <NavLink to="/historial" className={linkClass}>Historial</NavLink>
              <Dropdown
                label="🌐 Servicios"
                items={[
                  { to: '/solicitud-correo', label: 'Correo' },
                  { to: '/solicitud-internet', label: 'Internet' },
                  { to: '/solicitud-telefono', label: 'Teléfono' },
                  { to: '/solicitud-vpn', label: 'VPN' },
                ]}
              />
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
