import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => (
  <div className="min-h-screen md:flex">
    <Sidebar />
    <div className="flex-1">
      <Navbar />
      <main className="p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
