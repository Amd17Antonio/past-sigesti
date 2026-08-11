import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axiosClient from '../api/axiosClient';

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

interface User {
  id: number;
  usuario: string;
  nombre: string;
  rol_id: number;
  rol: Rol;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (usuario: string, clave: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    if (stored && token) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (usuario: string, clave: string) => {
    const { data } = await axiosClient.post('/login', { usuario, clave });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUser(data.usuario);
    return data.usuario as User;
  };

  const logout = async () => {
    try {
      await axiosClient.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
