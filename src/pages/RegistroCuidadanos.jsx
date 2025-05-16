import React from 'react'
import Banner from '../components/Banner'
import RegistroSection from '../components/RegistroSection';
const RegistroCuidadanos = () => {
  return (
    <>
        <Banner
          tituloPrincipal="Registro Cuidadano"
          descripcion="Inscribe tu Partido Electoral."
        />
        <RegistroSection/>
    </>
  );
}

export default RegistroCuidadanos