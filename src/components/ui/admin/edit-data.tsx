"use client";

import { useEffect, useState } from "react";
import { getData } from "@/src/lib/actions/admin/action";
import { GenericCrudModal } from "../data-modal";
import { tableConfig } from "@/src/lib/definitions/table-config";
import { formatValue } from "@/src/lib/utils";

export default function EditData({
  table,
  title,
  name,
}: {
  table: string;
  title: string;
  name: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    load();
    setupSchema();
  }, [table]);

  async function load() {
    setLoading(true);
    const result = await getData(table);
    setData(result);
    setLoading(false);
  }

  async function setupSchema() {
    const config = tableConfig[table];
    if (!config) return;

    let schemaCopy = structuredClone(config.schema);

    if (config.loadRelations) {
      const relations = await config.loadRelations();

      schemaCopy.fields = schemaCopy.fields.map((f: any) => {
        if (f.name === "id_school") {
          f.options = relations.schools.map((s: any) => ({
            value: s.id_school,
            label: s.name,
          }));
        }

        if (f.name === "id_role") {
          f.options = relations.roles.map((r: any) => ({
            value: r.id_role,
            label: r.name,
          }));
        }

        if (f.name === "program") {
          f.options = relations.programs.map((p: any) => ({
            value: p.id_program,
            label: p.name,
          }));
        }

        if (f.name === "id_status") {
          f.options = relations.status.map((s: any) => ({
            value: s.id_status,
            label: s.name,
          }));
        }

        return f;
      });
    }

    setSchema(schemaCopy);
  }

  const handleCreate = () => {
    setSelectedRow(null);
    setOpenModal(true);
  };

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleSubmit = async (formData: any, isEdit: boolean) => {
    const config = tableConfig[table];
    console.log(formData);

    if (isEdit) {
      const [idKey, idValue] = Object.entries(formData)[0];
      const { [idKey]: _, ...restData } = formData;
      console.log(idValue, restData);
      await config.updateAction(table, restData, idValue);
    } else {
      await config.createAction(table, formData);
    }

    await load();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Admin</h2>
        <div className="flex gap-4">
          <button
            onClick={handleCreate}
            className=" w-full py-2 px-3 rounded-xl bg-(--secondary-color) text-white font-semibold hover:bg-(--secondary-color)/90 transition"
          >
            Crear {name}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="border-b">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="flex-shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                {title}
              </span>
            </div>
          </div>

          <div className="relative h-[60vh] md:h-[65vh]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Cargando...
              </div>
            ) : (
              <Table data={data} onEdit={handleEdit} />
            )}
          </div>
        </div>
      </div>
      {schema && (
        <GenericCrudModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          schema={schema}
          initialData={selectedRow}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function Table({
  data,
  onEdit,
}: {
  data: Record<string, any>[];
  onEdit: (row: any) => void;
}) {
  if (!data?.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No hay datos para mostrar
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="h-full overflow-auto rounded-xl border">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 border-b text-left font-semibold text-gray-700 whitespace-nowrap"
              >
                {col.replaceAll("_", " ")}
              </th>
            ))}
            <th className="px-4 py-3 border-b text-left font-semibold text-gray-700 whitespace-nowrap">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-4 py-2 border-b text-gray-700 whitespace-nowrap"
                >
                  {formatValue(row[col])}
                </td>
              ))}
              <td className="px-4 py-2 border-b whitespace-nowrap">
                <button
                  className="px-3 py-1 rounded-md text-sm font-medium
                     text-blue-600 hover:text-white
                     hover:bg-blue-600 transition border border-blue-600"
                  onClick={() => {
                    onEdit(row);
                  }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
