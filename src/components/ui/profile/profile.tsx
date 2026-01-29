"use client";

import { useAuth } from "@/src/lib/context/AuthContext";
import { BsPersonCircle } from "react-icons/bs";
import { MdEmail, MdBadge } from "react-icons/md";
import { useState } from "react";
import { updateProfile } from "@/src/lib/actions/profile/action";
import Image from "next/image";

export function Profile() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(user.id_user));

    await updateProfile(formData);
    setOpen(false);
    window.location.reload();
  }
  console.log(user);
  
  return (<div className="flex justify-center px-4 py-10 w-full">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-(--primary-color) h-24 relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
              {user?.photo ? (
                <Image
                  src={user.photo}
                  alt="Foto de perfil"
                  width={112}
                  height={112}
                  className="rounded-full object-cover"
                />
              ) : (
                <BsPersonCircle className="text-7xl text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6 px-6 text-center">
          <button
            onClick={() => setOpen(true)}
            className="px-6 py-2 rounded-lg bg-(--primary-color) text-white font-medium hover:opacity-90 transition"
          >
            Nueva foto
          </button>

          <h1 className="text-3xl font-semibold text-gray-800 mt-4">
            {user?.name}
          </h1>

          <span className="inline-block mt-2 px-4 py-1 text-base font-medium rounded-full bg-blue-100 text-blue-700">
            {user?.role}
          </span>

          <div className="mt-6 space-y-4 text-sm text-gray-700 text-left">
            <div className="flex items-center gap-3 border-b pb-3">
              <MdEmail className="text-4xl text-gray-400" />
              <div>
                <p className="text-xl text-gray-500">Email</p>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b pb-3">
              <MdBadge className="text-4xl text-gray-400" />
              <div>
                <p className="text-xl text-gray-500">Documento</p>
                <p className="font-medium text-lg">{user?.id_document}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b pb-3">
              <MdBadge className="text-4xl text-gray-400" />
              <div>
                <p className="text-xl text-gray-500">Programa</p>
                <p className="font-medium text-lg">{user?.program_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">
              Actualizar foto
            </h2>

            {preview ? (
              <img
                src={preview}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4" />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={onUpload}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>);
}
