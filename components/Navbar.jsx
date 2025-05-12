"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../app/(root)/public/logo.png";

export default function Navbar() {
  const { data: session, status } = useSession();

  // while loading, you can return null or a skeleton
  if (status === "loading") return null;

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src={logo} alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center"
              >
                <span className="max-sm:hidden">Logout</span>
                <LogOut className="size-6 sm:hidden text-red-500" />
              </button>

              <Link href={`/user/${session.id}`}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || ""}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <button onClick={() => signIn("github")}>Login</button>
          )}
        </div>
      </nav>
    </header>
  );
}
