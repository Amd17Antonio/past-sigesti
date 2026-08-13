export interface SolicitudTelefoniaRow {
  id: number;
  tramite: string;
  nombre: string;
  extension: string | null;
  puesto: string | null;
  estatus: string;
  correo_institucional: string | null;
  edificio: string | null;
  nivel: string | null;
}

export const ESTATUS_TELEFONIA_LABEL: Record<string, string> = {
  creado_cgd: 'CREADO EN CGD',
  atendiendo_dgti: 'ATENDIENDO DGTI',
  activo: 'SERVICIO ACTIVO',
  baja: 'BAJA',
};

export const TRAMITES_TELEFONIA = [
  'SOLICITAR_TELEFONO', 'CAMBIO_PIN_CN', 'CAMBIO_USUARIO', 'MODIFICAR_DATOS',
  'JEFE_SECRETARIA', 'CAMBIO_DID', 'CAMBIO_CATEGORIA', 'OTROS',
] as const;

