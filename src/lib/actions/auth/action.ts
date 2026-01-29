'use server';

import { validateUser, validatePassword } from '@/src/lib/utils'
import { supabase } from '@/src/lib/actions/psql-connection'
import { cookies } from "next/headers"
import bcrypt from 'bcrypt';

export async function signIn(id_document: number, password: string) {
     if (validateUser(id_document) && validatePassword(password)) {
          const { data: user, error } = await supabase.from('users').select('*, roles(name), programs(name)').eq('id_document', id_document).single();
          if (error || !user) return { ok: false };
          const isValid = await bcrypt.compare(password, user.password);
          console.log(user);
          
          if (isValid) {
               await setCookies(
                    {
                         id_user: user.id_user,
                         name: user.name,
                         id_document: user.id_document,
                         role: user.roles.name,
                         email: user.email,
                         photo: user.photo,
                         program: user.program,
                         program_name: user.programs.name,
                         school: user.id_school
                    }
               );
               return true;
          }
     }
     return false;
}

export async function setCookies(user: any) {
     (await cookies()).set(
          "session",
          JSON.stringify(user),
          {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: "lax",
               path: "/",
               maxAge: 60 * 60 * 24
          }
     );
}

export async function getCookies() {
     const session = (await cookies()).get("session");
     if (!session) return null;

     try {
          return JSON.parse(session.value);
     } catch {
          return null;
     }
}