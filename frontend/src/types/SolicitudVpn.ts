export type EstatusVpn = 'creado_cgd' | 'atendiendo_dgti' | 'activo' | 'baja';

export interface SolicitudVpn {
  id: number;
  nombre_usuario: string;
  puesto?: string | null;
  id_area?: number | null;
  area?: string | null;
  dependencia?: string | null;
  correo_institucional?: string | null;
  telefono?: string | null;
  extension?: string | null;
  tipo_acceso: 'link' | 'ip_puerto' | 'ambos';
  link_sistema?: string | null;
  ip_puerto?: string | null;
  justificacion_uso?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  num_ticket?: string | null;
  estatus: EstatusVpn;
  observaciones?: string | null;
  folio_glpi?: string | null;
  observacion_glpi?: string | null;
  motivo_baja?: string | null;
  fecha_creado_cgd?: string | null;
  fecha_atendiendo_dgti?: string | null;
  fecha_activo?: string | null;
  fecha_baja?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export type NuevaSolicitudVpn = Omit<SolicitudVpn, 'id' | 'estatus' | 'created_at' | 'updated_at' | 'folio_glpi' | 'observacion_glpi' | 'motivo_baja' | 'fecha_creado_cgd' | 'fecha_atendiendo_dgti' | 'fecha_activo' | 'fecha_baja'>;
