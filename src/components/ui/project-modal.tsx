"use client";

export function ProjectViewModal({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project: any;
}) {
  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-6">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Ver proyecto</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Título</p>
            <p className="font-medium">{project[0].title}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Descripción</p>
            <p className="font-medium">{project[0].description}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Modo</p>
            <p className="font-medium">{project[0].modes.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
