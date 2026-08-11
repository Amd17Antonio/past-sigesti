import axiosClient from '../api/axiosClient';
import type { PoaOption, ActividadesResponse } from '../types/Reporte';

export const getPoaOptions = async () => {
  const { data } = await axiosClient.get<PoaOption[]>('/reportes/poa');
  return data;
};

export const getActividades = async (params: {
  id_poa?: number;
  del?: string;
  al?: string;
  pagina: number;
  por_pagina: number;
}) => {
  const { data } = await axiosClient.get<ActividadesResponse>('/reportes/actividades', { params });
  return data;
};