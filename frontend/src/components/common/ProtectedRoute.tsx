import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { rolTienePermiso } from '../../config/rolesConfig';
import type { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-10 text-center">Cargando...</div>;
  if (!user) return <Navigate to="/" replace />;

  const rol = user.rol?.nombre;

  if (!rolTienePermiso(rol, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
