import { useAuth } from '../context/AuthContext';

export default function Identidad() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Mi Identidad</h1>
      <div className="bg-white border rounded p-4 space-y-2">
        <p><span className="font-semibold">Usuario:</span> {user?.usuario}</p>
        <p><span className="font-semibold">Nombre:</span> {user?.nombre}</p>
        <p><span className="font-semibold">Rol:</span> {user?.rol?.nombre}</p>
      </div>
    </div>
  );
}