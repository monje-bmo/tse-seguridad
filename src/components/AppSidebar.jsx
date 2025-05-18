import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  UserCircle,
  Car,
  Users,
  ClipboardList,
  IdCard,
  LogOut,
} from "lucide-react";
import logo from "../assets/logo.png"; // logo azul TSE
import seal from "../assets/logo_u.png"; // sello circular (pie)
import LogisticaPanel from "./LogisticaPanel";

const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "flex flex-col items-center gap-0.5 py-6 text-xs font-medium " +
      (isActive ? "text-white" : "text-sky-950 hover:text-sky-500")
    }
  >
    <Icon size={28} strokeWidth={1.5} />
    <span className="mt-1 leading-none w-20 text-center">{label}</span>
  </NavLink>
);

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const inLogistica = location.pathname.startsWith("/app/logistica");
  return (
    <>
      <aside className=" fixed top-0 left-0 z-20 w-24 h-screen bg-sky-200 flex flex-col justify-between items-center text-sky-900">
        {/* top logo */}
        <img
          to="/app"
          src={logo}
          alt="TSE"
          className="h-14 mt-4"
          onClick={() => navigate("/app")}
        />

        {/* nav items */}
        <nav className="flex-1 w-full flex flex-col items-center">
          <Item to="/app/man-user" icon={UserCircle} label="Mantenimiento Usuarios" />
          <Item
            to="/app/logistica"
            icon={Car}
            label="Logística de transporte"
          />
          <Item
            to="/app/control-acceso"
            icon={Users}
            label="Control de acceso de areas"
          />
          <Item
            to="/app/control-acceso-voto"
            icon={ClipboardList}
            label="Control de acceso de areas (Visitas)"
          />
          <Item
            to="/app/credenciales"
            icon={IdCard}
            label="Control de identificacion"
          />
        </nav>

        {/* sello / logout */}
        <button
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/login", { replace: true });
          }}
          className="mb-4 flex flex-col items-center gap-1 text-xs text-sky-950 hover:text-sky-500"
        >
          <LogOut size={24} />
          Salir
        </button>

        <a href="https://umg.edu.gt/" target="_blank" rel="noopener noreferrer">
          {" "}
          <img src={seal} alt="Sello TSE" className="h-16 mb-4" />
        </a>
      </aside>
      {inLogistica && <LogisticaPanel />}
    </>
  );
}
