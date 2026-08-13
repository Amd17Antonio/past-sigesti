import axiosClient from '../api/axiosClient';
import type { SolicitudCorreo, NuevaSolicitudCorreo } from '../types/SolicitudCorreo';

export const getSolicitudesCorreo = async (params: {
  pagina: number; por_pagina: number;
  tipo_solicitud?: string; estatus?: string; nombre?: string; area?: string; correo_institucional?: string;
}) => {
  const { data } = await axiosClient.get('/solicitud-correo', { params });
  return data as { registros: SolicitudCorreo[]; total: number; pagina: number; por_pagina: number; total_paginas: number };
};

export const getSolicitudCorreoDetalle = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-correo/${id}`);
  return data as { solicitud: SolicitudCorreo };
};

export const crearSolicitudCorreo = async (payload: NuevaSolicitudCorreo) => {
  const { data } = await axiosClient.post('/solicitud-correo', payload);
  return data as { id: number };
};

export const actualizarSolicitudCorreo = async (id: number, payload: Partial<SolicitudCorreo>) => {
  const { data } = await axiosClient.put(`/solicitud-correo/${id}`, payload);
  return data;
};

export const eliminarSolicitudCorreo = async (id: number) => {
  const { data } = await axiosClient.delete(`/solicitud-correo/${id}`);
  return data;
};

// Abre el PDF de la solicitud en una nueva pestaña (usa blob porque la ruta
// requiere el token de autenticación, igual que la exportación a Excel de equipos-baja)
export const imprimirSolicitudCorreo = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-correo/${id}/pdf-url`);
  window.open(data.url, '_blank');
};

export type EstatusCorreo = 'creado_cgd' | 'atendiendo_dgti' | 'activo' | 'baja';

export const cambiarEstatusSolicitudCorreo = async (
  id: number,
  payload: { estatus: EstatusCorreo; folio_glpi?: string; observacion_glpi?: string; usuario_generado?: string; motivo_baja?: string }
) => {
  const { data } = await axiosClient.patch(`/solicitud-correo/${id}/estatus`, payload);
  return data;
};