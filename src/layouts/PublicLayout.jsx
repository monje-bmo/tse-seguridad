import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function PublicLayout() {
  const { pathname } = useLocation();
  // opcional: oculta NavBar + TopBar en /login si así lo prefieres
  const hideBars = pathname === "/login";

  return (
    <>
      <TopBar />
      <NavBar />
      <Outlet />
      {!hideBars && <Footer />}
    </>
  );
}
