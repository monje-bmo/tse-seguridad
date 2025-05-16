import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const isAuth = localStorage.getItem("auth") === "true"; // Validación explícita

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
