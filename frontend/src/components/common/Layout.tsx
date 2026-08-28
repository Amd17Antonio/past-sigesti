import { Outlet } from 'react-router-dom';
import Navbar from './Sidebar';
import logoPast from '../../assets/logo-past.png';

export default function Layout() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* El sidebar ahora es la columna izquierda de TODA la página (de arriba a abajo),
          así el morado ocupa ese lateral completo, incluyendo donde antes estaba el header */}
      <Navbar />

      {/* Columna derecha: header + contenido + footer, los tres con el mismo ancho */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="flex justify-center items-center bg-white py-2 border-b shrink-0">
          <img
            src={logoPast}
            alt="PAST - Plataforma de Atención y Soporte Tecnológico"
            className="w-full max-w-2xl h-auto max-h-20 object-contain"
          />
        </header>

        {/* overflow-x-hidden evita que aparezca una barra de scroll horizontal encima del footer
            cuando algún bloque de contenido es más ancho que la pantalla */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <main>
            <Outlet />
          </main>
        </div>

        <footer className="bg-gray-100 border-t border-purple-300 text-center text-[8px] leading-tight text-gray-700 py-[7px] px-[14px] shrink-0">
          <p>
            Ciudad Administrativa Benemérito de las Américas Edificio 4 nivel 3. Carretera Oaxaca-Istmo
            Km. 11.5, Tlalixtco de Cabrera, Oaxaca C.P. 68270.
          </p>
          <p>Conmutador (951) 501 50 00.</p>
          <p className="mt-0.5 font-medium">EXTENSIÓN:</p>
          <p>10214</p>
        </footer>
      </div>
    </div>
  );
}
