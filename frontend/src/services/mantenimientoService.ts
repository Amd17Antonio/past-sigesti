import axiosClient from '../api/axiosClient';
import type { MantenimientoRegistro, EquipoConSemaforo } from '../types/Mantenimiento';

export const getMantenimientos = async (params: {
  pagina: number;
  por_pagina: number;
  no_inventario?: string;
  solo_alerta?: '1';
}) => {
  const { data } = await axiosClient.get<{
    registros: EquipoConSemaforo[];
    total: number;
    pagina: number;
    por_pagina: number;
    total_paginas: number;
  }>('/mantenimientos', { params });
  return data;
};

export const getAlertasMantenimiento = async () => {
  const { data } = await axiosClient.get<{ total: number; registros: EquipoConSemaforo[] }>(
    '/mantenimientos/alertas'
  );
  return data;
};

export const getHistorialMantenimiento = async (idEquipo: number) => {
  const { data } = await axiosClient.get<MantenimientoRegistro[]>(`/equipos/${idEquipo}/mantenimientos`);
  return data;
};

export const registrarMantenimiento = async (
  idEquipo: number,
  payload: { fecha_mantenimiento: string; proxima_fecha?: string; tipo?: string; descripcion?: string }
) => {
  const { data } = await axiosClient.post<MantenimientoRegistro>(`/equipos/${idEquipo}/mantenimientos`, payload);
  return data;
};

export const eliminarMantenimiento = async (id: number) => {
  const { data } = await axiosClient.delete(`/mantenimientos/${id}`);
  return data;
};