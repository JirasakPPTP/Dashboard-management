import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/products", label: "Products" },
  { to: "/settings", label: "Settings" }
];

const Sidebar = () => {
  const { user } = useAuth();
  const items = user?.role === "admin" ? [...navItems, { to: "/users", label: "Users" }] : navItems;

  return (
    <aside className="w-full border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:w-64">
      <h1 className="mb-6 text-xl font-bold text-brand-600">Dashboard</h1>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
