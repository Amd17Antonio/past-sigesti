import CatalogoGrupoLayout from '../components/catalogos/CatalogoGrupoLayout';

export default function CatalogoOrganizacion() {
  return (
    <CatalogoGrupoLayout
      titulo="Catálogos · Organización"
      botones={[
        { label: 'Áreas', to: '/catalogos/areas', icono: '🏢' },
        { label: 'Cargos', to: '/catalogos/cargos', icono: '🧑‍💼' },
        { label: 'POA', to: '/catalogos/poa', icono: '📊' },
        { label: 'Autoriza Internet', to: '/catalogos/autoriza-internet', icono: '🌐' },
      ]}
    />
  );
}
