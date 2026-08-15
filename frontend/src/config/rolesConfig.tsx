// src/config/rolesConfig.ts

// Ruta a la que se redirige cada rol justo después de iniciar sesión.
export const HOME_POR_ROL: Record<string, string> = {
  'Administrador': '/solicitudes-uie',
  'Capturista': '/solicitudes-uie',
  'Soporte Técnico': '/asignadas',
  'Recursos Materiales': '/equipos-baja',
  'Usuario Solicitante': '/solicitudes/nueva',
};

export const DEFAULT_HOME = '/pendientes';

// Rutas permitidas por rol. Debe reflejar lo que cada rol ve en el Navbar.
export const RUTAS_POR_ROL: Record<string, string[]> = {
  'Administrador': [
    '/solicitudes-uie', '/pendientes', '/asignadas', '/mis-asignadas',
    '/historial', '/dictamenes', '/mantenimiento',
    '/consultas/metas', '/consultas/actividades', '/consultas/equipos',
    '/catalogos/usuarios', '/catalogos/telefonos', '/catalogos/:slug',
    '/solicitud-internet', '/solicitud-telefono',
    '/solicitud-correo', '/solicitud-vpn',
    '/resguardo/telefonia', '/resguardo/correo', '/resguardo/vpn',
  ],
  'Capturista': [
    '/solicitudes-uie', '/solicitudes', '/asignadas', '/pendientes', '/historial',
  ],
  'Soporte Técnico': [
    '/asignadas', '/pendientes', '/historial',
    '/solicitud-internet', '/solicitud-telefono',
    '/solicitud-correo', '/solicitud-vpn',
  ],
  'Recursos Materiales': [
    '/equipos-baja',
  ],
  'Usuario Solicitante': [
    '/solicitudes/nueva', '/pendientes', '/historial', '/dictamenes', '/identidad',
  ],
};

function coincideRuta(patron: string, ruta: string): boolean {
  if (patron === ruta) return true;
  if (patron.includes(':')) {
    const regex = new RegExp(
      '^' + patron.replace(/:[^/]+/g, '[^/]+') + '$'
    );
    return regex.test(ruta);
  }
  return false;
}

export function rolTienePermiso(rol: string | undefined, ruta: string): boolean {
  if (!rol) return false;
  const permitidas = RUTAS_POR_ROL[rol];
  if (!permitidas) return false;
  return permitidas.some((patron) => coincideRuta(patron, ruta));
}
