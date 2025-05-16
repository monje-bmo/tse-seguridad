import {pool} from "../config/db.js";

export async function getAllCargos(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT * FROM cargo
      `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}


export async function getAllRoles(req, res) {
  try {
    const p = await pool;
    const { recordset } = await p.request().query(`
        SELECT * FROM Roles
      `);

    res.json(recordset);
  } catch (err) {
    // 5️⃣  si algo explota, devolvemos error 500
    res.status(500).json({ error: err.message });
  }
}