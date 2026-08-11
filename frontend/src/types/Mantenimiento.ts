export type SemaforoColor = 'rojo' | 'amarillo' | 'verde';

export interface MantenimientoRegistro {
  id: number;
  id_equipo: number;
  fecha_mantenimiento: string;
  proxima_fecha: string | null;
  tipo: string | null;
  descripcion: string | null;
  usr: string | null;
  fechausr: string | null;
}

export interface EquipoConSemaforo {
  id: number;
  no_inventario: string | null;
  no_serie?: string | null;
  tipo: string | null;
  marca?: string | null;
  Resguardante?: string | null;
  Usuario?: string | null;
  fecha_mantenimiento: string | null;
  proxima_fecha: string | null;
  tipo_mantenimiento?: string | null;
  semaforo_color: SemaforoColor;
  semaforo_motivo: string;
  semaforo_dias_restantes: number | null;
}