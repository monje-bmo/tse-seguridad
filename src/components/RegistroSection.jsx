import { useState } from "react";

// Ajusta las rutas según tu estructura de assets
import uneLogo from "../assets/parties/une.png";
import semillaLogo from "../assets/parties/semilla.png";
import creoLogo from "../assets/parties/creo.png";
import panLogo from "../assets/parties/pan.jpg";
import MapaTSE from "./MapaTSE";

export default function RegistroSection() {
  /**
   * Mini handler para el demo; sólo previene el envío real
   */
  function handleSubmit(e) {
    e.preventDefault();
    alert("Formulario enviado (demo)");
  }

  return (
    <section className="max-w-3xl mx-auto py-12 px-4 space-y-12 text-gray-800">
      {/* Intro */}
      <p className="leading-relaxed text-sm md:text-base">
        A partir del 15 de septiembre de 1985 se decreta una nueva Constitución
        de la República de Guatemala que contempla un Registro Electoral como
        órgano administrativo permanente a cargo de un Director, designado por
        el Organismo Ejecutivo por un período de cuatro años y un Consejo
        Electoral que conoce de todos los procedimientos en materia electoral y
        está presidido por el Director del Registro Electoral, un miembro de los
        partidos políticos, un miembro por el Congreso de la República y un
        miembro designado por el Consejo de Estado.
      </p>

      {/* Listado partidos */}
      <h2 className="text-lg md:text-xl font-semibold pb-2 border-b border-gray-300 w-max">
        Listado Partidos Electorales
      </h2>

      <div className="flex flex-wrap items-center gap-6 pt-4">
        {[uneLogo, semillaLogo, creoLogo, panLogo].map((logo, idx) => (
          <img
            key={idx}
            src={logo}
            alt="Logo partido"
            className="h-32 md:h-38 w-auto"
          />
        ))}
      </div>

      <hr className="border-t my-8" />

      {/* Contacto */}
      <h3 className="text-lg md:text-xl font-semibold mb-4">Contáctenos</h3>
      <p className="text-sm md:text-base leading-relaxed mb-8">
        Si deseas registrar un nuevo partido político, te invitamos a acercarte
        a la brevedad. Cuéntanos los detalles de tu iniciativa y te explicamos
        el proceso; sin información preliminar no podremos darte una lista de
        documentos necesarios para comenzar de forma correcta.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 text-sm md:text-base">
        {/* Nombre representante */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="nombre">
              Nombre(s) Representante:
            </label>
            <input
              type="text"
              id="nombre"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="apellido">
              Apellido(s):
            </label>
            <input
              type="text"
              id="apellido"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="font-medium" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-sky-300"
          />
        </div>

        {/* Nombre partido */}
        <div className="flex flex-col">
          <label className="font-medium" htmlFor="partido">
            Nombre Partido:
          </label>
          <input
            type="text"
            id="partido"
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-sky-300"
          />
        </div>

        {/* Iniciativa textarea */}
        <div className="flex flex-col">
          <label className="font-medium" htmlFor="objetivos">
            Iniciativa y objetivos del Partido:
          </label>
          <textarea
            id="objetivos"
            rows="5"
            required
            className="border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring focus:ring-sky-300"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="inline-block bg-sky-500 text-white font-semibold px-8 py-2 rounded hover:bg-sky-600 transition-colors"
        >
          Enviar
        </button>
      </form>
      <MapaTSE />
    </section>
  );
}
