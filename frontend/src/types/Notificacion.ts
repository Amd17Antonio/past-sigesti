export interface NotificacionItem {
  id: number;
  tipo: 'mantenimiento' | 'solicitud';
  titulo: string;
  mensaje: string | null;
  url: string | null;
  created_at: string;
  leida: 0 | 1;
}