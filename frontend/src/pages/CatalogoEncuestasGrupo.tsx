import CatalogoGrupoLayout from '../components/catalogos/CatalogoGrupoLayout';

export default function CatalogoEncuestasGrupo() {
  return (
    <CatalogoGrupoLayout
      titulo="Catálogos · Encuestas"
      botones={[
        { label: 'Preguntas (Encuesta)', to: '/catalogos/preguntas', icono: '📝' },
      ]}
    />
  );
}
