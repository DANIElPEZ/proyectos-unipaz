'use server'

import { supabase } from '@/src/lib/actions/psql-connection'

export async function getData(table_name: string, columns: string, id_user?: number, id_work?: number) {

     let query = supabase.from(table_name).select(columns);
     if (id_user !== undefined) {
          query = query.contains("id_students", [id_user]);
     }
     if (id_work !== undefined) {
          query = query.eq("id_work", id_work);
     }
     const { data, error } = await query;
     if (error) throw new Error(error.message);
     return data ?? []
}

export async function insertDataStudent(formData: FormData) {
     const files = formData.getAll("files") as File[];
     const id_work = Number(formData.get("id_work"));
     const version = Number(formData.get("version"));
     const description = formData.get("description");

     if (files.length === 0 || isNaN(id_work)) throw new Error("Faltan datos");

     const documentUrls = await Promise.all(
          files.map(async (file) => {
               const ext = file.name.split(".").pop();
               const fileName = `avance-${id_work}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

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
          .from("work_documents")
          .insert({
               id_work: id_work,
               version: version,
               description: description,
               document_paths: documentUrls,
          });

     if (insertError) {
          throw insertError;
     }

     if (insertError) throw insertError;
}