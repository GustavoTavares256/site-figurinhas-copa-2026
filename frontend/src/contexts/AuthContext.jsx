import { createContext, useContext, useMemo, useState } from "react";
import { loginAdmin } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const name = localStorage.getItem("adminName");
    return name ? { name } : null;
  });

  const isAuthenticated = Boolean(localStorage.getItem("adminToken"));

  async function login(credentials) {
    const data = await loginAdmin(credentials);
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminRefreshToken", data.refreshToken);
    localStorage.setItem("adminName", data.admin.name);
    setAdmin(data.admin);
    return data.admin;
  }

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminName");
    setAdmin(null);
  }

  const value = useMemo(
    () => ({ admin, isAuthenticated, login, logout }),
    [admin, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
