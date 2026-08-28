import axiosClient from '../api/axiosClient';

export interface TicketsResumen {
  creados: number;
  asignados: number;
  concluidos: number;
  asignados_sin_atender: number;
  serie_mensual: number[];
  anio: number;
  top_tecnico: { nombre: string; total: number } | null;
}

export interface DictamenesResumen {
  generados: number;
  equipos_dictaminados: number;
  sugeridos_baja: number;
  pendientes_autorizar: number;
  serie_mensual: number[];
  anio: number;
  top_tecnico: { nombre: string; total: number } | null;
}

interface Rango {
  desde?: string;
  hasta?: string;
  anio?: number;
}

export async function getDashboardTickets(params: Rango = {}) {
  const { data } = await axiosClient.get<TicketsResumen>('/dashboard/tickets', { params });
  return data;
}

export async function getDashboardDictamenes(params: Rango = {}) {
  const { data } = await axiosClient.get<DictamenesResumen>('/dashboard/dictamenes', { params });
  return data;
}

export interface ActividadPoa {
  poa: string;
  total: number;
}

export interface ActividadesMesAnterior {
  mes: string;
  registros: ActividadPoa[];
}

export async function getDashboardActividades() {
  const { data } = await axiosClient.get<ActividadesMesAnterior>('/dashboard/actividades');
  return data;
}