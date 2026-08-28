import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import InactivityWatcher from './components/common/InactivityWatcher';
import Pendientes from './pages/Pendientes';
import Asignadas from './pages/Asignadas';
import Historial from './pages/Historial';
import Dictamenes from './pages/Dictamenes';
import SolicitudNueva from './pages/SolicitudNueva';
import Identidad from './pages/Identidad';
import SolicitudInternet from './pages/SolicitudInternet';
import Solicitudes from './pages/Solicitudes';
import SolicitudTelefono from './pages/SolicitudTelefono';
import CatalogoGenerico from './pages/CatalogoGenerico';
import CatalogoTelefonos from './pages/CatalogoTelefonos';
import CatalogoUsuarios from './pages/CatalogoUsuarios';
import MantenimientosList from './pages/mantenimiento/MantenimientosList';
import CatalogoEquipos from './pages/CatalogoEquipos';
import Reportes from './pages/reportes/Reportes';
import SolicitudesUie from './pages/SolicitudesUie';
import EquiposBaja from './pages/EquiposBaja';
import Metas from './pages/consultas/Metas';
import MisAsignadas from './pages/MisAsignadas';
import SolicitudesCorreo from './pages/SolicitudesCorreo';
import SolicitudesVpn from './pages/SolicitudesVpn';
import ResguardoTelefonia from './pages/ResguardoTelefonia';
import ResguardoCorreo from './pages/ResguardoCorreo';
import ResguardoVpn from './pages/ResguardoVpn';

import CatalogoEquipoComputo from './pages/CatalogoEquipoComputo';
import CatalogoOrganizacion from './pages/CatalogoOrganizacion';
import CatalogoTelefoniaGrupo from './pages/CatalogoTelefoniaGrupo';
import CatalogoInternetGrupo from './pages/CatalogoInternetGrupo';
import CatalogoEncuestasGrupo from './pages/CatalogoEncuestasGrupo';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <InactivityWatcher />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/pendientes" element={<Pendientes />} />
          <Route path="/asignadas" element={<Asignadas />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/dictamenes" element={<Dictamenes />} />
          <Route path="/solicitudes/nueva" element={<SolicitudNueva />} />
          <Route path="/identidad" element={<Identidad />} />
          <Route path="/solicitud-correo" element={<SolicitudesCorreo />} />
          <Route path="/solicitud-vpn" element={<SolicitudesVpn />} />
          <Route path="/solicitud-internet" element={<SolicitudInternet />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/solicitud-telefono" element={<SolicitudTelefono />} />
          <Route path="/resguardo/telefonia" element={<ResguardoTelefonia />} />
          <Route path="/resguardo/correo" element={<ResguardoCorreo />} />
          <Route path="/resguardo/vpn" element={<ResguardoVpn />} />
          <Route path="/catalogos/telefonos" element={<CatalogoTelefonos />} />
          <Route path="/catalogos/:slug" element={<CatalogoGenerico />} />
          <Route path="/catalogos/usuarios" element={<CatalogoUsuarios />} />
          <Route path="/catalogos/telefonos" element={<CatalogoTelefonos />} />
          <Route path="/catalogos/:slug" element={<CatalogoGenerico />} />
          <Route path="/consultas/equipos" element={<CatalogoEquipos />} />
          <Route path="/mantenimiento" element={<MantenimientosList />} />
          <Route path="/consultas/actividades" element={<Reportes />} />
          <Route path="/solicitudes-uie" element={<SolicitudesUie />} />
          <Route path="/consultas/metas" element={<Metas />} />
          <Route path="/equipos-baja" element={<EquiposBaja />} />
          <Route path="/mis-asignadas" element={<MisAsignadas />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/catalogos/grupo/equipo-computo" element={<CatalogoEquipoComputo />} />
<Route path="/catalogos/grupo/organizacion" element={<CatalogoOrganizacion />} />
<Route path="/catalogos/grupo/telefonia" element={<CatalogoTelefoniaGrupo />} />
<Route path="/catalogos/grupo/internet" element={<CatalogoInternetGrupo />} />
<Route path="/catalogos/grupo/encuestas" element={<CatalogoEncuestasGrupo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
