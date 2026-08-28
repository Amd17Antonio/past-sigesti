import axiosClient from '../api/axiosClient';
import type { EquipoMantenimientoCgd, EquipoMantenimientoResponse } from '../types/EquipoMantenimientoCgd';

export const getEquipoMantenimiento = (idEquipoSolicitud: number) =>
  axiosClient.get<EquipoMantenimientoResponse>(`/equipo-mantenimiento-cgd/${idEquipoSolicitud}`).then((r) => r.data);

export const guardarEquipoMantenimiento = (data: EquipoMantenimientoCgd) =>
  axiosClient.post<EquipoMantenimientoCgd>('/equipo-mantenimiento-cgd', data).then((r) => r.data);

export const abrirPdfEquipoMantenimiento = async (idEquipoSolicitud: number) => {
  const { data } = await axiosClient.get(`/equipo-mantenimiento-cgd/${idEquipoSolicitud}/pdf-url`);
  window.open(data.url, '_blank');
};