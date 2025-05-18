// src/components/AccesosTableWithChart.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Registramos los módulos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AccesosTableWithChart() {
  // estados
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const containerRef = useRef(null); // Referencia para el contenedor completo
  const tableRef = useRef(null); // Referencia separada para la tabla

  // fetch datos
  useEffect(() => {
    fetch("http://localhost:3001/api/reportes/report1")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  // lista única de áreas
  const areaOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.area_restrictiva))),
    [data]
  );

  // filtrado
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const entrada = new Date(item.FechaHora_Entrada);
      if (startDate && entrada < new Date(startDate)) return false;
      if (endDate && entrada > new Date(endDate)) return false;
      if (selectedArea && item.area_restrictiva !== selectedArea) return false;
      const term = searchTerm.toLowerCase();
      if (term) {
        const nombreMatch = item.nombre.toLowerCase().includes(term);
        const dniMatch = String(item.dni).toLowerCase().includes(term);
        if (!nombreMatch && !dniMatch) return false;
      }
      return true;
    });
  }, [data, startDate, endDate, selectedArea, searchTerm]);

  // paginación manual
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  // datos para gráfico de barras
  const barData = useMemo(() => {
    const cnt = {};
    filtered.forEach((i) => {
      cnt[i.Metodo_Autenticacion] = (cnt[i.Metodo_Autenticacion] || 0) + 1;
    });
    return {
      labels: Object.keys(cnt),
      datasets: [
        {
          label: "Cantidad de Accesos",
          data: Object.values(cnt),
          backgroundColor: "rgba(37, 99, 235, 0.7)",
        },
      ],
    };
  }, [filtered]);

  const barOpts = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Accesos por Método de Autenticación" },
    },
  };

  // datos para gráfico de pie (accesos por año)
  const pieData = useMemo(() => {
    const cntAnios = {};
    filtered.forEach((i) => {
      const d = new Date(i.FechaHora_Entrada);
      const anio = d.getFullYear();
      cntAnios[anio] = (cntAnios[anio] || 0) + 1;
    });
    const labels = Object.keys(cntAnios).sort(); // ej. ["2022","2023","2024"]
    const dataValues = labels.map((y) => cntAnios[y]);

    const bgColors = labels.map(
      (_, idx) => `hsl(${(idx * 360) / labels.length}, 70%, 60%)`
    );

    return {
      labels, // "2022", "2023", …
      datasets: [
        {
          label: "Accesos por Año",
          data: dataValues,
          backgroundColor: bgColors,
        },
      ],
    };
  }, [filtered]);

  // export PDF - Método optimizado para página única
  const exportPDF = async () => {
    try {
      // Crear un contenedor más compacto para ajustarse a una sola página
      const container = document.createElement("div");
      container.style.width = "800px"; // Ancho reducido para mejor proporción
      container.style.backgroundColor = "white";
      container.style.padding = "15px";
      container.style.fontFamily = "Arial, sans-serif";

      // Título principal más compacto
      const title = document.createElement("h2"); // Reducido de h1 a h2
      title.textContent = "Reporte de Registros de Acceso";
      title.style.textAlign = "center";
      title.style.marginBottom = "10px"; // Reducido de 20px
      title.style.color = "#2563eb";
      container.appendChild(title);

      // Datos de la tabla - versión resumida (solo primeras filas)
      const tableSection = document.createElement("div");
      tableSection.style.marginBottom = "15px"; // Reducido de 40px

      const tableTitle = document.createElement("h3"); // Reducido de h2 a h3
      tableTitle.textContent = "Datos de Accesos";
      tableTitle.style.color = "#1e3a8a";
      tableTitle.style.marginBottom = "5px";
      tableSection.appendChild(tableTitle);

      if (tableRef.current) {
        const tableClone = tableRef.current.cloneNode(true);

        // Aplicar estilos más compactos a la tabla
        const tableElement = tableClone.querySelector("table");
        if (tableElement) {
          tableElement.style.width = "100%";
          tableElement.style.borderCollapse = "collapse";
          tableElement.style.marginBottom = "10px"; // Reducido de 20px
          tableElement.style.fontSize = "9px"; // Fuente más pequeña

          // Mostrar solo las primeras filas (máximo 5)
          const rows = tableElement.querySelectorAll("tbody tr");
          const maxVisibleRows = Math.min(5, rows.length);

          for (let i = 0; i < rows.length; i++) {
            if (i >= maxVisibleRows) {
              rows[i].style.display = "none";
            }
          }

          // Si hay más filas, mostrar un mensaje de resumen
          if (rows.length > maxVisibleRows) {
            const totalRowsMessage = document.createElement("div");
            totalRowsMessage.textContent = `... y ${
              rows.length - maxVisibleRows
            } filas más`;
            totalRowsMessage.style.textAlign = "center";
            totalRowsMessage.style.fontSize = "9px";
            totalRowsMessage.style.fontStyle = "italic";
            totalRowsMessage.style.color = "#666";
            tableElement.parentNode.appendChild(totalRowsMessage);
          }

          // Estilos para celdas más compactas
          Array.from(tableElement.querySelectorAll("th, td")).forEach(
            (cell) => {
              cell.style.border = "1px solid #ddd";
              cell.style.padding = "3px"; // Reducido de 8px
              cell.style.textAlign = "left";
              cell.style.whiteSpace = "nowrap"; // Evitar saltos de línea
              cell.style.overflow = "hidden";
              cell.style.textOverflow = "ellipsis";
            }
          );

          // Estilo para encabezados
          Array.from(tableElement.querySelectorAll("th")).forEach((header) => {
            header.style.backgroundColor = "#f2f2f2";
            header.style.color = "#333";
          });
        }
        tableSection.appendChild(tableClone);
      }

      container.appendChild(tableSection);

      // Crear sección de gráficos más compacta
      const chartsSection = document.createElement("div");
      chartsSection.style.display = "flex"; // Cambio a layout horizontal
      chartsSection.style.justifyContent = "space-between";
      chartsSection.style.marginBottom = "15px";

      // Título de sección de gráficos
      const chartsTitle = document.createElement("h3"); // Reducido de h2 a h3
      chartsTitle.textContent = "Gráficos Estadísticos";
      chartsTitle.style.color = "#1e3a8a";
      chartsTitle.style.marginBottom = "5px";
      chartsTitle.style.width = "100%";
      container.appendChild(chartsTitle); // Añadir directamente al contenedor

      // Generar imágenes de los gráficos en tamaño reducido
      const barChartImg = await generateChartImage(
        barData,
        barOpts,
        "bar",
        380,
        280
      ); // Tamaño reducido
      const pieChartImg = await generateChartImage(
        pieData,
        pieOpts,
        "pie",
        380,
        280
      ); // Tamaño reducido

      // Añadir imagen del gráfico de barras
      const barChartContainer = document.createElement("div");
      barChartContainer.style.width = "48%";

      const barChartTitle = document.createElement("div");
      barChartTitle.textContent = "Accesos por Método";
      barChartTitle.style.textAlign = "center";
      barChartTitle.style.fontWeight = "bold";
      barChartTitle.style.fontSize = "10px";
      barChartContainer.appendChild(barChartTitle);

      if (barChartImg) {
        barChartImg.style.width = "100%";
        barChartImg.style.height = "auto";
        barChartContainer.appendChild(barChartImg);
      }
      chartsSection.appendChild(barChartContainer);

      // Añadir imagen del gráfico circular
      const pieChartContainer = document.createElement("div");
      pieChartContainer.style.width = "48%";

      const pieChartTitle = document.createElement("div");
      pieChartTitle.textContent = "Accesos por Año";
      pieChartTitle.style.textAlign = "center";
      pieChartTitle.style.fontWeight = "bold";
      pieChartTitle.style.fontSize = "10px";
      pieChartContainer.appendChild(pieChartTitle);

      if (pieChartImg) {
        pieChartImg.style.width = "100%";
        pieChartImg.style.height = "auto";
        pieChartContainer.appendChild(pieChartImg);
      }
      chartsSection.appendChild(pieChartContainer);

      container.appendChild(chartsSection);

      // Pie de página más compacto
      const footer = document.createElement("div");
      footer.style.borderTop = "1px solid #ddd";
      footer.style.paddingTop = "5px";
      footer.style.fontSize = "8px";
      footer.style.color = "#666";
      footer.textContent = `Reporte generado el ${new Date().toLocaleString()}`;
      container.appendChild(footer);

      // Añadir temporalmente al DOM (oculto)
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      // Convertir a canvas y luego a PDF
      const canvas = await html2canvas(container, {
        scale: 2, // Mayor escala para mejor calidad
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (doc) => {
          // Simplificar estilos para evitar problemas con oklch
          Array.from(doc.querySelectorAll("*")).forEach((el) => {
            try {
              const style = window.getComputedStyle(el);
              // Reemplazar cualquier color problemático
              if (style.color.includes("oklch")) el.style.color = "#000000";
              if (style.backgroundColor.includes("oklch"))
                el.style.backgroundColor = "#ffffff";
            } catch (e) {
              // Ignorar errores de estilo
            }
          });
        },
      });

      // Generar PDF con orientación horizontal para más espacio
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape", // Cambio a orientación horizontal
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("reporte_accesos_compacto.pdf");

      // Limpiar
      document.body.removeChild(container);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("No se pudo generar el PDF. Error: " + error.message);
    }
  };

  // Función auxiliar para generar imágenes de los gráficos Chart.js con tamaño específico
  const generateChartImage = async (
    data,
    options,
    type,
    width = 600,
    height = 400
  ) => {
    try {
      // Crear un canvas temporal para el gráfico con dimensiones específicas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      document.body.appendChild(canvas);

      // Crear instancia de gráfico y renderizar
      const ctx = canvas.getContext("2d");

      // Configuraciones adaptadas para tamaño reducido
      const adaptedOptions = {
        ...options,
        plugins: {
          ...options.plugins,
          legend: {
            ...options.plugins.legend,
            labels: {
              ...options.plugins?.legend?.labels,
              font: {
                size: 10, // Fuente más pequeña para leyendas
              },
            },
          },
          title: {
            ...options.plugins.title,
            font: {
              size: 12, // Fuente más pequeña para títulos
            },
            display: false, // No mostrar título dentro del gráfico (ya tenemos títulos en el contenedor)
          },
        },
        scales:
          type === "bar"
            ? {
                y: {
                  ticks: {
                    font: {
                      size: 9, // Fuente más pequeña para ejes
                    },
                  },
                },
                x: {
                  ticks: {
                    font: {
                      size: 9,
                    },
                  },
                },
              }
            : undefined,
      };

      // Crear gráfico según tipo con opciones adaptadas
      const chart =
        type === "bar"
          ? new ChartJS(ctx, { type: "bar", data, options: adaptedOptions })
          : new ChartJS(ctx, { type: "pie", data, options: adaptedOptions });

      // Esperar a que el gráfico se renderice
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Convertir canvas a imagen
      const img = new Image();
      img.src = canvas.toDataURL("image/png");

      // Limpiar
      chart.destroy();
      document.body.removeChild(canvas);

      return img;
    } catch (e) {
      console.error("Error al generar imagen de gráfico:", e);
      return null;
    }
  };

  // formatear fecha
  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const pieOpts = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Accesos por Año" },
    },
  };

  return (
    <Card className="p-4">
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography
          variant="h5"
          className="text-zinc-700 text-center p-3 bg-sky-100 rounded"
        >
          Reporte de Registros de Acceso
        </Typography>
      </CardHeader>

      {/* filtros */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <Input
          type="date"
          label="Inicio"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          label="Fin"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">Todas Áreas</option>
          {areaOptions.map((a, idx) => (
            <option key={`${a}-${idx}`} value={a}>
              {a}
            </option>
          ))}
        </select>
        <Input
          label="Buscar nombre/DNI"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* tabla + gráficas */}
      <div className="lg:flex gap-4" ref={containerRef}>
        <CardBody className="w-full lg:w-3/5 overflow-auto">
          <div ref={tableRef}>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Nombre",
                    "Sexo",
                    "DNI",
                    "Email",
                    "Cargo",
                    "Área",
                    "Nivel",
                    "Entrada",
                    "Salida",
                    "Método",
                  ].map((h) => (
                    <th key={h} className="px-2 py-1 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, idx) => (
                  <tr key={`${r.ID_acceso ?? r.id_acceso}-${idx}`}>
                    <td className="px-2 py-1 border-b">{r.ID_acceso}</td>
                    <td className="px-2 py-1 border-b">{r.nombre}</td>
                    <td className="px-2 py-1 border-b">{r.sexo}</td>
                    <td className="px-2 py-1 border-b">{r.dni}</td>
                    <td className="px-2 py-1 border-b">{r.email}</td>
                    <td className="px-2 py-1 border-b">{r.cargo}</td>
                    <td className="px-2 py-1 border-b">{r.area_restrictiva}</td>
                    <td className="px-2 py-1 border-b">
                      {r.Nivel_Autorizacion}
                    </td>
                    <td className="px-2 py-1 border-b">
                      {formatDateTime(r.FechaHora_Entrada)}
                    </td>
                    <td className="px-2 py-1 border-b">
                      {formatDateTime(r.FechaHora_Salida)}
                    </td>
                    <td className="px-2 py-1 border-b">
                      {r.Metodo_Autenticacion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* paginación manual */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white"
            >
              Anterior
            </Button>
            <Typography>
              Página {currentPage} de {totalPages}
            </Typography>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white"
            >
              Siguiente
            </Button>
          </div>
        </CardBody>

        <div className="w-full lg:w-2/5 space-y-6">
          <div>
            <Bar data={barData} options={barOpts} />
          </div>
          <div>
            <Pie data={pieData} options={pieOpts} />
          </div>
        </div>
      </div>
    </Card>
  );
}
