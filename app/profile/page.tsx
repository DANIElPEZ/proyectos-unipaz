"use client";

import { Profile } from "@/src/components/ui/profile/profile";
import { UpdatePasswordModal } from "@/src/components/ui/profile/update-password-modal";
import { useState } from "react";

export default function Perfil() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full px-4 py-10 space-y-10 flex flex-col justify-center items-center">
      <Profile />
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Seguridad de la cuenta
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-2 rounded-lg bg-(--primary-color) text-white font-medium hover:opacity-90 transition"
        >
          Actualizar contraseña
        </button>
      </div>
      <UpdatePasswordModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
