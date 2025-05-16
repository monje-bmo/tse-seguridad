/**
 * Tabla enlazable a los PDF de comunidades por departamento (TSE).
 * Construye automáticamente la URL: https://www.tse.org.gt/images/direlec/comunidades/{CODIGO}%20{NOMBRE}.pdf
 */
export default function ComunidadesTable() {
    const departamentos = [
      "Guatemala",
      "Sacatepéquez",
      "Chimaltenango",
      "El Progreso",
      "Escuintla",
      "Santa Rosa",
      "Sololá",
      "Totonicapán",
      "Quetzaltenango",
      "Suchitepéquez",
      "Retalhuleu",
      "San Marcos",
      "Huehuetenango",
      "Quiché",
      "Baja Verapaz",
      "Alta Verapaz",
      "Petén",
      "Izabal",
      "Zacapa",
      "Chiquimula",
      "Jalapa",
      "Jutiapa",
    ];
  
    const base = "https://www.tse.org.gt/images/direlec/comunidades/";
  
    return (
      <section className="py-12 flex flex-col items-center">
        <h1 className="text-lg md:text-xl font-semibold mb-6 text-center">
          Listado de Comunidades
        </h1>
  
        <table
          className="text-sm md:text-base border-collapse"
          style={{ minWidth: "280px" }}
        >
          <tbody>
            {departamentos.map((dep, idx) => {
              const code = String(idx + 1).padStart(2, "0");
              const fileName = `${code} ${dep}`;
              const url = `${base}${encodeURIComponent(fileName)}.pdf`;
              return (
                <tr key={dep}>
                  <td className="border border-sky-600 px-3 py-1 text-center w-12 select-none">
                    {code}
                  </td>
                  <td className="border border-sky-600 px-6 py-1 whitespace-nowrap text-center">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline"
                    >
                      {dep}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  }
  