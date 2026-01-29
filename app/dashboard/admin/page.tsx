"use client";

import AdminTabs from "@/src/components/ui/admin/admin-tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-8">
      <div className="w-full">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h2>
          <div className="flex gap-4">
            <Link href={`${pathname}/users`}>
              <button className=" w-full py-2 px-3 rounded-xl bg-(--secondary-color) text-white font-semibold hover:bg-(--secondary-color)/90 transition">
                Usuarios
              </button>
            </Link>
            <Link href={`${pathname}/programs`}>
              <button className=" w-full py-2 px-3 rounded-xl bg-(--secondary-color) text-white font-semibold hover:bg-(--secondary-color)/90 transition">
                Programas
              </button>
            </Link>
            <Link href={`${pathname}/schools`}>
              <button className=" w-full py-2 px-3 rounded-xl bg-(--secondary-color) text-white font-semibold hover:bg-(--secondary-color)/90 transition">
                Escuelas
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
          <AdminTabs />
        </div>
      </div>
    </div>
  );
}
