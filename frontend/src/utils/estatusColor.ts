export function colorPorEstatus(estatus: string): string {
  const mapa: Record<string, string> = {
    // Internet (nombres ya existentes en tu BD)
    generado_uie: '#9CA3AF',
    atendiendo_dt: '#CDDC39',
    eliminado: '#DC2626',
    // Teléfono / VPN / Correo
    creado_cgd: '#9CA3AF',
    atendiendo_dgti: '#CDDC39',
    // Compartidos por todos los módulos
    activo: '#16A34A',
    baja: '#DC2626',
  };
  return mapa[estatus] ?? '#9CA3AF';
}