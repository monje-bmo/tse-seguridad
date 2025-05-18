// src/components/LogisticaPanel.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function LogisticaPanel() {
  const linkClasses = ({ isActive }) =>
    "block px-4 py-2 rounded text-sm " +
    (isActive
      ? "bg-sky-300 font-semibold text-sky-900"
      : "text-sky-700 hover:bg-sky-200");

  return (
    <aside className="fixed top-0 left-24 z-10 w-40 h-screen bg-zinc-100 shadow-lg">
      <div className="flex items-center justify-center h-16 bg-sky-200">
        <h2 className="text-lg font-semibold text-sky-900 ">Menu</h2>
      </div>
      <nav className="mt-8 flex flex-col space-y-1">
        <NavLink to="/app/logistica" end className={linkClasses}>
          Inicio
        </NavLink>
        <NavLink to="/app/logistica/info-vehiculos" className={linkClasses}>
          Reporte Información Vehiculos
        </NavLink>
        <NavLink to="/app/logistica/vehiculos-usados" className={linkClasses}>
          Reporte Vehiculos Usados
        </NavLink>
      </nav>
    </aside>
  );
}
