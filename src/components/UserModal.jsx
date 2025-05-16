/* src/components/UserModal.jsx */
import { useState, useEffect } from "react";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";
import imageUser from "../assets/placeholder-avatar.png"; // imagen de usuario por defecto

export default function UserModal({
  isOpen,
  mode = "view", // 'view' | 'edit' | 'delete'
  userID = null, // ID del usuario a editar
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);
  //const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesOptions, setRolesOptions] = useState([]);
  const [cargosOptions, setCargosOptions] = useState([]);
  const [empleadosOptions, setEmpleadosOptions] = useState([]);
  const [empleadoQuery, setEmpleadoQuery] = useState("");


  useEffect(() => {
    if (isOpen && mode === "create") {
      setForm({ id_empleado: "", rol: "", cargo: "", user: "", password: "" });
      setError(null);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen || !userID) return; // evita llamadas vacías

    const fetchUser = async () => {
      setLoading(true);
      try {
        const resp = await fetch(
          `http://localhost:3001/api/usuarios/allinfo/${userID}`
        );
        if (!resp.ok) throw new Error("Fallo al obtener usuarios");
        const data = await resp.json();
        const user = Array.isArray(data) ? data[0] : data; // saca el primer objeto
        setForm(user);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    const fetchDropdowns = async () => {
      try {
        const [rolesRes, cargosRes] = await Promise.all([
          fetch("http://localhost:3001/api/usuarios/roles"),
          fetch("http://localhost:3001/api/usuarios/cargos"),
        ]);
        if (!rolesRes.ok || !cargosRes.ok)
          throw new Error("Error en dropdowns");

        const [rolesData, cargosData] = await Promise.all([
          rolesRes.json(),
          cargosRes.json(),
        ]);
        setRolesOptions(rolesData);
        setCargosOptions(cargosData);
      } catch (err) {
        console.error("No Funciono dropdowns:", err);
        setError("No se pudo cargar listas de roles/cargos");
      }
    };
    fetchDropdowns();

    // cargá lista de empleados
    fetch("http://localhost:3001/api/usuarios/empleados")
      .then((r) => r.json())
      .then((data) => setEmpleadosOptions(data))
      .catch((e) => console.error("empleados:", e));
    if (mode !== "create" && userID) {
      fetchUser();
    }
  }, [isOpen, userID]);

  const title =
    mode === "create"
      ? "Crear Usuario"
      : mode === "edit"
      ? "Editar Usuario"
      : mode === "delete"
      ? "Eliminar Usuario"
      : "Ver Usuario";
  const readOnly = mode === "view";
  const isDeleting = mode === "delete";
  const actionTxt =
    mode === "edit" ? "Guardar" : mode === "delete" ? "Eliminar" : "Aceptar";

  /* helper pa’ cambiar campos */
  const handle = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  /* estilos base reutilizables */
  const inputBase =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm " +
    (readOnly ? "bg-gray-100 cursor-not-allowed" : "focus:outline-none");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      {/*  cajita blanca  */}
      <div className="relative mx-4 w-full max-w-3xl rounded-xl bg-white shadow-xl">
        {/*  botón de cerrar  */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/*  contenido scrolleable  */}
        <div className="max-h-[90vh] overflow-y-auto px-8 py-6">
          <h2 className="mb-6 text-center text-2xl font-semibold">{title}</h2>
          {/* Añade estas nuevas líneas aquí */}
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          {loading ? (
            <div className="text-center">Cargando...</div>
          ) : (
            <>
              {/* dentro del loading:false y antes de los botones */}
              {mode === "create" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Empleado */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Buscar Empleado (ID)
                    </label>
                    <input
                      type="text"
                      placeholder="Escribí ID o nombre…"
                      value={empleadoQuery}
                      onChange={(e) => setEmpleadoQuery(e.target.value)}
                      className="w-full mb-2 rounded border px-3 py-2 text-sm focus:outline-none"
                    />

                    <div className="max-h-40 overflow-y-auto border rounded">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Nombre</th>
                          </tr>
                        </thead>
                        <tbody>
                          {empleadosOptions
                            .filter(
                              (e) =>
                                e.id_empleado
                                  .toString()
                                  .includes(empleadoQuery) ||
                                `${e.primer_nombre} ${e.primer_apellido}`
                                  .toLowerCase()
                                  .includes(empleadoQuery.toLowerCase())
                            )
                            .map((e) => (
                              <tr
                                key={e.id_empleado}
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    id_empleado: e.id_empleado,
                                  })
                                }
                                className={`cursor-pointer hover:bg-blue-50 ${
                                  form.id_empleado === e.id_empleado
                                    ? "bg-blue-100"
                                    : ""
                                }`}
                              >
                                <td className="p-2">{e.id_empleado}</td>
                                <td className="p-2">
                                  {e.primer_nombre} {e.primer_apellido}
                                </td>
                              </tr>
                            ))}
                          {empleadosOptions.filter(
                            (e) =>
                              e.id_empleado
                                .toString()
                                .includes(empleadoQuery) ||
                              `${e.primer_nombre} ${e.primer_apellido}`
                                .toLowerCase()
                                .includes(empleadoQuery.toLowerCase())
                          ).length === 0 && (
                            <tr>
                              <td
                                colSpan={2}
                                className="p-2 text-center text-gray-500"
                              >
                                No se encontraron empleados
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium">Cargo</label>
                    <select
                      className={inputBase}
                      value={form.cargo || ""}
                      onChange={handle("cargo")}
                    >
                      <option value="">-- Seleccioná cargo --</option>
                      {cargosOptions.map((c) => (
                        <option key={c.id} value={c.cargo}>
                          {c.cargo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rol */}
                  <div>
                    <label className="block text-sm font-medium">Rol</label>
                    <select
                      className={inputBase}
                      value={form.rol || ""}
                      onChange={handle("rol")}
                    >
                      <option value="">-- Seleccioná rol --</option>
                      {rolesOptions.map((r) => (
                        <option key={r.id} value={r.Nombre}>
                          {r.Nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* User */}
                  <div>
                    <label className="block text-sm font-medium">Usuario</label>
                    <input
                      className={inputBase}
                      value={form.user || ""}
                      onChange={handle("user")}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className={inputBase}
                      value={form.password || ""}
                      onChange={handle("password")}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex justify-center">
                    <img
                      src={form.avatar || imageUser}
                      alt=""
                      className="h-28 w-28 rounded-full object-cover"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* ID ─────────────────────────────────── */}
                    <div>
                      <label className="block text-sm font-medium">ID</label>
                      <input
                        className={inputBase}
                        value={form.id || ""}
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">DNI</label>
                      <input
                        className={inputBase}
                        value={form.dni || ""}
                        onChange={handle("dni")}
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">User</label>
                      <input
                        className={inputBase}
                        value={form.user || ""}
                        onChange={handle("user")}
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Password
                      </label>
                      <input
                        className={inputBase}
                        value={form.password || ""}
                        onChange={handle("password")}
                        readOnly={readOnly}
                      />
                    </div>

                    {/* Nombre ─────────────────────────────── */}
                    <div>
                      <label className="block text-sm font-medium">
                        Nombre
                      </label>
                      <input
                        className={inputBase}
                        value={form.primer_nombre || ""}
                        onChange={handle("primer_nombre")}
                        readOnly={readOnly}
                      />
                    </div>

                    {/* (…replica para los demás campos…) */}
                    {/* Segundo Nombre */}
                    <div>
                      <label className="block text-sm font-medium">
                        2.º Nombre
                      </label>
                      <input
                        className={inputBase}
                        value={form.segundo_nombre || ""}
                        onChange={handle("segundo nombre")}
                        readOnly={readOnly}
                      />
                    </div>

                    {/* Primer Apellido */}
                    <div>
                      <label className="block text-sm font-medium">
                        Apellido
                      </label>
                      <input
                        className={inputBase}
                        value={form.primer_apellido || ""}
                        onChange={handle("primer_apellido")}
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        2.ºApellido
                      </label>
                      <input
                        className={inputBase}
                        value={form.segundo_apellido || ""}
                        onChange={handle("segundo_apellido")}
                        readOnly={readOnly}
                      />
                    </div>

                    {/* Sexo */}
                    <div>
                      <label className="block text-sm font-medium">Sexo</label>
                      <select
                        className={inputBase}
                        value={form.sexo || "M         "}
                        onChange={handle("sexo")}
                        disabled={readOnly}
                      >
                        <option value="M         ">M</option>
                        <option value="F         ">F</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Telefono
                      </label>
                      <input
                        className={inputBase}
                        value={form.telefono || ""}
                        onChange={handle("telefono")}
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">EMAIL</label>
                      <input
                        className={inputBase}
                        value={form.email || ""}
                        onChange={handle("email")}
                        readOnly={readOnly}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Cargo</label>
                      <select
                        className={inputBase}
                        value={form.cargo || ""}
                        onChange={handle("cargo")}
                        disabled={readOnly}
                      >
                        <option value="">-- Seleccioná cargo --</option>
                        {cargosOptions.map((c) => (
                          <option key={c.id} value={c.cargo}>
                            {c.cargo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Rol</label>
                      <select
                        className={inputBase}
                        value={form.rol || ""}
                        onChange={handle("rol")}
                        disabled={readOnly}
                      >
                        <option value="">-- Seleccioná rol --</option>
                        {rolesOptions.map((r) => (
                          <option key={r.id} value={r.Nombre}>
                            {r.Nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        className={inputBase}
                        value={
                          form.fecha_nac ? form.fecha_nac.slice(0, 10) : ""
                        }
                        onChange={handle("fecha_nac")}
                        readOnly={readOnly}
                      />
                    </div>

                    {/* Dirección (textarea en md:col-span-2) */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">
                        Dirección
                      </label>
                      <textarea
                        className={inputBase + " h-20 resize-none"}
                        value={form.dirreccion || ""}
                        onChange={handle("dirreccion")}
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/*  botones  */}
          <div className="mt-8 flex justify-center gap-4">
            {/* acción principal: editar / eliminar / aceptar */}
            <button
              className={
                (isDeleting
                  ? "bg-red-600 hover:bg-red-700"
                  : readOnly
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-green-600 hover:bg-green-700") +
                " rounded-md px-6 py-2 font-medium text-white"
              }
              onClick={() =>
                isDeleting
                  ? onDelete(form.id)
                  : readOnly
                  ? onClose()
                  : onSave(form)
              }
            >
              {isDeleting ? (
                <TrashIcon className="mr-1 inline h-5 w-5" />
              ) : null}
              {actionTxt}
            </button>

            {/* cancelar cuando edites o elimines */}
            {mode !== "view" && (
              <button
                className="rounded-md bg-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-300"
                onClick={onClose}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
