const MapaTSE = () => {
  return (
    <section className="w-full flex flex-col items-center py-12 px-4 space-y-6">
      <h2 className="text-lg md:text-xl font-semibold text-center">
        Ubicación del Tribunal Supremo Electoral
      </h2>

      <div className="w-full max-w-3xl h-72 md:h-96 rounded overflow-hidden shadow-lg border">
        
        <iframe
          title="Tribunal Supremo Electoral Guatemala"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d293207.03912083554!2d-90.70511361827865!3d14.529276103641726!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a20e69841665%3A0x5aa4e080f2a18b81!2sSupreme%20Electoral%20Tribunal!5e1!3m2!1sen!2sgt!4v1746904529672!5m2!1sen!2sgt"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </div>

      <p className="text-center text-sm md:text-base max-w-xl">
        6A Avenida 0-32, Cdad. de Guatemala 01002, Guatemala. Para obtener
        indicaciones detalladas pulsa en el mapa.
      </p>
    </section>
  );
};

export default MapaTSE;
