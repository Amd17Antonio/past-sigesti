import axiosClient from '../api/axiosClient';

export interface EquipoRow {
  id: number;
  id_tipo: number | null;
  id_marca: number | null;
  id_modelo: number | null;
  id_so: number | null;
  no_serie: string | null;
  no_inventario: string | null;
  mac_ethernet: string | null;
  mac_wifi: string | null;
  observacion: string | null;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  sistema: string | null;
  mac: string | null;
}

export interface EquiposResponse {
  registros: EquipoRow[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
}

export const buscarEquipo = async (noInventario: string) => {
  const { data } = await axiosClient.get(`/equipos/buscar/${noInventario}`);
  return data;
};

export const verificarSerie = async (noSerie: string): Promise<boolean> => {
  const { data } = await axiosClient.get(`/equipos/verificar-serie/${encodeURIComponent(noSerie)}`);
  return data.disponible as boolean;
};

export const registrarEquipo = async (payload: {
  id_tipo: number; id_marca: number; id_modelo: number; id_so: number;
  no_serie?: string; no_inventario: string; observacion?: string;
}) => {
  const { data } = await axiosClient.post('/equipos', payload);
  return data;
};

export const getEquipos = async (params: {
  pagina: number; por_pagina: number;
  sort_by?: string; sort_dir?: 'asc' | 'desc';
  tipo?: string; marca?: string; modelo?: string;
  no_serie?: string; no_inventario?: string; mac?: string;
}) => {
  const { data } = await axiosClient.get<EquiposResponse>('/equipos', { params });
  return data;
};

export const getEquipo = async (id: number) => {
  const { data } = await axiosClient.get<EquipoRow>(`/equipos/${id}`);
  return data;
};

export const actualizarEquipo = async (id: number, payload: Record<string, any>) => {
  const { data } = await axiosClient.put(`/equipos/${id}`, payload);
  return data;
};

export const eliminarEquipo = async (id: number) => {
  const { data } = await axiosClient.delete(`/equipos/${id}`);
  return data;
};

export const getSoftwareEquipo = async (id: number) => {
  const { data } = await axiosClient.get(`/equipos/${id}/software`);
  return data as { registros: any[]; catalogo: any[] };
};

export const agregarSoftwareEquipo = async (id: number, payload: { id_software: number; licencia?: string; fecha?: string }) => {
  const { data } = await axiosClient.post(`/equipos/${id}/software`, payload);
  return data;
};

export const eliminarSoftwareEquipo = async (idRegistro: number) => {
  const { data } = await axiosClient.delete(`/software-equipo/${idRegistro}`);
  return data;
};

export const getExtrasEquipo = async (id: number) => {
  const { data } = await axiosClient.get(`/equipos/${id}/extras`);
  return data;
};

export const guardarExtrasEquipo = async (id: number, payload: Record<string, any>) => {
  const { data } = await axiosClient.put(`/equipos/${id}/extras`, payload);
  return data;
};

export const getDictamenesEquipo = async (id: number) => {
  const { data } = await axiosClient.get(`/equipos/${id}/dictamenes`);
  return data as any[];
};