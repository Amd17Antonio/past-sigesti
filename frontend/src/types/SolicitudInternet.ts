export interface SolicitudInternetRow {
  id: number;
  tipo_solicitud: string;
  usuario_internet: string;
  area: string;
  no_inventario: string;
  tipo_conexion: string;
  tel_ext: number;
  correo: string;
  estatus: string;
}

export const ESTATUS_INTERNET_LABEL: Record<string, string> = {
  generado_uie: 'CREADO EN CGD',
  atendiendo_dt: 'ATENDIENDO DGTI',
  activo: 'SERVICIO ACTIVO',
  baja: 'BAJA',
};

export interface CrearSolicitudInternetPayload {
  id_equipo: number;
  usuario_internet: string;
  id_cargo: number;
  id_area: number;
  id_autoriza: number;
  correo: string;
  tel_ext: number;
  tipo_conexion: 'cableada' | 'inalambrica';
  nivel_filtrado: 1 | 2;
  tipo_solicitud: 'nueva' | 'cambio';
  edificio: string;
  nivel: string;
  puerto?: number;
  justificacion?: string;
  mac_ethernet?: string;
  mac_wifi?: string;
}