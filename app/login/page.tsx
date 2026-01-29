import { LoginForm } from "@/src/components/ui/login-form";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full bg-(--primary-color) px-4 py-3 flex items-center h-19 top-0 sticky z-10">
        <Link href='/'>
          <Image src={"/logo.png"} alt="Logo" width={50} height={50} />
        </Link>
      </div>
      <div className="flex flex-1 relative items-center justify-center">
        <Image
          src={"/team.jpg"}
          alt="team"
          fill
          className={"object-cover z-0"}
        />
        <div className="z-10 flex">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
