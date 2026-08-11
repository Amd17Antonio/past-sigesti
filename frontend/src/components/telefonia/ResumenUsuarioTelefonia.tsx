export default function ResumenUsuarioTelefonia({ usuario }: { usuario: any }) {
  return (
    <div className="text-sm bg-gray-50 p-2 rounded space-y-1">
      <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno}</p>
      <p><strong>Extensión:</strong> {usuario.extension}</p>
      <p><strong>Puesto:</strong> {usuario.puesto || '-'}</p>
      <p><strong>Edificio / Nivel:</strong> {usuario.edificio || '-'} / {usuario.nivel || '-'}</p>
    </div>
  );
}