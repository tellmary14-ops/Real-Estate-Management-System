import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";
import { logger } from "../utils/logger";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    logger.info("auth:restore");
    authApi
      .me()
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { user: u, accessToken, refreshToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(u);
    return u;
  };

  const register = async (body) => {
    const res = await authApi.register(body);
    const { user: u, accessToken, refreshToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(u);
    return u;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
