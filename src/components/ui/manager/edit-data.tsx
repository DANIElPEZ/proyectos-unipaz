"use client";

import { useEffect, useState } from "react";
import { GenericCrudModal } from "../data-modal";
import { tableConfig } from "@/src/lib/definitions/table-config";
import { formatValue } from "@/src/lib/utils";
import { getCustomData } from "@/src/lib/actions/manager/action";
import { useAuth } from "@/src/lib/context/AuthContext"; 

export default function EditData() {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState<"users" | "works">("works");
  const [activeTable, setActiveTable] = useState<string>("Project");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    load();
  }, [activeTab, user?.school]);

  useEffect(() => {
    setupSchema();
  }, [activeTable]);

  async function load() {
    if (!user?.school) return;
    
    setLoading(true);
    try {
      let result;
      if (activeTab === "users") {
        result = await getCustomData("users", "id_user, name, id_document, email, id_status", user.school,4);
      } else {
        result = await getCustomData("works", "*", user.school);
      }
      setData(result || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setData([]);
    }
    setLoading(false);
  }

  async function setupSchema() {
    const config = tableConfig[activeTable];
    if (!config || !user?.school) return;

    let schemaCopy = structuredClone(config.schema);

    if (config.loadRelations) {
      const relations = await config.loadRelations(user.school); 

      schemaCopy.fields = schemaCopy.fields.map((f: any) => {
        const relationMap: Record<string, string> = {
          id_school: 'schools',
          id_role: 'roles',
          id_program: 'programs',
          program: 'programs',
          id_status: 'status',
          id_mode: 'mode',
          id_phase: 'phase',
          id_work: 'works',
          id_work_date: 'works',
          title: 'works',
          id_professors: 'professors',
          id_students: 'students'
        };

        const key = relationMap[f.name];
        if (key && relations[key]) {
          f.options = relations[key].map((item: any) => ({
            value: item.id_school || item.id_role || item.id_program || item.id_status || item.id_mode || item.id_phase || item.id_work || item.id_user || item.id,
            label: item.name || item.title || item.label || `ID: ${item.id}`,
          }));
        }
        return f;
      });
    }
    setSchema(schemaCopy);
  }

  const handleActionClick = (tableName: string) => {
    setActiveTable(tableName);
    setSelectedRow(null);
    setOpenModal(true);
  };

  const handleEdit = (row: any) => {
    if (activeTab === "users") {
      setActiveTable("usersManager");
    } else {
      setActiveTable("Project");
    }
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleSubmit = async (formData: any, isEdit: boolean) => {
    const config = tableConfig[activeTable];
    try {
      console.log(formData)
      if (isEdit) {
        const idKey = Object.keys(formData)[0];
        const idValue = formData[idKey];
        await config.updateAction(formData, idValue);
      } else {
        await config.createAction(formData);
      }
      setOpenModal(false);
      await load();
    } catch (error) {
      console.error("Error al procesar:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Director de proyectos</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleActionClick("Project")}
            className="py-2 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Nuevo Proyecto
          </button>
          <button
            onClick={() => handleActionClick("newPhase")}
            className="py-2 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Subir de Fase
          </button>
          <button
            onClick={() => handleActionClick("datePhase")}
            className="py-2 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Ajustar Fecha
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="border-b border-gray-100">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("works")}
                className={`pb-4 text-sm font-bold transition-all ${
                  activeTab === "works" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-400 hover:text-gray-600"
                }`}
              >
                TRABAJOS
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`pb-4 text-sm font-bold transition-all ${
                  activeTab === "users" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-400 hover:text-gray-600"
                }`}
              >
                ESTUDIANTES
              </button>
            </div>
          </div>

          <div className="relative h-[60vh] md:h-[65vh]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                Cargando datos de la escuela...
              </div>
            ) : (
              <Table data={data} onEdit={handleEdit} />
            )}
          </div>
        </div>
      </div>

      {schema && openModal && (
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

function Table({ data, onEdit }: { data: any[]; onEdit: (row: any) => void }) {
  if (!data || data.length === 0) {
    return <div className="py-20 text-center text-gray-400 font-medium">No se encontraron registros.</div>;
  }

  const hiddenColumns = ['id_work', 'id_user'];
  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => {
              const isHidden = hiddenColumns.includes(col);
              return(<th key={col} className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b ${isHidden ? 'hidden' : ''}`}>
                {col.replace("_", " ")}
              </th>
            );})}
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50/50 transition-colors group">
              {columns.map((col) => {
                const isHidden = hiddenColumns.includes(col);
                return(<td key={col} className={`px-6 py-4 text-sm text-gray-600 whitespace-nowrap ${isHidden ? 'hidden' : ''}`}>
                  {formatValue(row[col])}
                </td>
              );})}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onEdit(row)}
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
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