import sql from "mssql";
import * as dotenv from "dotenv";
dotenv.config();

const config = {
  user: 'sa',
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: true, // dev local
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

export const pool = new sql.ConnectionPool(config)
  .connect()
  .then((p) => {

    console.log("🟢 SQL Server conectado");
    return p;
  })
  .catch((err) => {
    console.log(process.cwd())
      console.error("🔴 Error de conexión SQL: ", err);
    throw err;
  });
  export { sql }

  