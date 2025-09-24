import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: number;
  username: string;
};

type AdminAuthContextValue = {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("adminUser");
    if (storedToken) setToken(storedToken);
    if (storedUser) setAdmin(JSON.parse(storedUser));
  }, []);

  const value = useMemo<AdminAuthContextValue>(() => ({
    token,
    admin,
    isAuthenticated: Boolean(token && admin),
    login: (newToken: string, newAdmin: AdminUser) => {
      setToken(newToken);
      setAdmin(newAdmin);
      localStorage.setItem("adminToken", newToken);
      localStorage.setItem("adminUser", JSON.stringify(newAdmin));
    },
    logout: () => {
      setToken(null);
      setAdmin(null);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    }
  }), [token, admin]);

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};


