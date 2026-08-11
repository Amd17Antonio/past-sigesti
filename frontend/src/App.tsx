import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
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


function App() {
  return (
    <BrowserRouter>
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
          <Route path="/solicitud-internet" element={<SolicitudInternet />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/solicitud-telefono" element={<SolicitudTelefono />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;