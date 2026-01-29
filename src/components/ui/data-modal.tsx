"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { ModalSchema } from "@/src/lib/definitions/schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  schema: ModalSchema;
  initialData?: any | null;
  onSubmit: (data: any, isEdit: boolean) => Promise<void>;
}

export function GenericCrudModal({
  open,
  onClose,
  schema,
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<any>({});

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (isEdit) setForm(initialData);
    else {
      const empty: any = {};
      schema.fields.forEach((f) => (empty[f.name] = ""));
      setForm(empty);
    }
  }, [initialData, schema.fields, isEdit]);

  const handleChange = (name: string, value: any) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, isEdit);
    onClose();
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
          {isEdit ? schema.titleEdit : schema.titleCreate}
        </h3>

        <form
          className="space-y-4 max-h-[65vh] overflow-y-auto pr-2"
          onSubmit={handleSubmit}
        >
          {schema.fields.map((field) => (
            <div key={field.name}>
              <label className="text-sm text-gray-600">{field.label}</label>

              {field.type === "select" ? (
                <select
                  value={form[field.name] ?? ""}
                  disabled={isEdit && field.disabledOnEdit}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
                >
                  <option value="">Seleccione</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <div className="mt-1">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      handleChange(field.name, files);
                    }}
                    className="w-full text-sm text-gray-500 border rounded-lg p-2
                 file:mr-4 file:py-1 file:px-3 file:rounded-md
                 file:border-0 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {Array.isArray(form[field.name]) &&
                    form[field.name].length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {form[field.name].map((file: File, index: number) => (
                          <li
                            key={index}
                            className="text-xs text-blue-600 flex items-center gap-1"
                          >
                            <span className="truncate max-w-[200px]">
                              📄 {file.name}
                            </span>
                            <span className="text-gray-400">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ) : (
                <input
                  type={field.type}
                  value={form[field.name] ?? ""}
                  disabled={isEdit && field.disabledOnEdit}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
                />
              )}
            </div>
          ))}

          <button className="w-full mt-4 bg-(--primary-color) text-white py-2 rounded-lg font-medium hover:opacity-90">
            {isEdit ? schema.submitEditLabel : schema.submitCreateLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
