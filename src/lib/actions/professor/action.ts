'use server'

import { supabase } from '@/src/lib/actions/psql-connection'

export async function getData(table_name: string, columns: string, id_user?: number) {

  let query = supabase.from(table_name).select(columns);
  if (id_user !== undefined) {
    query = query.contains("id_professors", [id_user]);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? []
}

export async function getStudentsDetails(studentIds: number[]) {
  const { data, error } = await supabase
    .from("users")
    .select("id_user, name, email")
    .in("id_user", studentIds);

  if (error) throw error;
  return data;
}

export async function updateDataProfessor(formData: FormData) {
  const id_work_documents = Number(formData.get("id_work_documents"));
  const professor_comments = formData.get("professor_comments") as string;
  const files = formData.getAll("files") as File[];

  if (files.length === 0 || isNaN(id_work_documents)) throw new Error("Faltan datos");
  const documentUrls = await Promise.all(
    files.map(async (file) => {
      const ext = file.name.split(".").pop();
      const fileName = `avance-${id_work_documents}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) throw new Error("Error al obtener la URL pública");

      return publicUrlData.publicUrl;
    })
  );

  const { error: insertError } = await supabase
    .from("work_documents").update({
      professor_comments: professor_comments,
      document_professor_paths: documentUrls
    }).eq("id_work_documents", id_work_documents);

  if (insertError) {
    throw insertError;
  }

  if (insertError) throw insertError;
}