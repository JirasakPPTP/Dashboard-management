import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import RoleGuard from "./components/ui/RoleGuard";
import OverviewPage from "./pages/dashboard/OverviewPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UsersPage from "./pages/users/UsersPage";
import ProductsPage from "./pages/products/ProductsPage";
import SettingsPage from "./pages/settings/SettingsPage";

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route element={<RoleGuard allowedRoles={["admin"]} />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
