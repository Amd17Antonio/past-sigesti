export interface CampoConfig {
  name: string;
  label: string;
  required?: boolean;
  tipo?: 'text' | 'select' | 'email';
  opciones?: string;
}

export interface CatalogoConfig {
  slug: string;
  titulo: string;
  campoLabel: string;
  campos: CampoConfig[];
}

export const CATALOGOS: CatalogoConfig[] = [
  { slug: 'areas', titulo: 'Áreas', campoLabel: 'area', campos: [
    { name: 'area', label: 'Área', required: true },
    { name: 'siglas', label: 'Siglas' },
    { name: 'titular', label: 'Titular' },
  ]},
  { slug: 'marcas', titulo: 'Marcas', campoLabel: 'marca', campos: [
    { name: 'marca', label: 'Marca', required: true },
  ]},
  { slug: 'modelos', titulo: 'Modelos', campoLabel: 'modelo', campos: [
    { name: 'id_marca', label: 'Marca', required: true, tipo: 'select', opciones: 'marcas' },
    { name: 'modelo', label: 'Modelo', required: true },
  ]},
  { slug: 'tipo-equipo', titulo: 'Tipo de Equipo', campoLabel: 'TipoEquipo', campos: [
    { name: 'TipoEquipo', label: 'Tipo de Equipo', required: true },
  ]},
  { slug: 'so', titulo: 'Sistemas Operativos', campoLabel: 'sistema', campos: [
    { name: 'sistema', label: 'Sistema Operativo', required: true },
  ]},
  { slug: 'cargos', titulo: 'Cargos', campoLabel: 'cargo', campos: [
    { name: 'cargo', label: 'Cargo', required: true },
  ]},
  { slug: 'autoriza-internet', titulo: 'Autoriza Internet', campoLabel: 'nombre', campos: [
    { name: 'nombre', label: 'Nombre', required: true },
    { name: 'cargo', label: 'Cargo' },
    { name: 'correo', label: 'Correo', tipo: 'email' },
  ]},
  { slug: 'categoria-telefonia', titulo: 'Categorías de Telefonía', campoLabel: 'categoria', campos: [
    { name: 'categoria', label: 'Categoría', required: true },
    { name: 'descripcion', label: 'Descripción' },
  ]},
  { slug: 'enlace-informatico', titulo: 'Enlace Informático', campoLabel: 'enlace', campos: [
    { name: 'enlace', label: 'Enlace', required: true },
    { name: 'puesto', label: 'Puesto' },
    { name: 'correo', label: 'Correo', tipo: 'email' },
    { name: 'ext', label: 'Extensión' },
  ]},
  { slug: 'poa', titulo: 'POA', campoLabel: 'poa', campos: [
    { name: 'poa', label: 'POA', required: true },
  ]},
  { slug: 'preguntas', titulo: 'Preguntas (Encuesta)', campoLabel: 'pregunta', campos: [
    { name: 'pregunta', label: 'Pregunta', required: true },
  ]},
  { slug: 'administrativo', titulo: 'Administrativo (Enterado)', campoLabel: 'nombre', campos: [
    { name: 'nombre', label: 'Nombre Completo', required: true },
    { name: 'puesto', label: 'Puesto' },
    { name: 'correo', label: 'Correo', tipo: 'email' },
    { name: 'ext', label: 'Extensión' },
  ]},
];
