import { Phone, Mail } from "lucide-react";
//import { useLocation } from "react-router-dom";

const TopBar = () => {
  //    const { pathname } = useLocation();
  //    if (pathname === "/login") return null; // No renderizar TopBar en la página de login

  return (
    <div className="w-full bg-sky-400 text-white text-sm py-1.5 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-6 justify-center md:justify-end items-center">
        {/* Teléfono */}
        <div className="flex items-center gap-1">
          <Phone size={16} className="shrink-0" />
          <span>+502 2236 5000 / 1580</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-1">
          <Mail size={16} className="shrink-0" />
          <span>unidaddeinformacion@tse.org.gt</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
