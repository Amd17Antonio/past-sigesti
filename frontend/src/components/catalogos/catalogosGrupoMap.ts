// Mapea cada slug de catálogo individual a la pantalla de grupo a la que pertenece,
// para que el botón "Regresar" dentro del catálogo vuelva al grupo correcto.
export const CATALOGO_A_GRUPO: Record<string, string> = {
  // Organización
  'areas': '/catalogos/grupo/organizacion',
  'cargos': '/catalogos/grupo/organizacion',
  'poa': '/catalogos/grupo/organizacion',
  'autoriza-internet': '/catalogos/grupo/organizacion',

  // Equipo de Cómputo
  'enlace-informatico': '/catalogos/grupo/equipo-computo',
  'marcas': '/catalogos/grupo/equipo-computo',
  'modelos': '/catalogos/grupo/equipo-computo',
  'so': '/catalogos/grupo/equipo-computo',
  'tipo-equipo': '/catalogos/grupo/equipo-computo',

  // Telefonía
  'categoria-telefonia': '/catalogos/grupo/telefonia',
  'telefonos': '/catalogos/grupo/telefonia',

  // Preguntas ahora vive dentro de Consultas → Metas, no en un grupo de Catálogos
  'preguntas': '/consultas/metas',
};
