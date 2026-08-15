/**
 * Filtra las opciones de estatus disponibles según el estatus ACTUAL guardado
 * en el servidor (nunca contra el valor del <select>, que es solo borrador).
 * Regla: no se puede regresar a un paso anterior ni saltar etapas.
 * 'baja' siempre queda disponible como salida, excepto si ya se está en 'baja'.
 */
export function opcionesEstatusDisponibles<T extends { value: string; label: string }>(
  estatusActual: string,
  todasLasOpciones: readonly T[],
  orden: string[],
): T[] {
  if (estatusActual === 'baja') {
    return todasLasOpciones.filter((o) => o.value === 'baja');
  }
  const idxActual = orden.indexOf(estatusActual);
  if (idxActual === -1) return [...todasLasOpciones]; // estatus no contemplado, no restringe
  return todasLasOpciones.filter(
    (o) => o.value === 'baja' || orden.indexOf(o.value) >= idxActual,
  );
}