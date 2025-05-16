/* src/components/UsuariosTable.jsx */
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import UserModal from "./UserModal";
import { getRolStyles } from "./rolUtils";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  IconButton,
  Chip,
  Input,
  Typography,
} from "@material-tailwind/react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

// Importaciones para los íconos de exportación
import {
  DocumentTextIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
} from "@heroicons/react/24/solid";

import { useEffect } from "react";

/* Definimos los encabezados de la tabla */
const HEADERS = [
  "No.",
  "ID_Usuario",
  "Nombre",
  "Apellido",
  "Email",
  "Cargo",
  "User",
  "Password",
  "Rol",
  "Acción",
];

const UsuariosTable = () => {
  /* ────────── acciones CRUD ────────── */
  // 1️⃣  ACTUALIZAR (PUT o PATCH)
  const handleUpdate = async (updatedUser) => {
    try {
      const resp = await fetch(
        `http://localhost:3001/api/usuarios/${updatedUser.id}`,
        {
          method: "PUT", // o "PATCH"
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!resp.ok) throw new Error("Error al actualizar");

      // Actualiza el estado local sin nueva llamada GET
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el usuario");
    }
  };

  // 2️⃣  BORRAR (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      const resp = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Error al eliminar");

      setUsers((prev) => prev.filter((u) => u.id !== id));
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el usuario");
    }
  };

  // Nuevo handler: alta de usuario
  const handleCreate = async (form) => {
    const { id_empleado, cargo, rol, user, password } = form;

    // Validar localmente
    if (!id_empleado || !cargo || !rol || !user || !password) {
      return alert("Completa todos los campos antes de enviar.");
    }

    const payload = { id_empleado, cargo, rol, user, password };

    try {
      const resp = await fetch("http://localhost:3001/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Error al crear usuario");
      }
      // Opcional: si el back devuelve el usuario creado, agréguelo a la lista
      const created = await resp.json();
      setUsers((prev) => [created, ...prev]);
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      alert(`No se pudo crear el usuario: ${e.message}`);
    }
  };

  /* ────────── datos ────────── */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [filterRole, setFilterRole] = useState("");
  const [filterCargo, setFilterCargo] = useState("");

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [currentId, setCurrentId] = useState(null);

  const openModal = (mode, id) => {
    setModalMode(mode);
    setCurrentId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await fetch("http://localhost:3001/api/usuarios/", {
          // Si tu API exige token añade:
          // headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error("Fallo al obtener usuarios");
        const data = await resp.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  // Opciones para mostrar registros por página
  const perPageOptions = [5, 10, 25, 50];

  // Estado para los botones de acción
  const [activeRow, setActiveRow] = useState(null);

  const roles = Array.from(new Set(users.map((u) => u.rol)));
  const cargos = Array.from(new Set(users.map((u) => u.cargo)));

  /* Filtra al vuelo según lo que se escriba en el buscador */
  const filtrados = users.filter(
    (u) =>
      `${u.id} ${u.nombre} ${u.apellido} ${u.email} ${u.cargo} ${u.user} ${u.rol}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!filterRole || u.rol === filterRole) &&
      (!filterCargo || u.cargo === filterCargo)
  );

  // Cálculo para la paginación
  const totalPages = Math.ceil(filtrados.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentData = filtrados.slice(startIndex, endIndex);

  // Función para cambiar la página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Función para cambiar registros por página
  const handlePerPageChange = (value) => {
    setPerPage(parseInt(value));
    setCurrentPage(1); // Regresar a la primera página al cambiar
  };

  // Obtener el rango de registros mostrados
  const displayRange = {
    start: filtrados.length === 0 ? 0 : startIndex + 1,
    end: Math.min(endIndex, filtrados.length),
    total: filtrados.length,
  };

  /* -------- helpers -------- */
  const exportToExcel = () => {
    // quitamos la clave `password` al exportar
    const clean = filtrados.map(({ password, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(clean);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    const blob = new Blob(
      [
        XLSX.write(workbook, {
          type: "array",
          bookType: "xlsx",
        }),
      ],
      { type: "application/octet-stream" }
    );
    saveAs(blob, "usuarios.xlsx");
  };

  const exportToCSV = () => {
    const clean = filtrados.map(({ password, ...rest }) => rest);
    const csv = Papa.unparse(clean);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "usuarios.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    // encabezados = HEADERS sin "Password"
    const columns = HEADERS.filter((h) => h !== "Password" && h !== "Acción");
    const rows = filtrados.map((u) => [
      u.id,
      u.nombre,
      u.apellido,
      u.email,
      u.cargo,
      u.user,
      u.rol,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("usuarios.pdf");
  };
  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <>
      <Card className="w-full shadow-lg">
        {/* ───────────── cabecera ───────────── */}
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none px-4 py-5 bg-white"
        >
          <div className="flex flex-col gap-4 mb-2 md:flex-row md:items-center md:justify-between">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Usuarios del Sistema
            </Typography>
            <Button
              size="xl"
              color="green"
              className="flex items-center gap-2 bg-blue-300 text-zinc-800"
              onClick={() => openModal("create", null)}
            >
              <UserPlusIcon className="h-4 w-4" />
              Nuevo Usuario
            </Button>
            {/* botones de exportar */}
            <div className="flex flex-wrap gap-2 md:ml-auto shrink-0">
              <Button
                size="sm"
                className="flex items-center gap-2 bg-green-200 text-zinc-800"
                onClick={exportToExcel} /* NUEVO */
              >
                <TableCellsIcon className="h-4 w-4" />
                Excel
              </Button>

              <Button
                size="sm"
                className="flex items-center gap-2 bg-red-300 text-zinc-800"
                onClick={exportToPDF} /* NUEVO */
              >
                <DocumentTextIcon className="h-4 w-4" />
                PDF
              </Button>

              <Button
                size="sm"
                className="flex items-center gap-2 bg-sky-300 text-zinc-800"
                onClick={exportToCSV} /* NUEVO */
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          {/* selector de cantidad + buscador */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Typography variant="small" color="blue-gray">
                Mostrar
              </Typography>
              <select
                className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={perPage}
                onChange={(e) => handlePerPageChange(e.target.value)}
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Typography variant="small" color="blue-gray">
                registros
              </Typography>
            </div>
            <div className="flex-grow relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </div>
              <Input
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full md:w-80 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="">Todos Roles</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={filterCargo}
                onChange={(e) => setFilterCargo(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="">Todos Cargos</option>
                {cargos.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                className="bg-gray-200 text-black"
                onClick={() => {
                  setFilterRole("");
                  setFilterCargo("");
                }}
              >
                Limpiar filtro
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* ───────────── cuerpo ───────────── */}
        <CardBody className="overflow-x-auto px-0 pt-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="border-b border-t bg-sky-200 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      className="font-bold uppercase text-blue-gray-500"
                    >
                      {h}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((u, i) => {
                const isLast = i === currentData.length - 1;
                const cls = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-blue-gray-50/50 transition-colors"
                    onMouseEnter={() => setActiveRow(u.id)}
                    onMouseLeave={() => setActiveRow(null)}
                  >
                    <td className={cls}>
                      <Typography variant="small">
                        {startIndex + i + 1}
                      </Typography>
                    </td>
                    <td className={cls}>
                      <Typography variant="small">{u.id}</Typography>
                    </td>
                    <td className={cls}>
                      <Typography variant="small" className="font-medium">
                        {u.nombre}
                      </Typography>
                    </td>
                    <td className={cls}>
                      <Typography variant="small">{u.apellido}</Typography>
                    </td>
                    <td className={`${cls} max-w-[200px] truncate`}>
                      <Typography
                        variant="small"
                        className="text-blue-500 underline cursor-pointer"
                      >
                        {u.email}
                      </Typography>
                    </td>
                    <td className={cls}>
                      <Typography variant="small">{u.cargo}</Typography>
                    </td>
                    <td className={cls}>
                      <Typography variant="small" className="font-medium">
                        {u.user}
                      </Typography>
                    </td>
                    <td className={cls}>
                      <Typography variant="small">
                        *************{/*u.password*/}
                      </Typography>
                    </td>
                    <td className={cls}>
                      <div className="flex justify-center">
                        <Chip
                          value={u.rol}
                          size="sm"
                          style={getRolStyles(u.rol)}
                          className="font-medium py-1 px-3"
                          variant="filled"
                        />
                      </div>
                    </td>
                    <td className={cls}>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          className="p-1.5 min-w-0 shadow-md bg-sky-400"
                          onClick={() => openModal("view", u.id)}
                        >
                          <EyeIcon className="h-4 w-4" strokeWidth={2} />
                        </Button>
                        <Button
                          size="sm"
                          className="p-1.5 min-w-0 shadow-md bg-purple-400"
                          onClick={() => openModal("edit", u.id)}
                        >
                          <PencilSquareIcon
                            className="h-4 w-4"
                            strokeWidth={2}
                          />
                        </Button>
                        <Button
                          size="sm"
                          className="p-1.5 min-w-0 shadow-md bg-red-400"
                          onClick={() => openModal("delete", u.id)}
                        >
                          <TrashIcon className="h-4 w-4" strokeWidth={2} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={HEADERS.length} className="p-8 text-center">
                    <Typography color="blue-gray">
                      No se encontraron resultados para la búsqueda 😕
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>

        {/* ───────────── paginación ───────────── */}
        <CardFooter className="flex flex-col md:flex-row items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-4 md:mb-0"
          >
            Mostrando {displayRange.start} a {displayRange.end} de{" "}
            {displayRange.total} registros
          </Typography>

          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Mostrar páginas: actual, -2, -1, +1, +2
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <IconButton
                    key={pageNum}
                    variant={currentPage === pageNum ? "filled" : "text"}
                    size="sm"
                    color={currentPage === pageNum ? "blue" : "gray"}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </IconButton>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <Typography variant="small">...</Typography>
                  <IconButton
                    variant="text"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </IconButton>
                </>
              )}
            </div>

            <Button
              variant="outlined"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Siguiente
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <UserModal
        isOpen={modalOpen}
        mode={modalMode}
        userID={currentId}
        onClose={() => setModalOpen(false)}
        onSave={modalMode === "create" ? handleCreate : handleUpdate} // tu función PUT/PATCH
        onDelete={handleDelete} // tu función DELETE
      />
    </>
  );
};

export default UsuariosTable;
