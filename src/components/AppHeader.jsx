import bannerImg from "../assets/banner-app.png";

/**
 * Encabezado del sistema interno: barra azul con título + banner gráfico.
 * Puedes insertar este componente dentro de AppLayout, encima del Outlet.
 */
export default function AppHeader({ titulo = "Sistema de Seguridad Institucional" }) {
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
          src={bannerImg}
          alt="Banner institucional TSE"
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}
