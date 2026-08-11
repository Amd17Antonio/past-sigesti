import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HOME_POR_ROL, DEFAULT_HOME } from '../config/rolesConfig';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // IMPORTANTE: esto asume que tu función login() del AuthContext
      // devuelve el usuario logueado (con su rol) al resolverse.
      // Si login() no devuelve nada actualmente, agrega un `return usuario;`
      // al final de esa función en AuthContext.tsx.
      const loggedUser = await login(usuario, clave);
      const rol = loggedUser?.rol?.nombre;
      navigate(HOME_POR_ROL[rol ?? ''] ?? DEFAULT_HOME);
    } catch {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <input value={usuario} onChange={(e) => setUsuario(e.target.value)}
        placeholder="Usuario" className="border p-2 w-full" />
      <input type="password" value={clave} onChange={(e) => setClave(e.target.value)}
        placeholder="Contraseña" className="border p-2 w-full" />
      {error && <p className="text-red-500">{error}</p>}
      <button className="bg-purple-800 text-white p-2 w-full">Entrar</button>
    </form>
  );
}
