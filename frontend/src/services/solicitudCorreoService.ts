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

// Abre el PDF de la solicitud (formato "Alta"/"Baja" de correo) en una nueva pestaña.
export const imprimirSolicitudCorreo = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-correo/${id}/pdf-url`);
  window.open(data.url, '_blank');
};

// Abre el PDF del oficio de creación/baja de correo institucional (usado en la vista de Resguardo).
export const imprimirOficioCorreo = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-correo/${id}/oficio-url`);
  window.open(data.url, '_blank');
};

export type EstatusCorreo = 'creado_cgd' | 'atendiendo_dgti' | 'activo' | 'baja';

// El correo ya se captura en la creación de la solicitud, así que aquí ya no se pide de nuevo.
export const cambiarEstatusSolicitudCorreo = async (
  id: number,
  payload: {
    estatus: EstatusCorreo;
    folio_glpi?: string;
    observacion_glpi?: string;
    usuario_generado?: string;
    motivo_baja?: string;
  }
) => {
  const { data } = await axiosClient.patch(`/solicitud-correo/${id}/estatus`, payload);
  return data;
};

// Edita solo el correo institucional asignado (y usuario_generado) mientras el servicio ya está activo.
export const actualizarAsignacionCorreo = async (
  id: number,
  payload: { correo_institucional: string; usuario_generado?: string }
) => {
  const { data } = await axiosClient.patch(`/solicitud-correo/${id}/asignacion`, payload);
  return data;
};

// Descarga el Excel de correos institucionales activos, filtrado por rango de fecha_activo.
export const exportarResguardoCorreoExcel = async (params: { del?: string; al?: string }) => {
  const response = await axiosClient.get('/solicitud-correo/exportar/resguardo', {
    params,
    responseType: 'blob',
    timeout: 30000,
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const sufijo = params.del || params.al ? `_${params.del || 'inicio'}_a_${params.al || 'hoy'}` : '';
  const link = document.createElement('a');
  link.href = url;
  link.download = `resguardo_correo${sufijo}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(url), 60000);
};