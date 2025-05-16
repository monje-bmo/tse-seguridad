import SolicitudInfoSection from "../components/SolicitudInfoSection";
import Banner from "../components/Banner";
import React from "react";
const InformacionPublica = () => (
  <>
    <Banner
      tituloPrincipal="Información Pública"
      descripcion="Consulta datos oficiales, resultados y normativa vigentes."
    />

    <SolicitudInfoSection />
  </>
);


export default InformacionPublica