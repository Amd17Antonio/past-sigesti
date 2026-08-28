import axiosClient from '../api/axiosClient';
import type { SolicitudVpn, NuevaSolicitudVpn } from '../types/SolicitudVpn';

export const getSolicitudesVpn = async (params: {
  pagina: number; por_pagina: number;
  estatus?: string; nombre_usuario?: string; area?: string; tipo_acceso?: string;
}) => {
  const { data } = await axiosClient.get('/solicitud-vpn', { params });
  return data as { registros: SolicitudVpn[]; total: number; pagina: number; por_pagina: number; total_paginas: number };
};

export const getSolicitudVpnDetalle = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-vpn/${id}`);
  return data as { solicitud: SolicitudVpn };
};

export const crearSolicitudVpn = async (payload: NuevaSolicitudVpn) => {
  const { data } = await axiosClient.post('/solicitud-vpn', payload);
  return data as { id: number };
};

export const actualizarSolicitudVpn = async (id: number, payload: Partial<SolicitudVpn>) => {
  const { data } = await axiosClient.put(`/solicitud-vpn/${id}`, payload);
  return data;
};

export const eliminarSolicitudVpn = async (id: number) => {
  const { data } = await axiosClient.delete(`/solicitud-vpn/${id}`);
  return data;
};

// Abre el PDF de la solicitud en una nueva pestaña (usa blob por el token de autenticación)
export const imprimirSolicitudVpn = async (id: number) => {
  const { data } = await axiosClient.get(`/solicitud-vpn/${id}/pdf-url`);
  window.open(data.url, '_blank');
};

export type EstatusVpn = 'creado_cgd' | 'atendiendo_dgti' | 'activo' | 'baja';

export const cambiarEstatusSolicitudVpn = async (
  id: number,
  payload: { estatus: EstatusVpn; folio_glpi?: string; observacion_glpi?: string; motivo_baja?: string }
) => {
  const { data } = await axiosClient.patch(`/solicitud-vpn/${id}/estatus`, payload);
  return data;
};

// Edita el link y la IP/puerto asignados mientras el servicio ya está activo (ambos siempre requeridos).
export const actualizarAsignacionVpn = async (
  id: number,
  payload: { link_sistema: string; ip_puerto: string }
) => {
  const { data } = await axiosClient.patch(`/solicitud-vpn/${id}/asignacion`, payload);
  return data;
};

// Descarga el Excel de accesos VPN activos, filtrado por rango de fecha_activo.
export const exportarResguardoVpnExcel = async (params: { del?: string; al?: string }) => {
  const response = await axiosClient.get('/solicitud-vpn/exportar/resguardo', {
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
  link.download = `resguardo_vpn${sufijo}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(url), 60000);
};