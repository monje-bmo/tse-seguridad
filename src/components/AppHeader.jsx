import React from "react";
import PropTypes from "prop-types";
import bannerDefault from "../assets/banner-app.png";

/**
 * Encabezado del sistema interno: barra azul con título + banner gráfico.
 * Puedes insertar este componente dentro de AppLayout, encima del Outlet.
 *
 * Props:
 *  - titulo: texto del encabezado.
 *  - bannerSrc: URL o import de la imagen del banner. Por defecto usa bannerDefault.
 *  - bannerAlt: texto alternativo de la imagen.
 */
export default function AppHeader({
  titulo = "Sistema de Seguridad Institucional",
  bannerSrc = bannerDefault,
  bannerAlt = "Banner institucional TSE",
}) {
  return (
    <header className="w-full">
      {/* Barra superior con título */}
      <div className="bg-sky-200 text-center py-2 border-b border-sky-200 shadow-inner">
        <h1 className="text-xl md:text-2xl font-bold text-sky-900 tracking-wide select-none">
          {titulo}
        </h1>
      </div>

      {/* Imagen banner */}
      <div className="w-full h-60 md:h-64 overflow-hidden">
        <img
          src={bannerSrc}
          alt={bannerAlt}
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}

AppHeader.propTypes = {
  titulo: PropTypes.string,
  bannerSrc: PropTypes.string,
  bannerAlt: PropTypes.string,
};
