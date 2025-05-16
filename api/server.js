// api/server.js
import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// prefijo común
app.use("/api/usuarios", usuariosRoutes);
app.use("/api", authRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API corriendo en :${PORT}`));
