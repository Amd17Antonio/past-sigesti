import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HOME_POR_ROL, DEFAULT_HOME } from '../config/rolesConfig';
import logoPast from '../assets/logo-past.png';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const loggedUser = await login(usuario, clave);
      const rol = loggedUser?.rol?.nombre;
      navigate(HOME_POR_ROL[rol ?? ''] ?? DEFAULT_HOME);
    } catch {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Encabezado */}
      <header className="flex justify-center items-center bg-white py-3 border-b">
        <img
          src={logoPast}
          alt="PAST - Plataforma de Atención y Soporte Tecnológico"
          className="w-full max-w-2xl h-auto max-h-20 object-contain"
        />
      </header>

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-100 p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-blue-900">Iniciar sesión</h1>
              <p className="text-sm text-gray-500 mt-1">Accede con tu usuario institucional</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="usuario" className="block text-xs font-medium text-gray-600 mb-1">
                  Usuario
                </label>
                <input
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label htmlFor="clave" className="block text-xs font-medium text-gray-600 mb-1">
                  Contraseña
                </label>
                <input
                  id="clave"
                  type="password"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg p-2.5 w-full transition shadow-md shadow-indigo-600/20"
              >
                {cargando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="bg-gray-100 border-t border-blue-200 text-center text-[10px] text-gray-700 py-3 px-4">
        <p>
          Ciudad Administrativa Benemérito de las Américas Edificio 4 nivel 3. Carretera Oaxaca-Istmo
          Km. 11.5, Tlalixtco de Cabrera, Oaxaca C.P. 68270.
        </p>
        <p>Conmutador (951) 501 50 00.</p>
        <p className="mt-1 font-medium">EXTENSIÓN:</p>
        <p>10214</p>
      </footer>
    </div>
  );
}