import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import AppLayoutBare from "./layouts/AppLayoutBare";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import InformacionElectoral from "./pages/InformacionElectoral";
import InformacionPublica from "./pages/InformacionPublica";
import ListadoComunidades from "./pages/ListadoComunidades";
import RegistroCiudadanos from "./pages/RegistroCuidadanos";
import LoginPage from "./pages/LoginPage";

// pages users
import MantenimientoUsuarios from "./pages/MantenimientoUsuarios";
import Report1 from "./pages/Report1";
import Report2 from "./pages/Report2";
import Report3 from "./pages/Report3";
import Report4 from "./pages/Report4";
import Report5 from "./pages/Report5";
import SubMenuL from "./pages/SubMenuL";

// pantallas internas (crea stubs por ahora)
const Dashboard = () => <h1 className="text-xl"></h1>;

function App() {
  return (
    <Router>
      <Routes>
        {/* ----------- SITIO PÚBLICO ----------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/informacion-electoral"
            element={<InformacionElectoral />}
          />
          <Route path="/registro-cuidadanos" element={<RegistroCiudadanos />} />
          <Route path="/informacion-publica" element={<InformacionPublica />} />
          <Route path="/listado-comunidades" element={<ListadoComunidades />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ---------- APLICACIÓN INTERNA ---------- */}
        <Route element={<PrivateRoute />}>
          {/* layout completo con menú */}
          <Route path="app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            {/* …otras pantallas con header y menú… */}
          </Route>

          {/* layout bare SOLO para man-user */}
          <Route path="app" element={<AppLayoutBare />}>
            <Route path="man-user" element={<MantenimientoUsuarios />} />
            <Route path="control-acceso" element={<Report1 />} />
            <Route path="control-acceso-voto" element={<Report2 />} />
            <Route path="credenciales" element={<Report3 />} />
            <Route path="logistica" element={<SubMenuL />} />

            <Route path="logistica/info-vehiculos" element={<Report4 />} />
            <Route path="logistica/vehiculos-usados" element={<Report5 />} />
          </Route>
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
