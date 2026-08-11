export interface PoaOption {
  id: number;
  poa: string;
}

export interface ActividadRow {
  id: number;
  solicitante: string | null;
  fecha: string | null;
  servicio: string | null;
  num_servicios: number | null;
  poa: string | null;
  id_poa: number | null;
  no_dictamen: string | null;
}

export interface ContadorDictamen {
  con_dictamen: number;
  sin_dictamen: number;
}

export interface ActividadesResponse {
  registros: ActividadRow[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  contador: ContadorDictamen | null;
}