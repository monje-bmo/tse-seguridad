// src/components/HomeMenu.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { Car, Info } from "lucide-react";

import AppHeader from "./AppHeader";
import img from "../assets/transporte.jpg";

const Card = ({ to, icon: Icon, label, onClick }) => {
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

export default function LogisticaMenu() {
  const navigate = useNavigate();

  return (
    <>
      <AppHeader
        titulo="Reportes de Logística"
        bannerSrc={img}
        bannerAlt="img modulo transporte"
      />
      <section className="w-full flex flex-col items-center">
        <h1 className="text-6xl font-semibold mb-6">Reportes de Logística</h1>

        {/* grid 2 × 3 */}
        <div className="grid gap-10 place-items-center sm:grid-cols-2 lg:grid-cols-2">
          <Card
            to="/app/logistica/info-vehiculos"
            icon={Info}
            label="Reporte Información Vehiculos"
          />
          <Card to="/app/logistica/vehiculos-usados" icon={Car} label="Reporte Vehiculos Usados" />
        </div>
      </section>
    </>
  );
}
