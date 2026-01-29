"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMenuSharp, IoPersonSharp, IoHomeSharp, IoCloseSharp } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import { MdWork } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "@/src/lib/context/AuthContext";

export function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logOut = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <nav className="w-full bg-(--primary-color) px-4 py-3 flex items-center h-19 top-0 left-0 sticky justify-between z-10">
        <>
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={50}
            height={50}
            className={"block"}
          />
          <Link href={"/login"}>
            <MdKeyboardArrowRight className="text-white text-5xl cursor-pointer" />
          </Link>
        </>
      </nav>
    );
  }

  const urls = [
    { link: "/", label: "Inicio", icon: <IoHomeSharp className="cursor-pointer" /> },
    {
      link: `/dashboard/${user.role}`,
      label: "Dashboard",
      icon: <MdWork className="cursor-pointer" />,
    },
    {
      link: `/profile`,
      label: "Perfil",
      icon: <IoPersonSharp className="cursor-pointer" />,
    },
  ];

  return (
    <>
      <nav className="w-full bg-(--primary-color) px-4 py-3 flex items-center h-19 top-0 left-0 sticky justify-between z-10">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={50}
          height={50}
          className={"hidden sm:block"}
        />
        <IoMenuSharp
          onClick={() => setOpen(true)}
          className="text-4xl text-white sm:hidden block cursor-pointer"
        />
        <ul className="gap-7 text-white text-3xl hidden sm:flex">
          {urls.map((url) => (
            <li key={url.link}>
              <Link href={url.link}>{url.icon}</Link>
            </li>
          ))}
        </ul>
        <PiSignOutBold
          onClick={logOut}
          className="text-white text-2xl cursor-pointer"
        />
      </nav>

      <div
        className={`fixed inset-0 z-30 bg-(--primary-color)
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <IoCloseSharp
            onClick={() => setOpen(false)}
            className="text-white text-4xl cursor-pointer"
          />
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-8 mt-16 px-8 text-white text-2xl">
          {urls.map((url) => (
            <li key={url.link}>
              <Link
                href={url.link}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4"
              >
                <span className="text-3xl">{url.icon}</span>
                {url.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
