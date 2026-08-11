export interface SolicitudVpn {
  id: number;
  nombre_usuario: string;
  puesto: string | null;
  id_area: number | null;
  area: string | null;
  dependencia: string | null;
  correo_institucional: string | null;
  telefono: string | null;
  extension: string | null;
  tipo_acceso: 'link' | 'ip_puerto';
  link_sistema: string | null;
  ip_puerto: string | null;
  justificacion_uso: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  num_ticket: string | null;
  estatus: 'CREADO EN CGD'  | 'ATENDIENDO DGTI' | 'SERVICIO ACTIVO' | 'BAJA';
  observaciones: string | null;
  fecha_generada: string | null;
  fecha_autorizada: string | null;
  fecha_finalizada: string | null;
  created_at: string;
}

export interface NuevaSolicitudVpn {
  nombre_usuario: string;
  puesto?: string;
  id_area?: number;
  dependencia?: string;
  correo_institucional?: string;
  telefono?: string;
  extension?: string;
  tipo_acceso: 'link' | 'ip_puerto';
  link_sistema?: string;
  ip_puerto?: string;
  justificacion_uso?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}
