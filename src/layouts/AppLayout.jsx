import { Outlet } from "react-router-dom";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";
import HomeMenu from "../components/HomeMenu";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <AppHeader />
        <HomeMenu />
        <Outlet />
      </main>
    </div>
  );
}
