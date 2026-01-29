import { NavBar } from "@/src/components/ui/nav-bar";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar/>
      <div className="flex flex-1 relative items-center justify-center">
        <Image
          src={"/team.jpg"}
          alt="team"
          fill
          className={"object-cover z-0"}
        />
        <div className="z-10 flex">
          <div className=" relative z-20 w-80 rounded-3xl bg-[--secondary-color]/70 backdrop-blur-lg p-8 flex flex-col items-center gap-5 shadow-2xl">
            <label htmlFor="goback" className="block text-white text-xl mb-1">
              Recurso no encontrado
            </label>
            <Link href="/" id="goback">
              <button className=" w-full mt-3 py-2 px-3 rounded-xl bg-white text-[--secondary-color] font-semibold hover:bg-white/90 transition">Regresar</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
