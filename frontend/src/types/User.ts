export interface Rol {
  id: number;
  nombre: 'Administrador' | 'Soporte Técnico' | 'Capturista' | 'Usuario Solicitante';
  descripcion?: string;
}

export interface User {
  id: number;
  usuario: string;
  nombre: string;
  rol_id: number;
  rol: Rol;
  id_soporte?: number | null;
  id_area?: number | null;
}

export interface Asignable {
  id: number;
  nombre: string;
}