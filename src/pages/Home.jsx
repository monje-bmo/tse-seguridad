import misionImg from "../assets/mision.jpg"; // cambia la ruta según tu estructura
import visionImg from "../assets/vision.jpg";
import Banner from "../components/Banner";

export default function AboutSection() {
  return (
    <>
      <Banner />
      <section className="max-w-4xl mx-auto py-12 px-4 text-center space-y-12">
        {/* Título principal */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold italic">
            ¿Quiénes Somos?
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            El Tribunal Supremo Electoral es la máxima autoridad en materia
            electoral. Es independiente y por consiguiente no supeditado a
            organismo alguno del Estado. Su organización, funcionamiento y
            atribuciones están determinados en la Ley.
          </p>
        </div>

        {/* Sección Misión */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Imagen */}
          <img src={misionImg} alt="Misión" className="w-64 md:w-72 mx-auto" />

          {/* Texto */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-semibold border-t border-gray-300 pt-2 w-max mx-auto md:mx-0">
              Misión
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-justify md:text-left">
              Somos la máxima autoridad en materia electoral, independiente, no
              supeditada a organismo alguno del Estado, que promueve el
              ejercicio de la ciudadanía plena, igualitaria e inclusiva y la
              participación de las organizaciones políticas, para garantizar el
              derecho de elegir y ser electo, así como facilita el óptimo
              funcionamiento de los órganos electorales temporales, con el fin
              de alcanzar la consolidación de la democracia.
            </p>
          </div>
        </div>

        {/* Sección Visión (invertimos el orden en pantallas md+) */}
        <div className="grid md:grid-cols-2 gap-8 items-center md:grid-flow-col-dense">
          {/* Texto */}
          <div className="space-y-4 order-2 md:order-1">
            <h3 className="text-lg md:text-xl font-semibold border-t border-gray-300 pt-2 w-max mx-auto md:mx-0">
              Visión
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-justify md:text-left">
              Ser la institución rectora, de rango constitucional, que oriente,
              fomente e incremente la participación ciudadana en el voto
              responsable y consciente; que fortalezca la evolución y el
              desarrollo del sistema democrático, el respeto pleno y garantía de
              la voluntad popular en los procesos electorales, transparentes e
              incluyentes, manteniendo la confianza ciudadana en la justicia
              electoral permanentemente.
            </p>
          </div>

          {/* Imagen */}
          <img
            src={visionImg}
            alt="Visión"
            className="w-64 md:w-72 mx-auto order-1 md:order-2"
          />
        </div>
      </section>
    </>
  );
}
