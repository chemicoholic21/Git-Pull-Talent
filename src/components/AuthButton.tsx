"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Github, LogOut } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-32 bg-[#141418] border border-white/[0.06] rounded-xl animate-pulse" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pr-4 border-r border-white/[0.06]">
          <img
            src={session.user?.image || ""}
            alt={session.user?.name || "User"}
            className="w-8 h-8 rounded-lg border border-white/[0.06]"
          />
          <span className="text-sm text-zinc-300 hidden sm:inline font-medium">
            {session.user?.login || session.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-zinc-500 hover:text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
    >
      <Github className="w-4 h-4" />
      <span>Sign in</span>
    </button>
  );
}
