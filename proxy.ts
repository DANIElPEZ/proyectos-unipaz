import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
     const session = req.cookies.get("session")?.value;
     const pathname = req.nextUrl.pathname;
     if (!session) {
          if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
               return NextResponse.redirect(new URL("/login", req.url));
          }
          return NextResponse.next();
     }

     let user;
     try {
          user = JSON.parse(session);
     } catch {
          return NextResponse.redirect(new URL("/login", req.url));
     }

     const role = user.role;
     const roleRoutes: Record<string, string> = {
          admin: "/dashboard/admin",
          manager: "/dashboard/manager",
          professor: "/dashboard/professor",
          student: "/dashboard/student",
     };
     const allowedPath = roleRoutes[role];
     if (!allowedPath) {
          return NextResponse.redirect(new URL("/login", req.url));
     }

     if (pathname.startsWith("/dashboard")) {
          if (!pathname.startsWith(allowedPath)) {
               return NextResponse.redirect(new URL(allowedPath, req.url));
          }
     }

     if (pathname === "/login") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
     }
     return NextResponse.next();
}

export const config = {
     matcher: ["/dashboard/:path*", "/login", "/profile"],
};