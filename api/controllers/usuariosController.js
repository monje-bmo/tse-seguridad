import { pool, sql } from "../config/db.js";

export async function getByIdUser(req, res) {
  try {
    const { id } = req.params;
    const p = await pool; // 1️⃣  espera la conexión
    const { recordset } = await p
      .request()
      .input("id", id)
      .query("SELECT * FROM Usuarios WHERE ID_usuario = @id");
    recordset.length ? res.json(recordset[0]) : res.sendStatus(404);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT
          u.ID_usuario         AS id,
          e.primer_nombre      AS nombre,
          e.primer_apellido    AS apellido,
          e.email,
          c.cargo,
          u.[user]             AS [user],
          u.password,
          r.Nombre             AS rol
        FROM   Usuarios u
        INNER JOIN empleado e ON e.id_empleado = u.id_empleado
        INNER JOIN cargo    c ON c.id_cargo    = u.id_cargo
        INNER JOIN Roles    r ON r.ID_role     = u.Rol
        where u.estado = 1
        ORDER BY e.primer_nombre, e.primer_apellido
      `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}

export async function getAllInfoUser(req, res) {
  try {
    const { id } = req.params;
    const p = await pool;
    const { recordset } = await p.request().input("id", id).query(`
      SELECT
          u.ID_usuario         AS id,
          e.primer_nombre,
		      e.segundo_nombre,
          e.primer_apellido,
		      e.segundo_apellido,
		      e.sexo,
		      e.dirreccion,
		      e.dni,
		      e.fecha_nac,
		      e.telefono,
          e.email,
          c.cargo,
          u.[user]             AS [user],
          u.password,
          r.Nombre             AS rol
        FROM   Usuarios u
        INNER JOIN empleado e ON e.id_empleado = u.id_empleado
        INNER JOIN cargo    c ON c.id_cargo    = u.id_cargo
        INNER JOIN Roles    r ON r.ID_role     = u.Rol
        WHERE u.ID_usuario = @id AND u.estado = 1
      `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  const { id } = req.params; // ← ID_usuario
  const {
    // ───── tabla empleado ─────
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    sexo,
    dirreccion,
    dni,
    fecha_nac,
    telefono,
    email,
    // ───── tabla Usuarios ─────
    cargo, // nombre del cargo  (o id_cargo)
    user, // nombre de usuario
    password,
    rol, // nombre del rol    (o ID_role)
  } = req.body;

  let transaction;
  try {
    const p = await pool; // pool de conexiones MSSQL
    transaction = new sql.Transaction(p);

    await transaction.begin();

    /* ─── obtenemos id_empleado ligado al usuario ─── */
    const [{ id_empleado }] = (
      await transaction
        .request()
        .input("id", id)
        .query(`SELECT id_empleado FROM Usuarios WHERE ID_usuario = @id`)
    ).recordset;

    /* ─── 1. actualizar datos personales ─── */
    await transaction
      .request()
      .input("id_empleado", id_empleado)
      .input("primer_nombre", primer_nombre)
      .input("segundo_nombre", segundo_nombre)
      .input("primer_apellido", primer_apellido)
      .input("segundo_apellido", segundo_apellido)
      .input("sexo", sexo)
      .input("dirreccion", dirreccion)
      .input("dni", dni)
      .input("fecha_nac", fecha_nac)
      .input("telefono", telefono)
      .input("email", email).query(`
        UPDATE empleado
        SET  primer_nombre   = @primer_nombre,
             segundo_nombre  = @segundo_nombre,
             primer_apellido = @primer_apellido,
             segundo_apellido= @segundo_apellido,
             sexo            = @sexo,
             dirreccion      = @dirreccion,
             dni             = @dni,
             fecha_nac       = @fecha_nac,
             telefono        = @telefono,
             email           = @email
        WHERE id_empleado = @id_empleado
      `);

    /* ─── 2. actualizar credenciales y cargo/rol ─── */
    await transaction
      .request()
      .input("id", id)
      .input("user", user)
      .input("password", password)
      // Si usas claves numéricas, cambia estas dos líneas:
      .input("cargo", cargo) // p.e. id_cargo
      .input("rol", rol) // p.e. ID_role
      .query(`
        UPDATE Usuarios
        SET  [user]   = @user,
             password = @password,
             id_cargo = CASE
                          WHEN ISNUMERIC(@cargo) = 1 THEN @cargo               -- id directo
                          ELSE (SELECT TOP 1 id_cargo FROM cargo WHERE cargo = @cargo)
                        END,
             Rol      = CASE
                          WHEN ISNUMERIC(@rol) = 1 THEN @rol
                          ELSE (SELECT TOP 1 ID_role FROM Roles WHERE Nombre = @rol)
                        END
        WHERE ID_usuario = @id
      `);

    await transaction.commit();
    res.json({ message: "Usuario actualizado con éxito" });
  } catch (err) {
    console.error(err);
    // Si algo falla, se revierte la transacción
    if (err?.transaction) await err.transaction.rollback?.();
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params; // ID_usuario que llega por la URL

  try {
    const p = await pool;
    const { rowsAffected } = await p.request().input("id", id)
      .query(`UPDATE Usuarios
        SET estado = 0
        WHERE ID_usuario = @id`);

    if (rowsAffected[0] === 0) {
      // No había ningún registro con ese ID
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getEmpleados(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT id_empleado, primer_nombre, primer_apellido
        FROM empleado
      `);

    res.json(recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Antes: recibías { cargo, password, user, rol, dni }
export async function createUser(req, res) {
  const { cargo, password, user, rol, id_empleado } = req.body;

  // validá que vengan todos
  if (!cargo || !password || !user || !rol || !id_empleado) {
    return res
      .status(400)
      .json({
        error: "Faltan datos: cargo, password, user, rol o id_empleado",
      });
  }

  try {
    const p = await pool;
    await p
      .request()
      .input("cargo", sql.NVarChar(50), cargo)
      .input("password", sql.NVarChar(100), password)
      .input("user", sql.NVarChar(15), user)
      .input("rol", sql.NVarChar(100), rol)
      .input("id_empleado", sql.Int, id_empleado)
      .execute("sp_InsertUsuario");

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (err) {
    console.error(
      "Error al crear usuario:",
      err.originalError?.message || err.message
    );
    const msg = err.originalError?.message || "Error interno al crear usuario";
    res.status(500).json({ error: msg });
  }
}
