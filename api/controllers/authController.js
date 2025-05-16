//import jwt from "jsonwebtoken";
//import bcrypt from "bcryptjs";            // si guardas hash; usa plain text si aún no
import { pool } from "../config/db.js";

//const JWT_SECRET = process.env.JWT_SECRET || "super‑secreto‑cámbiame";

export async function login(req, res) {
    const { usuario, password } = req.body;
    if (!usuario || !password)
      return res.status(400).json({ error: "Faltan credenciales" });
  
    try {
      const p = await pool;
      const { recordset } = await p
        .request()
        .input("usuario", usuario)
        .query(
          `SELECT ID_usuario, [user] AS usuario, [password] AS pwd
           FROM Usuarios
           WHERE [user] = @usuario`
        );
  
      if (!recordset.length)
        return res.status(401).json({ error: "No existe el usuario" });
  
      const row = recordset[0];
      const ok = password === row.pwd;        // texto plano
      if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });
  
      res.json({ msg: "login ok", usuario: row.usuario });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en el login" });
    }
  }
  
