// layouts/AppLayoutBare.jsx
import AppSidebar from "../components/AppSidebar";
import { Outlet } from "react-router-dom";

export default function AppLayoutBare() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto pl-30 pr-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
