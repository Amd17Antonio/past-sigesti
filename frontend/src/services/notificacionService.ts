import axiosClient from '../api/axiosClient';
import type { NotificacionItem } from '../types/Notificacion';

export const getNotificaciones = async () => {
  const { data } = await axiosClient.get<NotificacionItem[]>('/notificaciones');
  return data;
};

export const getContadorNotificaciones = async () => {
  const { data } = await axiosClient.get<{ total: number }>('/notificaciones/contador');
  return data.total;
};

export const marcarNotificacionLeida = async (id: number) => {
  const { data } = await axiosClient.put(`/notificaciones/${id}/leida`);
  return data;
};

export const marcarTodasLeidas = async () => {
  const { data } = await axiosClient.put('/notificaciones/marcar-todas');
  return data;
};