import { NextResponse } from "next/server";
import { signIn } from "@/src/lib/actions/auth/action";

export async function POST(req: Request) {
     const { id_document, password } = await req.json();

     const ok = await signIn(id_document, password);

     if (!ok) {
          return NextResponse.json(
               { message: "Credenciales inválidas" },
               { status: 401 }
          );
     }

     return NextResponse.json({ ok: true });
}