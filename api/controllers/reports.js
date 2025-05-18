import { pool, sql } from "../config/db.js";

export async function report1Data(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT
          vw.ID_acceso        AS id,
          CONCAT(e.primer_nombre,' ',e.primer_apellido) AS nombre,
		      e.sexo,
		      e.dni,
          e.email,
          c.cargo,
		  vw.ID_areas_restringidas,
		  vw.area_restrictiva,
		  vw.Nivel_Autorizacion,
		  vw.FechaHora_Entrada,
		  vw.FechaHora_Salida,
		  vw.Metodo_Autenticacion
        FROM vw_accesos_areas vw  
        INNER JOIN empleado e ON e.id_empleado = vw.ID_Persona
        INNER JOIN Usuarios u ON u.id_empleado = vw.ID_Persona
		INNER JOIN cargo    c ON c.id_cargo    = u.id_cargo
      `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}
export async function report2Data(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
      SELECT 
        id_visitante,
        nombre_completo,
        correo_electronico,
        motivo,
        documento_identidad,
        telefono,
        id_visita,
        u.ubicacion,
        fecha_entrada,
        fecha_salida
      FROM vw_visitantes_visitas AS vw
      INNER JOIN ubicacion AS u
        ON u.id_ubi = vw.id_ubicacion;
      `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}

export async function report3Data(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT
          ID_Usuario,
          nombre_usuario,
          tc.tipo_credencial,
          Estado,
          Fecha_Expedicion,
          Fecha_Vencimiento,
          estado_vigencia
        FROM vw_credenciales_info AS vw
        INNER JOIN tipo_credencial AS tc
          ON tc.id_tipo_credencial = vw.tipo_credencial
      `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}

export async function report4Data(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT 
          id_vehiculo,
          marca,
          placa,
          observaciones,
          tipo_vehiculo
        FROM SeguridadInstitucional.dbo.vw_vehiculos_info;
        `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}

export async function report5Data(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT 
          v.id_vehiculo,
          v.placa,
          t.tipo,
          v.TotalUso
        FROM SeguridadInstitucional.dbo.vw_VehiculosUsados AS v
        INNER JOIN tipo_vehiculo AS t
          ON t.id_vehiculo = v.tipo_vehiculo;
        `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}
