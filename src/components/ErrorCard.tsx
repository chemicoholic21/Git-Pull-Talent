"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

interface ErrorCardProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function ErrorCard({ message, action }: ErrorCardProps) {
  const isRateLimit = message.toLowerCase().includes("rate limit");
  const isNotFound = message.toLowerCase().includes("not found");

  return (
    <div className="max-w-md mx-auto p-8 bg-[#141418] border border-white/[0.06] rounded-2xl shadow-2xl text-center animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-[#0c0c0f] border border-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-6">
        {isRateLimit ? (
          <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : isNotFound ? (
          <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>

      <h2 className="text-xl font-bold text-white mb-3">
        {isRateLimit ? "Rate limit reached" : isNotFound ? "User not found" : "Something went wrong"}
      </h2>
      
      <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col gap-3">
        {isRateLimit && (
          <button
            onClick={() => signIn("github")}
            className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-xl hover:bg-indigo-400 transition-colors"
          >
            Sign in with GitHub
          </button>
        )}

        {action && (
          <button
            onClick={action.onClick}
            className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold py-3 rounded-xl border border-white/[0.06] transition-colors"
          >
            {action.label}
          </button>
        )}

        <Link
          href="/"
          className="text-xs text-zinc-600 hover:text-zinc-400 font-medium pt-2 transition-colors"
        >
          ← Back to search
        </Link>
      </div>

      {isRateLimit && (
        <p className="mt-6 text-xs text-zinc-600 italic">
          Unlock 5,000 requests/hr by signing in
        </p>
      )}
    </div>
  );
}
