import axiosClient from '../api/axiosClient';
import type { SolicitudUieResponse } from '../types/SolicitudUie';

export const getSolicitudesUie = async (params: {
  pagina: number; por_pagina: number;
  sort_by?: string; sort_dir?: 'asc' | 'desc';
  folio_sistema?: string; ejercicio?: string; solicitante?: string;
  area?: string; num_documento?: string; tecnico?: string;
  no_inventario?: string; fecha_asignacion?: string;
}) => {
  const { data } = await axiosClient.get<SolicitudUieResponse>('/solicitudes-uie', { params });
  return data;
};

export const agregarEquipoSolicitud = (idSolicitud: number, idEquipo: number) =>
  axiosClient
    .post(`/solicitudes-uie/${idSolicitud}/equipo`, { id_equipo: idEquipo })
    .then((r) => r.data as { message: string; id_equipo_solicitud: number; ya_sugerido_baja: boolean });

export const desautorizarDictamenTecnico = async (idSolicitud: number) => {
  const { data } = await axiosClient.post(`/solicitudes-uie/${idSolicitud}/desautorizar-dictamen`);
  return data;
};

export const duplicarSolicitud = async (idSolicitud: number) => {
  const { data } = await axiosClient.post(`/solicitudes-uie/${idSolicitud}/duplicar`);
  return data;
};

export const actualizarSolicitudUie = async (idSolicitud: number, payload: Record<string, any>) => {
  const { data } = await axiosClient.put(`/solicitudes-uie/${idSolicitud}`, payload);
  return data;
};

export const darBajaSolicitud = async (idSolicitud: number, motivo: string) => {
  const { data } = await axiosClient.post(`/solicitudes-uie/${idSolicitud}/baja`, { motivo_baja: motivo });
  return data;
};

export interface ArchivoSolicitud {
  id: number;
  tipo: 'acuseDictamen' | 'memoSolicitud' | 'acuseMemoRespuesta';
  ruta_archivo: string;
  created_at: string;
}

export const getArchivosSolicitud = async (idSolicitud: number) => {
  const { data } = await axiosClient.get<ArchivoSolicitud[]>(`/solicitudes-uie/${idSolicitud}/archivos`);
  return data;
};

export interface SolicitudUieDetalle {
  solicitud: {
    id: number;
    solicitante: string;
    puesto: string | null;
    extension: number | null;
    descripcion: string | null;
    num_documento: string | null;
    prioridad: string | null;
    fecha_solicitud: string;
    fecha_asignacion: string | null;
    edificio: number | null;
    nivel: string | null;
    seguimiento: string | null;
    observaciones: string | null;
    area: string | null;
    poa: string | null;
    tecnico: string | null;
    situacion: string | null;
    id_area: number;
  };
  equipos: { id: number; tipo: string; marca: string; modelo: string; no_inventario: string; no_serie: string; sistema: string }[];
  dictamen: { id: number; folio: number; ejercicio: number; fecha_dictamen: string; dictamen: string; expediente: string } | null;
  archivos: { id: number; tipo: string; ruta_archivo: string; created_at: string }[];
}

export const getSolicitudUieDetalle = async (id: number) => {
  const { data } = await axiosClient.get<SolicitudUieDetalle>(`/solicitudes-uie/${id}`);
  return data;
};

export const cerrarDictamenSolicitud = async (idSolicitud: number) => {
  const { data } = await axiosClient.post(`/solicitudes-uie/${idSolicitud}/cerrar-dictamen`);
  return data;
};

export const autorizarDictamenSolicitud = async (idSolicitud: number) => {
  const { data } = await axiosClient.post(`/solicitudes-uie/${idSolicitud}/autorizar-dictamen`);
  return data;
};


