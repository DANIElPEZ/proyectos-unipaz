"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import { IoDownloadOutline } from "react-icons/io5"
import { saveAs } from "file-saver";
import { GenericCrudModal } from "../data-modal";
import { tableConfig } from "@/src/lib/definitions/table-config";
import { formatValue } from "@/src/lib/utils";
import { getData } from "@/src/lib/actions/student/action";
import { useAuth } from "@/src/lib/context/AuthContext";
import { ProjectViewModal } from "../project-modal";

export default function EditData() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [schema, setSchema] = useState<any>(null);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [dataProject, setDataProject] = useState<any>(null);

  useEffect(() => {
    load();
    setupSchema();
  }, [user]);

  async function load() {
    if (!user?.id_user) return;

    setLoading(true);
    try {
      const project = await getData(
        "works",
        "id_work, title, description, modes(name)",
        user.id_user,
      );
      if (
        Array.isArray(project) &&
        project.length > 0 &&
        "id_work" in project[0]
      ) {
        setDataProject(project);
        const progress = await getData(
          "work_documents",
          "version, description, upload_date, professor_comments, document_professor_paths",
          undefined,
          Number(project[0].id_work),
        );
        setData(progress || []);
      } else {
        setDataProject([]);
      }
    } catch (error) {
      setData([]);
    }
    setLoading(false);
  }

  async function setupSchema() {
    const config = tableConfig["studentAdvance"];
    if (!config || !user?.id_user) return;
    let schemaCopy = structuredClone(config.schema);
    setSchema(schemaCopy);
  }

  const handleSubmit = async (formValues: any) => {
    const config = tableConfig["studentAdvance"];
    try {
      const dataToSend = new FormData();
      if (Array.isArray(formValues.file)) {
        formValues.file.forEach((file: File) => {
          dataToSend.append("files", file);
        });
      }

      dataToSend.append("description", formValues.description);
      dataToSend.append("version", formValues.version);

      if (dataProject && dataProject.length > 0) {
        dataToSend.append("id_work", dataProject[0].id_work);
      }

      await config.createAction(dataToSend);
      setOpenModal(false);
      await load();
    } catch (error) {
      console.error("Error al procesar");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Dashboard Estudiante
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setOpenProjectModal(true)}
            className="py-2 px-4 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
          >
            Ver proyecto
          </button>
          <button
            onClick={() => setOpenModal(true)}
            className="py-2 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            Nuevo avance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="relative h-[60vh] md:h-[65vh]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                Cargando datos del proyecto
              </div>
            ) : (
              <Table data={data} />
            )}
          </div>
        </div>
      </div>

      <ProjectViewModal
        open={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
        project={dataProject}
      />

      {schema && openModal && (
        <GenericCrudModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          schema={schema}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function Table({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400 font-medium">
        No se encontraron registros.
      </div>
    );
  }

  const columns = Object.keys(data[0]);
  const handleDownloadZip = async (
    urls: string[],
    version: string | number,
  ) => {
    const zip = new JSZip();
    const folder = zip.folder(`archivos-profesor-v${version}`);

    try {
      const downloadPromises = urls.map(async (url, index) => {
        const response = await fetch(url);
        const blob = await response.blob();

        const fileName =
          url.split("/").pop()?.split("?")[0] || `archivo-${index}`;
        folder?.file(fileName, blob);
      });

      await Promise.all(downloadPromises);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `revision-profesor-v${version}.zip`);
    } catch (error) {
      console.error("Error generando el ZIP:", error);
      alert(
        "No se pudieron descargar algunos archivos. Revisa los permisos de CORS.",
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => (
              <th key={col} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                {col.replace("_", " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50/50 transition-colors group">
              {columns.map((col) => {
                if (col === "document_professor_paths") {
                  const urls = row[col];
                  const hasFiles = Array.isArray(urls) && urls.length > 0;

                  return (
                    <td key={col} className="px-6 py-4 text-sm whitespace-nowrap">
                      {hasFiles ? (
                        <button
                          onClick={() => handleDownloadZip(urls, row.version || i)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs"
                        >
                          <IoDownloadOutline size={16} />
                          Descargar ZIP ({urls.length})
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Sin archivos</span>
                      )}
                    </td>
                  );
                }

                return (
                  <td key={col} className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {formatValue(row[col])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
