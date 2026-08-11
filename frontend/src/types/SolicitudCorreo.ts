export interface SolicitudCorreo {
  id: number;
  tipo_solicitud: 'alta' | 'baja';
  nombre: string;
  puesto: string | null;
  id_area: number | null;
  area: string | null;
  area_interna: string | null;
  correo_secundario: string | null;
  telefono_contacto: string | null;
  correo_institucional: string | null;
  usuario_generado: string | null;
  motivo_baja: string | null;
  estatus: 'CREADO EN CGD' | 'en_proceso' | 'autorizada' | 'rechazada' | 'finalizada';
  oficio_cgd: string | null;
  observaciones: string | null;
  fecha_generada: string | null;
  fecha_autorizada: string | null;
  fecha_finalizada: string | null;
  created_at: string;
}

export interface NuevaSolicitudCorreo {
  tipo_solicitud: 'alta' | 'baja';
  nombre: string;
  puesto?: string;
  id_area?: number;
  area_interna?: string;
  correo_secundario?: string;
  telefono_contacto?: string;
  correo_institucional?: string;
  motivo_baja?: string;
}
