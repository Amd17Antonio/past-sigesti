interface Props {
  usuario: {
    nombre?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    extension?: string | number;
    puesto?: string;
    edificio?: string;
    nivel?: string;
    [key: string]: any;
  };
}

export default function ResumenUsuarioTelefonia({ usuario }: Props) {
  if (!usuario) return null;

  const nombreCompleto =
    [usuario.nombre, usuario.apellido_paterno, usuario.apellido_materno]
      .filter(Boolean)
      .join(' ') || '-';

  return (
    <div className="bg-slate-50 border border-blue-100 rounded-lg p-3.5 text-sm space-y-2.5 shadow-sm">
      {/* Encabezado del usuario con badge de extensión */}
      <div className="flex justify-between items-start gap-2 border-b border-slate-200 pb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Usuario Asignado
          </span>
          <span className="font-semibold text-slate-800 text-sm">
            {nombreCompleto}
          </span>
        </div>
        {usuario.extension && (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono shrink-0">
            Ext: {usuario.extension}
          </span>
        )}
      </div>

      {/* Detalles en cuadrícula limpia */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="font-medium text-slate-500 block">Puesto:</span>
          <span className="text-slate-700 font-medium">{usuario.puesto || '-'}</span>
        </div>
        <div>
          <span className="font-medium text-slate-500 block">Edificio / Nivel:</span>
          <span className="text-slate-700 font-medium">
            {usuario.edificio || '-'} / {usuario.nivel || '-'}
          </span>
        </div>
      </div>
    </div>
  );
}