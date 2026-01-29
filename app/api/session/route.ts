import { NextResponse } from "next/server";
import { getCookies } from "@/src/lib/actions/auth/action";

export async function GET() {
  const user = await getCookies();
  return NextResponse.json({ user });
}