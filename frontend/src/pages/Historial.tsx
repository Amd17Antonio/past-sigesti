import { useAuth } from '../context/AuthContext';
import HistorialAdmin from './HistorialAdmin';
import HistorialTecnico from './HistorialTecnico';
import HistorialSolicitante from './HistorialSolicitante';

export default function Historial() {
  const { user } = useAuth();
  const rol = user?.rol?.nombre;

  if (rol === 'Soporte Técnico') return <HistorialTecnico />;
  if (rol === 'Usuario Solicitante') return <HistorialSolicitante />;
  return <HistorialAdmin />; // Administrador
}