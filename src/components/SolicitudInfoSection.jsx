import { useState } from "react";

export default function SolicitudInfoSection() {
  const [acepto, setAcepto] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!acepto) {
      alert("Debes aceptar los términos de Ley para enviar la solicitud.");
      return;
    }
    alert("Solicitud enviada (demo)");
  }

  const sectionBox = "border border-gray-300 rounded mb-8";
  const sectionHeader =
    "bg-sky-700 text-white text-sm md:text-base font-semibold px-4 py-2 rounded-t";
  const inputBase =
    "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-sky-300";

  return (
    <section className="max-w-2xl mx-auto py-12 px-4 text-gray-800 text-sm md:text-base">
      {/* Título principal */}
      <h1 className="text-center text-base md:text-lg font-semibold uppercase mb-6">
        Solicitud de Información en Línea
      </h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Datos solicitante */}
        <div className={sectionBox}>
          <div className={sectionHeader}>Datos del Solicitante o Representante</div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nombres y Apellidos</label>
              <input type="text" required className={inputBase} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Número DPI</label>
              <input type="text" required className={inputBase} />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className={sectionBox}>
          <div className={sectionHeader}>
            Datos de Contacto del Solicitante o Representante
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Correo Electrónico:</label>
              <input type="email" required className={inputBase} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Teléfono</label>
              <input type="tel" required className={inputBase} />
            </div>
          </div>
        </div>

        {/* Solicitud */}
        <div className={sectionBox}>
          <div className={sectionHeader}>Solicitud</div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium">
                Descripción de la Información Solicitada
              </label>
              <textarea rows="4" required className={inputBase + " resize-none"} />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Firma Digital (Escriba su nombre completo como Aceptación a los
                términos de esta Solicitud.)
              </label>
              <input type="text" required className={inputBase} />
            </div>
            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="acepto"
                checked={acepto}
                onChange={(e) => setAcepto(e.target.checked)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-600 border-gray-300 rounded"
              />
              <label htmlFor="acepto" className="select-none text-xs md:text-sm">
                Acepto los términos de Ley para ENVIAR la solicitud.
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 inline-block bg-sky-600 text-white font-semibold px-6 py-2 rounded hover:bg-sky-700 transition-colors disabled:opacity-50"
              disabled={!acepto}
            >
              Enviar
            </button>
          </div>
        </div>
      </form>

      {/* Aviso legal */}
      <p className="text-xs leading-relaxed font-medium text-gray-700 mb-6">
        Los interesados tendrán responsabilidad penal y civil por el uso, manejo y
        difusión de la información obtenida. Artículo 15, Ley de Acceso a la Información
        Pública.
      </p>

      {/* Observaciones */}
      <h2 className="font-semibold text-sm mb-2">Observaciones</h2>
      <ul className="list-disc space-y-1 pl-6 text-xs md:text-sm">
        <li>Llenar todos los campos requeridos resaltados y marcados con un asterisco (*).</li>
        <li>Cada requerimiento debe individualizarse.</li>
        <li>Los datos de la solicitud deben ser claros y precisos.</li>
        <li>
          Toda solicitud desde el momento que es admitida, aplicará lo establecido en el
          Artículo 42 de la Ley de Acceso a la Información Pública.
        </li>
        <li>
          Cuando la Información solicitada no sea competencia del Tribunal Supremo
          Electoral, la Unidad de Información Pública le notificará en un plazo de 5 días
          siguientes a la solicitud.
        </li>
      </ul>
    </section>
  );
}
