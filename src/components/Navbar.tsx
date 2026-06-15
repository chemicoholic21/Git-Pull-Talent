"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { Github, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scoresOpen, setScoresOpen] = useState(false);
  const scoresRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
    setScoresOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (scoresRef.current && !scoresRef.current.contains(event.target as Node)) {
        setScoresOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isScoresActive = pathname === "/scores/efficiency" || pathname === "/scores/repos";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#0c0c0f]/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500 text-white">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#0c0c0f]" />
            </div>
            <span className="font-bold text-white tracking-tight">GitPullTalent</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "Home", href: "/" },
              { label: "Discover", href: "/discover" },
              { label: "Leaderboard", href: "/leaderboard" },
              { label: "Trending", href: "/trending" }
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href ? "text-white font-medium" : "text-zinc-500 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={scoresRef}>
              <button
                onClick={() => setScoresOpen(!scoresOpen)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  isScoresActive ? "text-white font-medium" : "text-zinc-500 hover:text-white"
                }`}
              >
                Scores
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${scoresOpen ? "rotate-180" : ""}`} />
              </button>

              {scoresOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#141418] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden">
                  <Link
                    href="/scores/efficiency"
                    className={`block px-4 py-3 text-sm transition-colors ${
                      pathname === "/scores/efficiency"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    Contributor efficiency
                  </Link>
                  <Link
                    href="/scores/repos"
                    className={`block px-4 py-3 text-sm transition-colors ${
                      pathname === "/scores/repos"
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    Repository scores
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
           <AuthButton />
        </div>

        <button
          className="lg:hidden text-zinc-400 hover:text-white transition-colors p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#0c0c0f] border-b border-white/[0.04] shadow-2xl flex flex-col py-6 px-6 gap-6">
          {[
            { label: "Home", href: "/" },
            { label: "Discover", href: "/discover" },
            { label: "Leaderboard", href: "/leaderboard" },
            { label: "Trending", href: "/trending" }
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href ? "text-white font-medium" : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-white/[0.04] pt-4">
            <p className="text-xs text-zinc-600 mb-3 font-medium">Scores</p>
            <div className="flex flex-col gap-3 pl-1">
              <Link
                href="/scores/efficiency"
                className={`text-sm transition-colors ${
                  pathname === "/scores/efficiency" ? "text-indigo-400 font-medium" : "text-zinc-400 hover:text-white"
                }`}
              >
                Contributor efficiency
              </Link>
              <Link
                href="/scores/repos"
                className={`text-sm transition-colors ${
                  pathname === "/scores/repos" ? "text-indigo-400 font-medium" : "text-zinc-400 hover:text-white"
                }`}
              >
                Repository scores
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.04] w-full flex">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
