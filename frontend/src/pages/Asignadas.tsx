import { useAuth } from '../context/AuthContext';
import AsignadasAdmin from './AsignadasAdmin';
import AsignadasTecnico from './AsignadasTecnico';

export default function Asignadas() {
  const { user } = useAuth();
  const rol = user?.rol?.nombre;

  if (rol === 'Soporte Técnico') {
    return <AsignadasTecnico />;
  }

  return <AsignadasAdmin />;
}