import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-300">Welcome back</p>
        <h2 className="font-semibold">{user?.name}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600">
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <button type="button" onClick={logout} className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white dark:bg-slate-100 dark:text-slate-900">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
