import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Registramos Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function VehiculosUsados() {
  const [data, setData] = useState([]);
  const [searchPlaca, setSearchPlaca] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch de datos
  useEffect(() => {
    fetch("http://localhost:3001/api/reportes/report5")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Opciones únicas de tipo_vehiculo
  const tipoOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.tipo))),
    [data]
  );

  // Filtrado por placa y tipo
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (
        searchPlaca &&
        !item.placa.toLowerCase().includes(searchPlaca.toLowerCase())
      ) {
        return false;
      }
      if (selectedTipo && item.tipo !== selectedTipo) {
        return false;
      }
      return true;
    });
  }, [data, searchPlaca, selectedTipo]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  // Datos para Pie chart (suma de TotalUso por tipo)
  const pieData = useMemo(() => {
    const counts = {};
    filtered.forEach((i) => {
      counts[i.tipo] = (counts[i.tipo] || 0) + i.TotalUso;
    });
    const labels = Object.keys(counts);
    const values = labels.map((label) => counts[label]);
    const colors = labels.map(
      (_, idx) => `hsl(${(idx * 360) / labels.length}, 70%, 60%)`
    );
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
        },
      ],
    };
  }, [filtered]);

  const pieOptions = {
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Uso total por Tipo de Vehículo" },
    },
  };

  return (
    <Card className="p-4">
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h5" className="text-center text-zinc-800 bg-sky-100">
          Reporte de Vehículos Usados
        </Typography>
      </CardHeader>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <Input
          label="Buscar Placa"
          value={searchPlaca}
          onChange={(e) => setSearchPlaca(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={selectedTipo}
          onChange={(e) => setSelectedTipo(e.target.value)}
        >
          <option value="">Todos Tipos</option>
          {tipoOptions.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <CardBody>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Tabla y Pie side by side */}
          <div className="w-full lg:w-1/2 overflow-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {["ID", "Placa", "Tipo", "Total Uso"].map((h) => (
                    <th key={h} className="px-2 py-1 border-b text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id_vehiculo}>
                    <td className="px-2 py-1 border-b">{r.id_vehiculo}</td>
                    <td className="px-2 py-1 border-b">{r.placa}</td>
                    <td className="px-2 py-1 border-b">{r.tipo}</td>
                    <td className="px-2 py-1 border-b">{r.TotalUso}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-sky-300 text-sky-900"
              >
                Anterior
              </Button>
              <Typography>
                Página {currentPage} de {totalPages}
              </Typography>
              <Button
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="bg-sky-300 text-sky-900"
              >
                Siguiente
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-96">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
