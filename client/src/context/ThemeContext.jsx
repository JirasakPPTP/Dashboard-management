import { createContext, useEffect, useMemo, useState } from "react";
import { getStoredTheme, setStoredTheme } from "../utils/storage";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getStoredTheme() || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
