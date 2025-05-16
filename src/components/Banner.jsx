import heroImg from "../assets/banner_tse.jpg";

/**
 * Banner reutilizable.
 *
 * @param {string} tituloPrincipal   Texto principal (primera línea).
 * @param {string} [tituloSecundario] Texto opcional que aparecerá debajo del principal.
 * @param {string} descripcion       Descripción bajo el título.
 */
export default function Banner({
  tituloPrincipal = "Tribunal Supremo Electoral",
  tituloSecundario, // opcional ➜ undefined por defecto
  descripcion = "Sistema de Información — Seguridad Institucional",
}) {
  return (
    <section className="relative w-full min-h-[420px] overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={heroImg}
        alt="Fachada Tribunal Supremo Electoral"
        className="absolute inset-0 w-full h-full object-cover "
      />

      {/* Capa de tinte azul (opcional) */}
      <div className="absolute inset-0 bg-sky-100 mix-blend-multiply" />

      {/* Texto superpuesto desplazado a la izquierda */}
      <div
        className="relative z-10 h-full flex flex-col justify-center items-center md:items-start text-center md:text-left text-white space-y-4 p-65 md:pl-32 md:pr-16"
      >
        <h1 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow">
          {tituloPrincipal}
          {tituloSecundario && (
            <>
              <br />
              {tituloSecundario}
            </>
          )}
        </h1>
        {descripcion && (
          <p className="text-lg md:text-2xl max-w-xl drop-shadow">{descripcion}</p>
        )}
      </div>
    </section>
  );
}
