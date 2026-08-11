// Convierte cualquier texto en formato MAC con dos puntos: XX:XX:XX:XX:XX:XX
export function formatMac(value: string): string {
  const hex = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase().slice(0, 12);
  const partes = hex.match(/.{1,2}/g) || [];
  return partes.join(':');
}

export function isValidMac(value: string): boolean {
  return /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(value);
}

// Tipos de equipo que normalmente no requieren MAC (no se conectan directo a la red con NIC propia relevante)
const PALABRAS_SIN_MAC = ['IMPRESORA', 'ROUTER', 'SWITCH', 'ESCANER', 'ESCÁNER', 'MODEM', 'MÓDEM', 'PROYECTOR', 'NOBREAK', 'REGULADOR'];

export function tipoRequiereMac(nombreTipoEquipo: string | undefined | null): boolean {
  if (!nombreTipoEquipo) return true;
  const upper = nombreTipoEquipo.toUpperCase();
  return !PALABRAS_SIN_MAC.some((p) => upper.includes(p));
}
