import { createContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import {
  getStoredToken,
  getStoredUser,
  removeStoredToken,
  removeStoredUser,
  setStoredToken,
  setStoredUser
} from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        setUser(me);
        setStoredUser(me);
      } catch (error) {
        removeStoredToken();
        removeStoredUser();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const login = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    setStoredToken(payload.token);
    setStoredUser(payload.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeStoredToken();
    removeStoredUser();
  };

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, logout }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
