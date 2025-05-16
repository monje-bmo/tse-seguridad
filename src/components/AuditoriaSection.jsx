/**
 * Sección con la estructura mostrada en la captura (título, subtítulo, quote y lista)
 * usando contenido resumido de la página "Auditoría Electoral" del TSE.
 */
export default function AuditoriaSection() {
    return (
      <section className="max-w-3xl mx-auto py-12 px-4 space-y-12 text-gray-800">
        {/* Intro */}
        <p className="text-base md:text-lg leading-relaxed">
          La Auditoría Electoral es el mecanismo mediante el cual el Tribunal Supremo
          Electoral verifica, controla y fiscaliza cada etapa del proceso electoral,
          garantizando la transparencia, legalidad y legitimidad de los resultados.
        </p>
  
        {/* Subtítulo + párrafo */}
        <div className="space-y-4">
          <h2 className="text-sm md:text-base font-semibold uppercase tracking-wide">
            Objetivo General
          </h2>
          <p className="text-sm md:text-base leading-relaxed">
            Supervisar el cumplimiento de las disposiciones contenidas en la Ley Electoral y de
            Partidos Políticos, asegurando que los actores involucrados —funcionarios electorales,
            partidos políticos y ciudadanía— actúen en apego a la normativa vigente.
          </p>
        </div>
  
        {/* Separador + quote */}
        <hr className="border-t my-8" />
        <p className="text-center font-medium md:text-lg max-w-2xl mx-auto">
          «La auditoría constituye un procedimiento permanente y sistemático de observación,
          evaluación y corrección de los procesos comiciales en Guatemala.»
        </p>
        <p className="text-xs text-center italic mt-2">
          Fuente: Manual de Auditoría Electoral, TSE
        </p>
        <hr className="border-t my-8" />
  
        {/* Lista en dos columnas */}
        <h3 className="text-base md:text-lg font-semibold mb-4">Funciones principales</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm md:text-base">
          <ul className="list-disc space-y-2 pl-6 text-justify md:text-left">
            <li>Fiscalizar la organización y funcionamiento de las Juntas Electorales.</li>
            <li>Verificar la correcta integración de padrones y centros de votación.</li>
            <li>Supervisar la capacitación de los miembros de mesa y personal de apoyo.</li>
            <li>Controlar la logística de distribución de material electoral.</li>
            <li>Observar el escrutinio y transmisión de resultados preliminares.</li>
          </ul>
          <ul className="list-disc space-y-2 pl-6 text-justify md:text-left">
            <li>Documentar incidentes y elevar informes a la autoridad electoral.</li>
            <li>Emitir recomendaciones para corregir hallazgos durante y después de la elección.</li>
            <li>Coordinar con misiones de observación nacional e internacional.</li>
            <li>Vigilar el cumplimiento de los plazos legales y administrativos.</li>
            <li>Promover la transparencia y acceso a la información para la ciudadanía.</li>
          </ul>
        </div>
      </section>
    );
  }
  