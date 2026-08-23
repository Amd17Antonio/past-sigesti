import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import logoPast from '../../assets/logo-past.png';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-center items-center bg-white py-2 border-b">
  <img
    src={logoPast}
    alt="PAST - Plataforma de Atención y Soporte Tecnológico"
    className="w-full max-w-2xl h-auto max-h-20 object-contain"
  />
</header>

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-100 border-t border-purple-300 text-center text-[10px] text-gray-700 py-3 px-4">
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