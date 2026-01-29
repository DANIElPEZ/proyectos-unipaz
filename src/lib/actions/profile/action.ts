'use server'

import { supabase } from '@/src/lib/actions/psql-connection'
import { validatePassword } from '@/src/lib/utils'
import bcrypt from 'bcrypt';

export async function updatePassword(password: string, id: number) {
     if (!validatePassword(password)) {
          throw new Error('Contraseña invalida');
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const { error } = await supabase.from('users').update({ password: hashedPassword }).eq('id_user', id);
     if (error) {
          throw new Error(error.message);
     }
}

export async function updateProfile(formData: FormData) {
     const file = formData.get("file") as File;
     const userId = Number(formData.get("userId"));

     if (!file || !userId) {
          throw new Error("Datos inválidos");
     }

     const ext = file.name.split(".").pop();
     const fileName = `avatar-${userId}-${Date.now()}.${ext}`;

     const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(fileName, file, {
               upsert: true,
               contentType: file.type,
          });

     if (uploadError) throw uploadError;
     const { data } = supabase.storage
          .from("profiles")
          .getPublicUrl(fileName);

     const imageUrl = data.publicUrl;
     const { error } = await supabase
          .from("users")
          .update({ photo: imageUrl })
          .eq("id_user", userId);

     if (error) throw error;
     return imageUrl;
}