import axiosClient from '../api/axiosClient';

export interface SolicitudUieDetalle {
  solicitud: {
    id: number;
    solicitante: string;
    puesto: string | null;
    extension: number | null;
    descripcion: string | null;
    num_documento: string | null;
    prioridad: string | null;
    fecha_solicitud: string;
    fecha_asignacion: string | null;
    edificio: number | null;
    nivel: string | null;
    seguimiento: string | null;
    observaciones: string | null;
    area: string | null;
    poa: string | null;
    tecnico: string | null;
    situacion: string | null;
    id_area: number;
  };
  equipos: { id: number; tipo: string; marca: string; modelo: string; no_inventario: string; no_serie: string; sistema: string }[];
  dictamen: { id: number; folio: number; ejercicio: number; fecha_dictamen: string; dictamen: string; expediente: string } | null;
  archivos: { id: number; tipo: string; ruta_archivo: string; created_at: string }[];
}

export const getSolicitudUieDetalle = async (id: number) => {
  const { data } = await axiosClient.get<SolicitudUieDetalle>(`/solicitudes-uie/${id}`);
  return data;
};