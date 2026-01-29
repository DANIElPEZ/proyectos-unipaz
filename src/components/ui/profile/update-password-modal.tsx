"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { updatePassword } from "@/src/lib/actions/profile/action";
import { validatePassword } from "@/src/lib/utils";
import { useAuth } from "@/src/lib/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function UpdatePasswordModal({ open, onClose }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirm && validatePassword(password)) {
      try {
        await updatePassword(password, user.id_user);
        setPassword("");
        setConfirm("");
        onClose();
      } catch (e) {
        setError("Error al actualizar.");
      }
    } else {
      setError("La contraseña es incorrecta.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={22} />
        </button>

        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Actualizar contraseña
        </h3>

        <form className="space-y-4" onSubmit={handleUpdatePassword}>
          <div>
            <label className="text-sm text-gray-600">Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
            />
          </div>

          <button className="w-full mt-4 bg-(--primary-color) text-white py-2 rounded-lg font-medium hover:opacity-90">
            Guardar cambios
          </button>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </form>
      </div>
    </div>
  );
}
