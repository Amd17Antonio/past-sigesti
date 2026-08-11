import axiosClient from '../api/axiosClient';

export interface EquipoBajaRow {
  id_dictamen: number;
  no_dictamen: string;
  fecha_dictamen: string;
  dictamen: string;
  expediente: string | null;
  folio_solicitud: number;
  solicitante: string;
  area: string;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  no_serie: string | null;
  no_inventario: string | null;
}

export const getEquiposBaja = async (params: {
  pagina: number; por_pagina: number;
  sort_by?: string; sort_dir?: 'asc' | 'desc';
  solicitante?: string; area?: string; tipo?: string; marca?: string; no_inventario?: string;
}) => {
  const { data } = await axiosClient.get('/equipos-baja', { params });
  return data as { registros: EquipoBajaRow[]; total: number; pagina: number; por_pagina: number; total_paginas: number };
};

export const exportarEquiposBaja = async (filtros: Record<string, string>) => {
  const response = await axiosClient.get('/equipos-baja/exportar', {
    params: filtros,
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `equipos_baja_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
};