"use client";

import { useEffect, useState } from "react";
import TabButton from "./tab-button";
import DataTable from "./data-table";
import { getData } from "@/src/lib/actions/admin/action";

type TabConfig = {
  id: string;
  label: string;
  action: () => Promise<any[]>;
};

const TABS: TabConfig[] = [
  { id: "modes", label: "Modos de grado", action: () => getData("modes") },
  { id: "phase", label: "Fases", action: () => getData("phase") },
  {
    id: "phase_work",
    label: "Fase del trabajo",
    action: () => getData("phase_work"),
  },
  { id: "programs", label: "Programas", action: () => getData("programs") },
  { id: "roles", label: "Roles", action: () => getData("roles") },
  { id: "schools", label: "Escuelas", action: () => getData("schools") },
  {
    id: "status_user",
    label: "Estatus del usuario",
    action: () => getData("status_user"),
  },
  { id: "users", label: "Usuarios", action: () => getData("users") },
  {
    id: "work_documents",
    label: "Documentos de trabajo",
    action: () => getData("work_documents"),
  },
  { id: "works", label: "Trabajos", action: () => getData("works") },
];

export default function AdminTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [activeTab]);

  async function load() {
    setLoading(true);
    const result = await activeTab.action();
    setData(result);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              active={tab.id === activeTab.id}
              onClick={() => setActiveTab(tab)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
      </div>

      <div className="relative h-[60vh] md:h-[65vh]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Cargando...
          </div>
        ) : (
          <DataTable data={data} />
        )}
      </div>
    </div>
  );
}
