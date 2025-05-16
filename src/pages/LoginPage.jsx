import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/login_bg.jpg";
import tseLogo from "../assets/logo.png";

// URL base de tu backend; usa variable de entorno o localhost por defecto
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: user, password: pass }),
      });

      if (!resp.ok) throw new Error("Credenciales incorrectas");

      const data = await resp.json(); // { msg, usuario } esperado
      // No usamos JWT, sólo mostramos mensaje y redirigimos
      alert(data.msg || `Bienvenido ${data.usuario || user}`);
      localStorage.setItem("auth", "true"); // simula autenticación
      navigate("/app", { replace: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Fondo */}
      <img
        src={bgImg}
        alt="Edificio TSE"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-80 sm:w-96 bg-white/95 backdrop-blur rounded shadow-lg p-6 space-y-6"
      >
        <div className="flex justify-center">
          <img src={tseLogo} alt="Tribunal Supremo Electoral" className="h-16" />
        </div>
        <h1 className="text-center font-semibold text-sm leading-tight">
          Tribunal Supremo Electoral <br /> Guatemala, C. A.
        </h1>

        {/* Usuario */}
        <div className="space-y-1">
          <label htmlFor="usuario" className="text-sm font-medium">
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-sky-400 focus:outline-none"
          />
        </div>

        {/* Contraseña */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-sky-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 text-white font-semibold py-2 rounded hover:bg-sky-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Ingresando…" : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}
