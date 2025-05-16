import React, { useState } from "react";
import { Link /*, useLocation */ } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="w-full h-full"></div>
      <header
        className="flex justify-between items-center
                   text-black py-6 px-8 md:px-32 bg-white drop-shadow-md"
      >
        <a href="https://www.tse.org.gt/">
          <img
            src={logo}
            alt="logo"
            className="w-42 hover:scale-105 transition-all"
          />
        </a>
        <button
          className="xl:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <ul className="hidden xl:flex items-center gap-12 font-semibold text-base">
          <li className="p-3 hover:bg-sky-300 hover:text-white rounded-md transition-all cursor-pointer">
            <Link to="/">Inicio</Link>
          </li>
          <li className="p-3 hover:bg-sky-300 hover:text-white rounded-md transition-all cursor-pointer">
            <Link to="/informacion-electoral">Informacion Electoral</Link>
          </li>
          <li className="p-3 hover:bg-sky-300 hover:text-white rounded-md transition-all cursor-pointer">
            <Link to="/registro-cuidadanos">Registro Cuidadanos</Link>
          </li>
          <li className="p-3 hover:bg-sky-300 hover:text-white rounded-md transition-all cursor-pointer">
            <Link to="/informacion-publica">Informacion Publica</Link>
          </li>
          <li className="p-3 hover:bg-sky-300 hover:text-white rounded-md transition-all cursor-pointer">
            <Link to="/listado-comunidades">listado Comunidades</Link>
          </li>
        </ul>

        <Link
          to="/login"
          className="hidden xl:inline-block bg-blue-200 text-white font-semibold
                     py-3 px-6 rounded-md hover:bg-sky-500 transition-all"
        >
          Login
        </Link>
      </header>
      {open && (
        <nav className="xl:hidden bg-white drop-shadow-md">
          <ul className="flex flex-col gap-2 p-4 font-semibold">
            <li onClick={() => setOpen(false)}>
              <Link
                to="/"
                className="block p-3 rounded-md hover:bg-sky-300 hover:text-white"
              >
                Inicio
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                to="/informacion-electoral"
                className="block p-3 rounded-md hover:bg-sky-300 hover:text-white"
              >
                Información Electoral
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                to="/registro-cuidadanos"
                className="block p-3 rounded-md hover:bg-sky-300 hover:text-white"
              >
                Registro Ciudadanos
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                to="/informacion-publica"
                className="block p-3 rounded-md hover:bg-sky-300 hover:text-white"
              >
                Información Pública
              </Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link
                to="/listado-comunidades"
                className="block p-3 rounded-md hover:bg-sky-300 hover:text-white"
              >
                Listado Comunidades
              </Link>
            </li>

            {/* Login en móvil */}
            <li onClick={() => setOpen(false)}>
              <Link
                to="/login"
                className="block p-3 rounded-md bg-blue-200 text-white hover:bg-sky-500"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default NavBar;
