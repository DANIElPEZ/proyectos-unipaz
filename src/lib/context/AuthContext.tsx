"use client";

import React, { useContext, createContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  const fetchSession = async () => {
    const res = await fetch("/api/session", {
      credentials: "include",
    });
    const data = await res.json();
    setUser(data.user);
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  const refresh = async () => {
    await fetchSession();
  };

  return (
    <AuthContext.Provider value={{ user, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fuera de AuthProvider");
  return ctx;
};
