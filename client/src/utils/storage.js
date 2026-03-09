const TOKEN_KEY = "dashboard_token";
const USER_KEY = "dashboard_user";
const THEME_KEY = "dashboard_theme";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};
export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

export const getStoredTheme = () => localStorage.getItem(THEME_KEY);
export const setStoredTheme = (theme) => localStorage.setItem(THEME_KEY, theme);
