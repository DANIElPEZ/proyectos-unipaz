"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import {
  IoDownloadOutline,
  IoSearchOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { saveAs } from "file-saver";
import { GenericCrudModal } from "../data-modal";
import { tableConfig } from "@/src/lib/definitions/table-config";
import { formatDate, getLastDocument } from "@/src/lib/utils";
import {
  getData,
  getStudentsDetails,
} from "@/src/lib/actions/professor/action";
import { useAuth } from "@/src/lib/context/AuthContext";

export default function EditData() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    load();
    setupSchema();
  }, [user]);

  async function load() {
    if (!user?.id_user) return;

    setLoading(true);
    try {
      const works: any[] = await getData(
        "works",
        "id_work, title, description, id_students, modes(name), work_documents(id_work_documents, version, description, upload_date, document_paths, professor_comments, document_professor_paths)",
        user.id_user,
      );
      const allStudentIds = [...new Set(works.flatMap((w) => w.id_students))];
      if (allStudentIds.length > 0) {
        const studentsInfo = await getStudentsDetails(allStudentIds);
        const enrichedWorks = works.map((work) => ({
          ...work,
          work_documents: Array.isArray(work.work_documents)
            ? work.work_documents.sort(
                (a: any, b: any) =>
                  new Date(b.upload_date).getTime() -
                  new Date(a.upload_date).getTime(),
              )
            : [],
          students: studentsInfo.filter((s) =>
            work.id_students.includes(s.id_user),
          ),
        }));
        setData(enrichedWorks);
      } else {
        setData(works);
      }
    } catch (error) {
      setData([]);
    }
    setLoading(false);
  }

  const filteredData = data.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  async function setupSchema() {
    const config = tableConfig["professorFeedback"];
    if (!config || !user?.id_user) return;
    let schemaCopy = structuredClone(config.schema);
    setSchema(schemaCopy);
  }

  const handleOpenModal = (row: any) => {
    setSelectedWork(row);
    setOpenModal(true);
  };

  const handleSubmit = async (formValues: any) => {
    const config = tableConfig["professorFeedback"];
    try {
      const formData = new FormData();
      const lastDoc = selectedWork.work_documents?.[0];
      if (lastDoc) {
        formData.append("id_work_documents", String(lastDoc.id_work_documents));
      }
      formData.append(
        "professor_comments",
        formValues.professor_comments || "",
      );

      if (formValues.file) {
        const file =
          formValues.file instanceof File
            ? formValues.file
            : formValues.file[0];
        formData.append("files", file);
      }

      await config.updateAction(formData);
      setOpenModal(false);
      await load();
    } catch (error) {
      console.error("Error al procesar");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Profesor</h2>
        <div className="relative w-full md:w-80">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm"
          />
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
              <Table data={filteredData} onAction={handleOpenModal} />
            )}
          </div>
        </div>
      </div>

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

function Table({
  data,
  onAction,
}: {
  data: any[];
  onAction: (row: any) => void;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400 font-medium">
        No se encontraron registros.
      </div>
    );
  }

  const handleDownloadZip = async (
    urls: string[],
    version: string | number,
  ) => {
    const zip = new JSZip();
    const folder = zip.folder(`archivos-profesor-v${version}`);

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
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 border-b">
              Proyecto
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 border-b">
              Estudiantes
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 border-b">
              Emails
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 border-b">
              Modo
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 border-b">
              Fecha subida
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 border-b">
              Archivos
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 border-b text-right">
              Acción
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => {
            const lastDoc = getLastDocument(row.work_documents);
            const hasSubmission = !!lastDoc;

            const hasProfessorResponse =
              !!lastDoc &&
              ((lastDoc.professor_comments &&
                lastDoc.professor_comments.trim() !== "") ||
                (Array.isArray(lastDoc.document_professor_paths) &&
                  lastDoc.document_professor_paths.length > 0));

            return (
              <tr
                key={i}
                className={`transition-colors ${
                  hasProfessorResponse ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium">{row.title}</td>

                <td className="px-6 py-4 text-sm">
                  {row.students?.map((s: any) => s.name).join(", ") || "-"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.students?.map((s: any) => s.email).join(", ") || "-"}
                </td>

                <td className="px-6 py-4 text-sm">{row.modes?.name || "-"}</td>

                <td className="px-6 py-4 text-sm">
                  {formatDate(lastDoc?.upload_date)}
                </td>

                <td className="px-6 py-4 text-sm">
                  {hasSubmission ? (
                    <button
                      onClick={() =>
                        handleDownloadZip(
                          lastDoc.document_paths,
                          lastDoc.version,
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs"
                    >
                      <IoDownloadOutline size={16} />
                      Descargar ZIP
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">Sin archivos</span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onAction(row)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
                  >
                    <IoChatbubbleEllipsesOutline size={16} />
                    Feedback
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
