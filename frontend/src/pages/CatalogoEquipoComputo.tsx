import CatalogoGrupoLayout from '../components/catalogos/CatalogoGrupoLayout';

export default function CatalogoEquipoComputo() {
  return (
    <CatalogoGrupoLayout
      titulo="Catálogos · Equipo de Cómputo"
      botones={[
        { label: 'Enlace Informático', to: '/catalogos/enlace-informatico', icono: '🔗' },
        { label: 'Marcas', to: '/catalogos/marcas', icono: '🏷️' },
        { label: 'Modelos', to: '/catalogos/modelos', icono: '💻' },
        { label: 'Sistemas Operativos', to: '/catalogos/so', icono: '🖥️' },
        { label: 'Tipo de Equipo', to: '/catalogos/tipo-equipo', icono: '🗂️' },
        { label: 'Equipo de Cómputo', to: '/consultas/equipos', icono: '🖨️' },
      ]}
    />
  );
}
