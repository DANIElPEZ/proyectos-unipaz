import { redirect } from "next/navigation";
import { getCookies } from "@/src/lib/actions/auth/action";

export default async function DashboardPage() {
  const user = await getCookies();
  
  switch (user.role) {
    case "admin":
      redirect("/dashboard/admin");
    case "manager":
      redirect("/dashboard/manager");
    case "professor":
      redirect("/dashboard/professor");
    case "student":
      redirect("/dashboard/student");
    default:
      redirect("/login");
  }
}
