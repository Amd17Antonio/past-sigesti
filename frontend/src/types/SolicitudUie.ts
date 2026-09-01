export interface SolicitudUieRow {
  id: number;
  solicitante: string;
  area: string;
  num_documento: string | null;
  descripcion: string | null;
  prioridad: string | null;
  fecha_solicitud: string;
  situacion: string;
  tecnico: string | null;
  fecha_cierre: string | null;
  fecha_autoriza_tecnico: string | null;
  fecha_autoriza_dictamen: string | null;
  fecha_asignacion: string | null;
  NoDictamen: string | null;
  id_dictamen: number | null;
  ejercicio: number | null;
  folio: number | null;
  no_inventario: string | null;
  fecha_memo: string | null;
  fecha_memo_recibido: string | null;
  status_uie: number;
  acuseDictamen: number;
  memoSolicitud: number;
  dada_baja: number | null;
  tiene_checklist?: boolean | number;
  id_equipo_solicitud?: number | null;
}

export interface SolicitudUieResponse {
  registros: SolicitudUieRow[];
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
}