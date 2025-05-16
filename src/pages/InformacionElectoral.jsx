import React from "react";
import Banner from "../components/Banner";
import AuditoriaSection from "../components/AuditoriaSection";

const InformacionElectoral = () => {
  return (
    <>
      <Banner
        tituloPrincipal="Informacion Electoral"
        descripcion="Consulta datos oficiales, resultados y normativa vigente del proceso electoral."
      />
      
      <AuditoriaSection />
    </>
  );
};

export default InformacionElectoral;
