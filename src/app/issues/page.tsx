"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Search, BookOpen, Star, Clock, Tag } from "lucide-react";

interface Issue {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  bodyText: string;
  repository: {
    name: string;
    stars: number;
    url: string;
    language: string;
  };
  labels: Array<{
    name: string;
    color: string;
  }>;
  author: {
    login: string;
    avatarUrl: string;
  };
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchIssues() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/issues");
        const data = await response.json();
        setIssues(data.issues || []);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIssues();
  }, []);

  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.repository.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.labels.some(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 py-40 px-6 grid-background">
      <div className="grain-overlay opacity-[0.02]" />
      <div className="container mx-auto max-w-6xl">
        <div className="mb-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 rounded-sm bg-[#00F5A0]/10 border border-[#00F5A0]/20">
                <span className="text-[#00F5A0] text-[10px] tracking-[0.4em] uppercase font-black">Mission Control</span>
              </div>
              <h1 className="editorial-heading text-5xl md:text-7xl">
                Open <span className="neon-gradient-text italic">Missions</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl leading-relaxed font-light">
                Initialize your trajectory within the global ecosystem via high-impact entry nodes.
              </p>
            </div>
            
            <div className="relative group w-full lg:w-96">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="MISSION_SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a2236]/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder-slate-700 focus:outline-none transition-all backdrop-blur-xl uppercase"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8 animate-pulse">
            <div className="h-16 w-16 border-4 border-[#00F5A0]/20 border-t-[#00F5A0] rounded-full animate-spin neon-glow" />
            <p className="text-slate-600 font-black text-[10px] tracking-[0.5em] uppercase">Decrypting Mission Data...</p>
          </div>
        ) : filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="cinematic-card p-10 group relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-[#00F5A0]/10 border border-[#00F5A0]/20 rounded text-[9px] font-black text-[#00F5A0] uppercase tracking-[0.2em]">
                        ACTIVE_NODE
                      </div>
                      <Link 
                        href={`https://github.com/${issue.repository.name}`}
                        target="_blank"
                        className="text-[10px] font-black tracking-widest text-slate-500 hover:text-[#00D9F5] transition-colors flex items-center gap-2 uppercase"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {issue.repository.name}
                      </Link>
                    </div>

                    <a 
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group-hover:text-[#00D9F5] transition-all"
                    >
                      <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                        {issue.title}
                      </h3>
                    </a>

                    <p className="text-lg text-slate-400 line-clamp-2 leading-relaxed font-light">
                      {issue.bodyText || "No decryption available for this mission packet."}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {issue.labels.map((label) => (
                        <span
                          key={label.name}
                          className="px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-white/5 bg-white/5"
                          style={{ 
                            color: `#${label.color}` 
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between md:items-end gap-8 shrink-0">
                    <div className="flex items-center gap-8 md:flex-col md:items-end md:gap-4">
                      <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Star className="w-4 h-4 text-[#00F5A0]" />
                        {issue.repository.stars.toLocaleString()} MAG
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Clock className="w-4 h-4 text-[#7F5AF0]" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-10 py-4 neon-gradient-bg text-[#0b0f1a] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 neon-glow"
                    >
                      Initialize Mission
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 cinematic-card">
            <Tag className="w-16 h-16 text-slate-800 mx-auto mb-8" />
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">No mission opportunities detected in current sub-network</p>
          </div>
        )}

        <div className="mt-32 text-center">
          <p className="text-[10px] text-slate-700 uppercase tracking-[0.5em] mb-12 font-black">
            Mission Surveillance powered by GitHub Intelligence
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/trending"
              className="inline-flex items-center gap-4 px-10 py-5 glass-effect rounded-xl text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-[#00F5A0] hover:border-[#00F5A0]/30 transition-all group"
            >
              Surveil Trending Nodes
              <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
