import logo from "../assets/logo.png";
import { useLocation } from "react-router-dom";

const Footer = () => {
    const { pathname } = useLocation();

    if (pathname === "/login") return null; // No renderizar footer en la página de login
 
  return (
    <footer className="w-full bg-sky-400 text-white text-center py-10 mt-16 select-none">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Tribunal Supremo Electoral" className="h-16" />
      </div>

      {/* Nombre institucional */}
      <p className="text-sm font-medium">Tribunal Supremo Electoral<br />Guatemala, C. A.</p>

      {/* Línea divisoria opcional */}
      <div className="w-full h-px bg-sky-500 my-6 opacity-30" />

      {/* Texto inferior */}
      <p className="text-xs md:text-sm px-4">
      © 2025 Tribunal Supremo Electoral – Todos los derechos reservados.
        <br />
            Este sitio web es una herramienta de información y no tiene validez legal. Para más información, visita el sitio oficial del TSE.
      </p>
    </footer>
  );
}

export default Footer;