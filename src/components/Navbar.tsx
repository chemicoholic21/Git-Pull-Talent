"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { Github, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
              { label: "Vanguard", href: "/leaderboard" },
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
          <div className="pt-4 border-t border-white/5 w-full flex">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
