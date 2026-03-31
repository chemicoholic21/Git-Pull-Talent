"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Github, LogOut, Terminal } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-32 bg-[#121826] border border-white/5 rounded-xl animate-pulse" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pr-4 border-r border-white/10">
          <img
            src={session.user?.image || ""}
            alt={session.user?.name || "User"}
            className="w-8 h-8 rounded-lg border border-white/10"
          />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 hidden sm:inline">
            {session.user?.login || session.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-slate-500 hover:text-white transition-colors"
          title="Disconnect Layout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="bg-[#00D9F5] hover:bg-[#00D9F5]/90 text-[#0b0f1a] px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
    >
      <Github className="w-4 h-4" />
      <span>Auth Layer</span>
    </button>
  );
}
