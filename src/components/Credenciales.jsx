// src/components/VisitasTableWithMotivo.jsx
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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js";

// Registramos Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Credenciales() {
  // Estados
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCredencial, setSelectedCredencial] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedVigencia, setSelectedVigencia] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const containerRef = useRef(null);
  const tableRef = useRef(null);

  // Fetch datos
  useEffect(() => {
    fetch("http://localhost:3001/api/reportes/report3")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Opciones únicas
  const credenciales = useMemo(
    () => Array.from(new Set(data.map((d) => d.tipo_credencial))),
    [data]
  );
  const estados = useMemo(
    () => Array.from(new Set(data.map((d) => d.Estado))),
    [data]
  );
  const vigencias = useMemo(
    () => Array.from(new Set(data.map((d) => d.estado_vigencia))),
    [data]
  );

  // Filtrado
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const fecha = new Date(item.Fecha_Expedicion);
      if (startDate && fecha < new Date(startDate)) return false;
      if (endDate && fecha > new Date(endDate)) return false;
      if (selectedCredencial && item.tipo_credencial !== selectedCredencial)
        return false;
      if (selectedEstado && item.Estado !== selectedEstado) return false;
      if (selectedVigencia && item.estado_vigencia !== selectedVigencia)
        return false;

      const term = searchTerm.toLowerCase();
      if (term) {
        return item.nombre_usuario.toLowerCase().includes(term);
      }
      return true;
    });
  }, [
    data,
    startDate,
    endDate,
    selectedCredencial,
    selectedEstado,
    selectedVigencia,
    searchTerm,
  ]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  // Datos para gráfico de barras (cantidad por tipo de credencial)
  const barData = useMemo(() => {
    const credencialCount = {};
    filtered.forEach((item) => {
      const tipo = item.tipo_credencial;
      credencialCount[tipo] = (credencialCount[tipo] || 0) + 1;
    });

    const labels = Object.keys(credencialCount);
    const values = labels.map((l) => credencialCount[l]);

    return {
      labels,
      datasets: [
        {
          label: "Cantidad",
          data: values,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [filtered]);

  const barOpts = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Credenciales por Tipo" },
    },
    scales: {
      x: { title: { display: true, text: "Tipo de Credencial" } },
      y: {
        title: { display: true, text: "Cantidad" },
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  return (
    <Card className="p-4">
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography
          variant="h5"
          className="text-zinc-800 bg-sky-200 text-center p-3"
        >
          Reporte de Credenciales
        </Typography>
      </CardHeader>

      {/* Filtros en una sola línea */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-1 min-w-0 items-center space-x-2">
          <Input
            type="date"
            label="Desde"
            className="w-32"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="Hasta"
            className="w-32"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            className="border rounded p-2 h-10"
            value={selectedCredencial}
            onChange={(e) => setSelectedCredencial(e.target.value)}
          >
            <option value="">Todas Credenciales</option>
            {credenciales.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="border rounded p-2 h-10"
            value={selectedVigencia}
            onChange={(e) => setSelectedVigencia(e.target.value)}
          >
            <option value="">Todas Vigencias</option>
            {vigencias.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <Input
            label="Buscar usuario"
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla y gráfica */}
      <div className="lg:flex gap-4" ref={containerRef}>
        <CardBody className="w-full lg:w-3/5 overflow-auto">
          <div ref={tableRef}>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Usuario",
                    "Tipo",
                    "Expedicion",
                    "Vencimiento",
                    "Vigencia",
                  ].map((h) => (
                    <th key={h} className="px-2 py-1 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.ID_Usuario}>
                    <td className="px-2 py-1 border-b">{r.ID_Usuario}</td>
                    <td className="px-2 py-1 border-b">{r.nombre_usuario}</td>
                    <td className="px-2 py-1 border-b">{r.tipo_credencial}</td>
                    <td className="px-2 py-1 border-b">
                      {formatDate(r.Fecha_Expedicion)}
                    </td>
                    <td className="px-2 py-1 border-b">
                      {formatDate(r.Fecha_Vencimiento)}
                    </td>
                    <td className="px-2 py-1 border-b">{r.estado_vigencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              className="text-zinc-800 bg-sky-200"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Typography>
              Página {currentPage} de {totalPages || 1}
            </Typography>
            <Button
              className="text-zinc-800 bg-sky-200"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Siguiente
            </Button>
          </div>
        </CardBody>
        <div className="w-full lg:w-2/5">
          <Bar data={barData} options={barOpts} />
        </div>
      </div>
    </Card>
  );
}
