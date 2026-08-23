import CatalogoGrupoLayout from '../components/catalogos/CatalogoGrupoLayout';

export default function CatalogoTelefoniaGrupo() {
  return (
    <CatalogoGrupoLayout
      titulo="Catálogos · Telefonía"
      botones={[
        { label: 'Categorías de Telefonía', to: '/catalogos/categoria-telefonia', icono: '📶' },
        { label: 'Teléfonos', to: '/catalogos/telefonos', icono: '📞' },
      ]}
    />
  );
}
