import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registramos Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InfoVehiculos() {
  const [data, setData] = useState([]);
  const [searchPlaca, setSearchPlaca] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch de datos
  useEffect(() => {
    fetch("http://localhost:3001/api/reportes/report4")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Opciones únicas
  const tipoOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.tipo_vehiculo))),
    [data]
  );
  const marcaOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.marca))),
    [data]
  );

  // Filtrado
  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (
        searchPlaca &&
        !item.placa.toLowerCase().includes(searchPlaca.toLowerCase())
      )
        return false;
      if (selectedTipo && item.tipo_vehiculo !== selectedTipo) return false;
      if (selectedMarca && item.marca !== selectedMarca) return false;
      return true;
    });
  }, [data, searchPlaca, selectedTipo, selectedMarca]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  // Datos para bar chart: conteo por marca
  const barData = useMemo(() => {
    const counts = {};
    filtered.forEach((i) => {
      counts[i.marca] = (counts[i.marca] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const values = labels.map((label) => counts[label]);
    const colors = labels.map(
      (_, idx) => `hsl(${(idx * 360) / labels.length}, 70%, 50%)`
    );
    return {
      labels,
      datasets: [
        {
          label: "Cantidad por Marca",
          data: values,
          backgroundColor: colors,
        },
      ],
    };
  }, [filtered]);

  const barOptions = {
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Vehículos por Marca" },
    },
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <Card className="p-4">
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h5" className="text-center text-zinc-700 bg-sky-100">
          Información de Vehículos
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
          value={selectedMarca}
          onChange={(e) => setSelectedMarca(e.target.value)}
        >
          <option value="">Todas Marcas</option>
          {marcaOptions.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
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

      {/* Tabla y Gráfico lado a lado */}
      <CardBody>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2 overflow-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {["ID", "Marca", "Placa", "Observaciones", "Tipo Vehículo"].map(
                    (h) => (
                      <th key={h} className="px-2 py-1 border-b text-left">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id_vehiculo}>
                    <td className="px-2 py-1 border-b">{r.id_vehiculo}</td>
                    <td className="px-2 py-1 border-b">{r.marca}</td>
                    <td className="px-2 py-1 border-b">{r.placa}</td>
                    <td className="px-2 py-1 border-b">{r.observaciones}</td>
                    <td className="px-2 py-1 border-b">{r.tipo_vehiculo}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-sky-300 text-sky-900"
              >
                Siguiente
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-96">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
