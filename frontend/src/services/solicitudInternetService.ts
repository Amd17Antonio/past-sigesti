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

//export const descargarPdfSolicitudInternet = async (id: number) => {
//  const response = await axiosClient.get(`/solicitud-internet/${id}/pdf`, {
//    responseType: 'blob',
//  });
//  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//  window.open(url, '_blank');
//};

export const descargarPdfSolicitudInternet = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-internet/${id}/pdf-url`);
  window.open(data.url, '_blank');
};

export const getSolicitudInternetDetalle = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-internet/${id}`);
  return data as { solicitud: any };
};

export type EstatusInternet = 'generado_uie' | 'atendiendo_dt' | 'activo' | 'baja';

export const cambiarEstatusSolicitudInternet = async (
  id: number,
  payload: { estatus: EstatusInternet; folio_glpi?: string; observacion_glpi?: string; motivo_baja?: string }
) => {
  const { data } = await axiosClient.patch(`/solicitud-internet/${id}/estatus`, payload);
  return data;
};

export function colorPorEstatus(estatus: string): string {
  const mapa: Record<string, string> = {
    // Internet
    generado_uie: '#9CA3AF', // gris
    atendiendo_dt: '#CDDC39', // verde limón
    activo: '#16A34A', // verde
    baja: '#DC2626', // rojo
    eliminado: '#DC2626',
    // Teléfono / VPN / Correo (mismo patrón semántico)
    GENERADA: '#9CA3AF', generada: '#9CA3AF',
    EN_PROCESO: '#CDDC39', en_proceso: '#CDDC39',
    AUTORIZADA: '#16A34A', autorizada: '#16A34A',
    FINALIZADA: '#16A34A', finalizada: '#16A34A',
    RECHAZADA: '#DC2626', rechazada: '#DC2626',
  };
  return mapa[estatus] ?? '#9CA3AF';
}