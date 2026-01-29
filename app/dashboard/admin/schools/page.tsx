import EditData from "@/src/components/ui/admin/edit-data";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 md:px-8">
      <EditData table={"schools"} name="escuela" title="Escuelas" />
    </div>
  );
}
