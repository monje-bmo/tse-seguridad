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

// Registramos Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function VisitasTableWithMotivo() {
  // ↓ Estados nuevos y viejos
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedMotivo, setSelectedMotivo] = useState(""); // ← filtro motivo
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const containerRef = useRef(null);
  const tableRef = useRef(null);

  // 👉 Fetch de datos (ajusta URL según tu API)
  useEffect(() => {
    fetch("http://localhost:3001/api/reportes/report2")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Opciones únicas de área y motivo
  const areaOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.area_restrictiva))),
    [data]
  );
  const motivoOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.motivo))),
    [data]
  );

  // ↓ Filtrado actualizado: fecha, área, motivo, email/DNI
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const entrada = new Date(item.fecha_entrada);
      if (startDate && entrada < new Date(startDate)) return false;
      if (endDate && entrada > new Date(endDate)) return false;
      if (selectedArea && item.area_restrictiva !== selectedArea) return false;
      if (selectedMotivo && item.motivo !== selectedMotivo) return false;

      const term = searchTerm.toLowerCase();
      if (term) {
        const emailMatch = item.correo_electronico.toLowerCase().includes(term);
        const dniMatch = String(item.documento_identidad).includes(term);
        if (!emailMatch && !dniMatch) return false;
      }
      return true;
    });
  }, [data, startDate, endDate, selectedArea, selectedMotivo, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  // Prepara datos para gráficas…
  const barData = useMemo(() => {
    const cnt = {};
    filtered.forEach((i) => {
      cnt[i.motivo] = (cnt[i.motivo] || 0) + 1;
    });
    const labels = Object.keys(cnt);
    const dataValues = Object.values(cnt);

    // Generamos un color distinto por barra
    const barColors = labels.map(
      (_, idx) => `hsl(${(idx * 360) / labels.length}, 70%, 50%)`
    );

    return {
      labels,
      datasets: [
        {
          label: "Visitas por Motivo",
          data: dataValues,
          backgroundColor: barColors,
        },
      ],
    };
  }, [filtered]);
  const barOpts = {
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Visitas por Motivo" },
    },
  };

  const pieData = useMemo(() => {
    const cntA = {};
    filtered.forEach((i) => {
      const anio = new Date(i.fecha_entrada).getFullYear();
      cntA[anio] = (cntA[anio] || 0) + 1;
    });
    const labels = Object.keys(cntA).sort();
    const dataValues = labels.map((y) => cntA[y]);

    // Colores para cada porción del pastel
    const pieColors = labels.map(
      (_, idx) => `hsl(${(idx * 360) / labels.length}, 60%, 60%)`
    );

    return {
      labels,
      datasets: [
        {
          label: "Visitas por Año",
          data: dataValues,
          backgroundColor: pieColors,
        },
      ],
    };
  }, [filtered]);
  const pieOpts = {
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Visitas por Año" },
    },
  };

  // Función de formateo de fecha
  const formatDateTime = (iso) => new Date(iso).toLocaleString();

  // (Opcional) exportPDF = … **puedes reusar tu lógica actual**

  return (
    <Card className="p-4">
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography
          variant="h5"
          className="text-zinc-700 text-center p-3 bg-sky-100 rounded"
        >
          Reporte de Visitas
        </Typography>
      </CardHeader>

      {/* ——— FILTROS ——— */}
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

        {/* área */}
        <select
          className="border rounded p-2"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
        >
          <option value="">Todas Áreas</option>
          {areaOptions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>

        {/* motivo */}
        <select
          className="border rounded p-2"
          value={selectedMotivo}
          onChange={(e) => setSelectedMotivo(e.target.value)}
        >
          <option value="">Todos Motivos</option>
          {motivoOptions.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {/* búsqueda EMAIL / DNI */}
        <Input
          label="Buscar correo / DNI"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ——— TABLA + GRÁFICAS ——— */}
      <div className="lg:flex gap-4" ref={containerRef}>
        <CardBody className="w-full lg:w-3/5 overflow-auto">
          <div ref={tableRef}>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Nombre",
                    "DNI",
                    "Email",
                    "Telefono",
                    "Área",
                    "Motivo",
                    "Entrada",
                    "Salida",
                  ].map((h) => (
                    <th key={h} className="px-2 py-1 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id_visita}>
                    <td className="px-2 py-1 border-b">{r.id_visita}</td>
                    <td className="px-2 py-1 border-b">{r.nombre_completo}</td>
                    <td className="px-2 py-1 border-b">
                      {r.documento_identidad}
                    </td>
                    <td className="px-2 py-1 border-b">
                      {r.correo_electronico}
                    </td>
                    <td className="px-2 py-1 border-b">{r.telefono}</td>
                    <td className="px-2 py-1 border-b">{r.ubicacion}</td>
                    <td className="px-2 py-1 border-b">{r.motivo}</td>
                    <td className="px-2 py-1 border-b">
                      {formatDateTime(r.fecha_entrada)}
                    </td>
                    <td className="px-2 py-1 border-b">
                      {formatDateTime(r.fecha_salida)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* paginación */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              className="bg-sky-300 text-zinc-800"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Typography>
              Página {currentPage} de {totalPages}
            </Typography>
            <Button
              className="bg-sky-300 text-zinc-800"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </CardBody>

        {/* gráficas */}
        <div className="w-full lg:w-2/5 space-y-6">
          <Bar data={barData} options={barOpts} />
          <Pie data={pieData} options={pieOpts} />
        </div>
      </div>
    </Card>
  );
}
