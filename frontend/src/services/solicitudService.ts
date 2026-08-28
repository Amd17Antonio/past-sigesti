import axiosClient from '../api/axiosClient';

export const getPendientes = async () => {
  const { data } = await axiosClient.get('/solicitudes/pendientes');
  return data;
};

export const getAsignadas = async () => {
  const { data } = await axiosClient.get('/solicitudes/asignadas');
  return data;
};

export const getHistorial = async () => {
  const { data } = await axiosClient.get('/solicitudes/historial');
  return data;
};

export const getAsignables = async () => {
  const { data } = await axiosClient.get('/solicitudes/asignables');
  return Array.isArray(data) ? data : (data.opciones ?? []);
};

export const asignarSolicitud = async (id: number, idSoporte: number) => {
  const { data } = await axiosClient.post(`/solicitudes/${id}/asignar`, { id_soporte: idSoporte });
  return data;
};

export interface CrearSolicitudPayload {
  solicitante: string;
  puesto?: string;
  tipo_documento?: string;
  num_documento?: string;
  fecha_memo?: string;
  fecha_memo_recibido?: string;
  id_area: number;
  descripcion: string;
  prioridad?: string;
  extension?: number;
  edificio?: number;
  nivel?: string;
  id_soporte?: number;
}

export const getPoas = async () => {
  const { data } = await axiosClient.get('/solicitudes/poa');
  return data;
};

export const agregarSeguimiento = async (id: number, seguimiento: string) => {
  const { data } = await axiosClient.post(`/solicitudes/${id}/seguimiento`, { seguimiento });
  return data;
};

export const crearSolicitud = async (payload: CrearSolicitudPayload) => {
  const { data } = await axiosClient.post('/solicitudes', payload);
  return data;
};

export interface Poa {
  id: number;
  poa: string;
}

export interface CerrarSolicitudPayload {
  id_poa: number;
  num_servicios: number;
  observaciones?: string;
}

export const cerrarSolicitud = async (id: number, payload: CerrarSolicitudPayload) => {
  const { data } = await axiosClient.post(`/solicitudes/${id}/cerrar`, payload);
  return data;
};

export interface ArchivoSolicitud {
  id: number;
  tipo: 'acuseDictamen' | 'memoSolicitud' | 'acuseMemoRespuesta';
  ruta_archivo: string;
  created_at: string;
}

export const getArchivosSolicitud = async (idSolicitud: number) => {
  const { data } = await axiosClient.get<ArchivoSolicitud[]>(`/solicitudes-uie/${idSolicitud}/archivos`);
  return data;
};

export const getMisAsignadas = async () => {
  const { data } = await axiosClient.get('/solicitudes/mis-asignadas');
  return data;
};

export const getSeguimiento = async (id: number) => {
  const { data } = await axiosClient.get<{ seguimiento: string | null }>(`/solicitudes/${id}/seguimiento`);
  return data.seguimiento;
};