"use client";

import { useAuth } from "@/src/lib/context/AuthContext";
import { IoPersonSharp } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateUser, validatePassword } from "@/src/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [id_document, setUser] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { refresh } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUser(id_document) && !validatePassword(password)) return;
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_document, password }),
    });

    if (!res.ok) {
      setError("Usuario y/o contraseña inválidos.");
      return;
    }
    await refresh();
    router.push(`/dashboard`);
  };

  return (
    <form
      onSubmit={handleAuth}
      className=" relative z-20 w-80 rounded-3xl bg-[--secondary-color]/70 backdrop-blur-lg p-8 flex flex-col items-center gap-5 shadow-2xl
    "
    >
      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
        <IoPersonSharp className="text-white text-4xl" />
      </div>

      <div className="w-full">
        <label htmlFor="user" className="block text-white text-sm mb-1">
          Usuario
        </label>
        <input
          onChange={(e) => setUser(Number(e.target.value))}
          value={id_document}
          id="user"
          required
          type="text"
          placeholder="Ingresa tu usuario"
          className=" w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/60
          "
        />
      </div>

      <div className="w-full">
        <label htmlFor="password" className="block text-white text-sm mb-1">
          Clave
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password"
          type="password"
          required
          placeholder="••••••••"
          className=" w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/60
          "
        />
      </div>

      <button className=" w-full mt-3 py-2 rounded-xl bg-white text-[--secondary-color] font-semibold hover:bg-white/90 transition">
        Ingresar
      </button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </form>
  );
}
