import axiosClient from '../api/axiosClient';

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

export const getSolicitudesInternet = async () => {
  const { data } = await axiosClient.get('/solicitud-internet');
  return data;
};

export const crearSolicitudInternet = async (payload: any) => {
  const { data } = await axiosClient.post('/solicitud-internet', payload);
  return data;
};

export const actualizarSolicitudInternet = async (id: number, payload: any) => {
  const { data } = await axiosClient.put(`/solicitud-internet/${id}`, payload);
  return data;
};

export const eliminarSolicitudInternet = async (id: number) => {
  const { data } = await axiosClient.delete(`/solicitud-internet/${id}`);
  return data;
};

export const descargarPdfSolicitudInternet = async (id: number) => {
  const response = await axiosClient.get(`/solicitud-internet/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  window.open(url, '_blank');
};