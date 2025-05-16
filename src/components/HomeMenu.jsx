// src/components/HomeMenu.tsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  UserCircle,
  Car,
  Users,
  ClipboardList,
  IdCard,
  LogOut,
} from "lucide-react";

const Card = ({
  to,
  icon: Icon,
  label,
  onClick,
}) => {
  const base =
       "flex flex-col items-center justify-center gap-2 w-44 h-44 border-2 border-sky-300 rounded-md hover:bg-sky-50";
  if (to)
    return (
      <NavLink
        to={to}
        className="flex flex-col items-center gap-0.5 font-medium text-sky-800"
      >
        <div className={base}>
          <Icon size={64} strokeWidth={1.5} />
        </div>
        <span className="mt-2 text-center text-sm font-semibold leading-tight w-40">
          {label}
        </span>
      </NavLink>
    );

  // para Salir
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 font-medium text-sky-800"
    >
      <div className={base}>
        <Icon size={64} strokeWidth={1.5} />
      </div>
      <span className="mt-2 text-center text-sm font-semibold leading-tight w-40">
        {label}
      </span>
    </button>
  );
};

export default function HomeMenu() {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col items-center">
      <h1 className="text-6xl font-semibold mb-6">Bienvenido</h1>

      {/* grid 2 × 3 */}
      <div className="grid gap-10 place-items-center sm:grid-cols-2 lg:grid-cols-3">
        <Card to="man-user" icon={UserCircle} label="Mantenimineto Usuarios" />
        <Card to="logistica" icon={Car} label="Logística de transporte" />
        <Card
          to="control-acceso"
          icon={Users}
          label="Control de acceso de áreas"
        />
        <Card
          to="control-acceso-voto"
          icon={ClipboardList}
          label="Control de acceso de áreas (Visitas)"
        />
        <Card
          to="credenciales"
          icon={IdCard}
          label="Control de identificación"
        />
        <Card
          icon={LogOut}
          label="Salir"
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/login", { replace: true });
          }}
        />
      </div>
    </section>
  );
}
