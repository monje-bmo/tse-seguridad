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
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
