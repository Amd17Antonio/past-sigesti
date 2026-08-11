import axiosClient from '../api/axiosClient';

export interface DictamenRow {
  id: number;
  folio_sistema: number;
  folio_dictamen: string;
  fecha_dictamen: string | null;
  dictamen: string;
  expediente: string | null;
  no_inventario: string | null;
  area: string;
  acuseDictamen: string | null;
  acuseMemo: string | null;
}

export interface DictamenesResponse {
  registros: DictamenRow[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
}

export const getDictamenes = async (params: {
  pagina: number; por_pagina: number;
  sort_by?: string; sort_dir?: 'asc' | 'desc';
  folio_sistema?: string; folio_dictamen?: string; fecha_dictamen?: string;
  expediente?: string; area?: string; no_inventario?: string;
}) => {
  const { data } = await axiosClient.get<DictamenesResponse>('/dictamenes', { params });
  return data;
};

export const getSolicitudesDisponiblesDictamen = async () => {
  const { data } = await axiosClient.get('/dictamenes/solicitudes-disponibles');
  return data as {
    id: number;
    solicitante: string;
    area: string;
    num_documento: string | null;
    tecnico: string | null;
    descripcion: string | null;
    equipos: string;
  }[];
};

export const getEquiposDeSolicitud = async (idSolicitud: number) => {
  const { data } = await axiosClient.get(`/dictamenes/solicitud/${idSolicitud}/equipos`);
  return data as { id: number; id_equipo: number; tipo: string; marca: string; modelo: string; no_inventario: string }[];
};

export const getSiguienteFolio = async () => {
  const { data } = await axiosClient.get('/dictamenes/siguiente-folio');
  return data as { ejercicio: number; folio: number };
};

export const getDictamen = async (id: number) => {
  const { data } = await axiosClient.get(`/dictamenes/${id}`);
  return data;
};

export const crearDictamen = async (payload: Record<string, any>) => {
  const { data } = await axiosClient.post('/dictamenes', payload);
  return data;
};

export const actualizarDictamen = async (id: number, payload: Record<string, any>) => {
  const { data } = await axiosClient.put(`/dictamenes/${id}`, payload);
  return data;
};