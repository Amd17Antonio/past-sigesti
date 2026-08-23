import CatalogoGrupoLayout from '../components/catalogos/CatalogoGrupoLayout';

export default function CatalogoInternetGrupo() {
  return (
    <CatalogoGrupoLayout
      titulo="Catálogos · Internet"
      botones={[
        { label: 'Autoriza Internet', to: '/catalogos/autoriza-internet', icono: '🌐' },
      ]}
    />
  );
}
