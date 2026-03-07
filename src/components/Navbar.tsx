"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-900">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-green-500/20">
              <svg className="w-5 h-5 text-gray-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold tracking-tighter text-xl">GitPulse</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/leaderboard" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
              Leaderboard
            </Link>
          </div>
        </div>

        <AuthButton />
      </div>
    </nav>
  );
}
