export type EstatusCorreo = 'creado_cgd' | 'atendiendo_dgti' | 'activo' | 'baja';

export interface SolicitudCorreo {
  id: number;
  tipo_solicitud: 'alta' | 'baja';
  nombre: string;
  puesto?: string | null;
  id_area?: number | null;
  area?: string | null;
  area_interna?: string | null;
  correo_secundario?: string | null;
  telefono_contacto?: string | null;
  correo_institucional?: string | null;
  usuario_generado?: string | null;
  motivo_baja?: string | null;
  estatus: EstatusCorreo;
  observaciones?: string | null;
  folio_glpi?: string | null;
  observacion_glpi?: string | null;
  oficio_cgd?: string | null;
  fecha_creado_cgd?: string | null;
  fecha_atendiendo_dgti?: string | null;
  fecha_activo?: string | null;
  fecha_baja?: string | null;
  created_at?: string;
}

export type NuevaSolicitudCorreo = Omit<SolicitudCorreo, 'id' | 'estatus' | 'created_at' | 'usuario_generado' | 'folio_glpi' | 'observacion_glpi' | 'oficio_cgd' | 'fecha_creado_cgd' | 'fecha_atendiendo_dgti' | 'fecha_activo' | 'fecha_baja'>;