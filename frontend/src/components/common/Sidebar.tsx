import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

interface DropdownItem {
  to: string;
  label: string;
  icon?: string;
  grupo?: string;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-3 text-sm font-medium transition-colors duration-150 ${
    isActive 
      ? 'bg-indigo-600 text-white font-semibold shadow-inner border-l-4 border-white' 
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

function SidebarGroup({ label, icon, items }: { label: string; icon: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const updatePosition = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right });
    }
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        btnRef.current && !btnRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div>
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-150 ${
          open 
            ? 'bg-slate-800 text-white border-l-4 border-indigo-500' 
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <span className="flex items-center gap-2"><span>{icon}</span> {label}</span>
        <span className={`text-xs transition-transform duration-200 ${open ? 'rotate-90 text-indigo-400' : 'text-slate-400'}`}>▸</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: pos.top, left: pos.left }}
            className="z-50 min-w-[220px] bg-slate-900 text-slate-200 border border-slate-700 rounded-r-xl shadow-2xl py-2 backdrop-blur-md bg-opacity-95"
          >
            {grupos.map((grupo, i) => (
              <div key={grupo.nombre ?? `sin-grupo-${i}`}>
                {grupo.nombre && (
                  <div className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    {grupo.nombre}
                  </div>
                )}
                {grupo.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm whitespace-nowrap transition-colors duration-150 ${
                        isActive 
                          ? 'bg-indigo-600 text-white font-medium' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    {item.icon ? `${item.icon} ` : ''}{item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const rol = user?.rol?.nombre;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const muestraCampana = rol === 'Administrador' || rol === 'Capturista' || rol === 'Soporte Técnico';

  return (
    <aside className="bg-slate-900 text-slate-100 w-64 shrink-0 h-full min-h-0 flex flex-col border-r border-slate-800 shadow-xl">
      {/* Cabecera del usuario */}
      <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
        <span className="font-medium text-sm text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          👤 {user?.nombre?.split(' ')[0] ?? user?.usuario}
        </span>
        {muestraCampana && <NotificationBell />}
      </div>

      {/* Navegación */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-2 custom-scrollbar">
        {rol === 'Administrador' && (
          <>
            <NavLink to="/dashboard" className={linkClass}>📊 Dashboard</NavLink>
            <NavLink to="/solicitudes-uie" className={linkClass}>📝 Solicitudes</NavLink>
            <NavLink to="/dictamenes" className={linkClass}>🧾 Dictámenes</NavLink>
            <SidebarGroup
              label="Consultas"
              icon="📋"
              items={[
                { to: '/consultas/actividades', label: 'Actividades', icon: '📅' },
                { to: '/mantenimiento', label: 'Mantenimiento', icon: '🔧' },
                { to: '/consultas/metas', label: 'Metas', icon: '🎯' },
              ]}
            />
            <SidebarGroup
              label="Catálogos"
              icon="🗃️"
              items={[
                { to: '/catalogos/grupo/equipo-computo', label: 'Equipo de Cómputo', icon: '💻' },
                { to: '/catalogos/grupo/organizacion', label: 'Organización', icon: '🏢' },
                { to: '/catalogos/grupo/telefonia', label: 'Telefonía', icon: '☎️' },
                { to: '/catalogos/usuarios', label: 'Usuarios', icon: '👥' },
              ]}
            />
            <SidebarGroup
              label="Servicios"
              icon="🌐"
              items={[
                { to: '/solicitud-correo', label: 'Correo', icon: '📧' },
                { to: '/solicitud-internet', label: 'Internet', icon: '📶' },
                { to: '/solicitud-telefono', label: 'Teléfono', icon: '📞' },
                { to: '/solicitud-vpn', label: 'VPN', icon: '🔒' },
              ]}
            />
          </>
        )}

        {rol === 'Capturista' && (
          <NavLink to="/solicitudes-uie" className={linkClass}>📝 Solicitudes</NavLink>
        )}

        {rol === 'Soporte Técnico' && (
          <>
            <NavLink to="/asignadas" className={linkClass}>📌 Asignadas</NavLink>
            <NavLink to="/pendientes" className={linkClass}>⏳ Pendientes</NavLink>
            <NavLink to="/historial" className={linkClass}>🕘 Historial</NavLink>
            <SidebarGroup
              label="Servicios"
              icon="🌐"
              items={[
                { to: '/solicitud-correo', label: 'Correo', icon: '📧' },
                { to: '/solicitud-internet', label: 'Internet', icon: '📶' },
                { to: '/solicitud-telefono', label: 'Teléfono', icon: '📞' },
                { to: '/solicitud-vpn', label: 'VPN', icon: '🔒' },
              ]}
            />
          </>
        )}

        {rol === 'Recursos Materiales' && (
          <NavLink to="/equipos-baja" className={linkClass}>🗑️ Equipos para Baja</NavLink>
        )}

        {rol === 'Usuario Solicitante' && (
          <>
            <NavLink to="/solicitudes/nueva" className={linkClass}>📝 Solicitud</NavLink>
            <NavLink to="/pendientes" className={linkClass}>⏳ Pendientes</NavLink>
            <NavLink to="/historial" className={linkClass}>🕘 Historial</NavLink>
            <NavLink to="/dictamenes" className={linkClass}>🧾 Consultar Dictamen</NavLink>

            <a href="http://tiny.cc/Identidad-SHTFP"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-150"
            >
              🆔 Identidad
            </a>
          </>
        )}
      </nav>

      {/* Botón de Salir */}
      <div className="border-t border-slate-800 shrink-0 p-2 bg-slate-950/20">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors duration-150 flex items-center gap-2"
        >
          <span>🚪</span> Salir
        </button>
      </div>
    </aside>
  );
}