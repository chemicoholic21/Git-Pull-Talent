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

  // Close dropdown when clicking outside
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0b0f1a]/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#00F5A0] text-[#0b0f1a]">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#0b0f1a]" />
            </div>
            <span className="font-bold text-white tracking-tight">GitPullTalent</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: "Identity", href: "/" },
              { label: "Discover", href: "/discover" },
              { label: "Leaderboard", href: "/leaderboard" },
              { label: "Trending", href: "/trending" }
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                  pathname === link.href ? "text-[#00D9F5]" : "text-slate-500 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Scores Dropdown */}
            <div className="relative" ref={scoresRef}>
              <button
                onClick={() => setScoresOpen(!scoresOpen)}
                className={`flex items-center gap-1 text-xs font-mono uppercase tracking-widest transition-colors ${
                  isScoresActive ? "text-[#00D9F5]" : "text-slate-500 hover:text-white"
                }`}
              >
                Scores
                <ChevronDown className={`h-3 w-3 transition-transform ${scoresOpen ? "rotate-180" : ""}`} />
              </button>

              {scoresOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#121826] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  <Link
                    href="/scores/efficiency"
                    className={`block px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors ${
                      pathname === "/scores/efficiency"
                        ? "bg-[#00D9F5]/10 text-[#00D9F5]"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Contributor Efficiency
                  </Link>
                  <Link
                    href="/scores/repos"
                    className={`block px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors ${
                      pathname === "/scores/repos"
                        ? "bg-[#00D9F5]/10 text-[#00D9F5]"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Repo Scores
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
           <AuthButton />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden text-slate-400 hover:text-white transition-colors p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#0b0f1a] border-b border-white/5 shadow-2xl flex flex-col py-6 px-6 gap-6">
          {[
            { label: "Identity", href: "/" },
            { label: "Discover", href: "/discover" },
            { label: "Leaderboard", href: "/leaderboard" },
            { label: "Trending", href: "/trending" }
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Scores Links */}
          <div className="border-t border-white/5 pt-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-3">Scores</p>
            <div className="flex flex-col gap-3 pl-2">
              <Link
                href="/scores/efficiency"
                className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                  pathname === "/scores/efficiency" ? "text-[#00D9F5]" : "text-slate-400 hover:text-white"
                }`}
              >
                Contributor Efficiency
              </Link>
              <Link
                href="/scores/repos"
                className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                  pathname === "/scores/repos" ? "text-[#00D9F5]" : "text-slate-400 hover:text-white"
                }`}
              >
                Repo Scores
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 w-full flex">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
