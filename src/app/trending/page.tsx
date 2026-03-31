"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, GitFork, ExternalLink, Loader2, Search, Code } from "lucide-react";

interface TrendingRepo {
  fullName: string;
  owner: string;
  name: string;
  description: string;
  language: string;
  stars: string;
  forks: string;
  avatarUrl: string;
}

export default function TrendingPage() {
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchTrending() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/trending?type=repositories`);
        const data = await response.json();
        setRepos(data.repos || []);
      } catch (error) {
        console.error("Failed to fetch trending repos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrending();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 py-40 px-6 grid-background">
      <div className="grain-overlay opacity-[0.02]" />
      <div className="container mx-auto max-w-7xl">
        <div className="mb-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 rounded-sm bg-[#00D9F5]/10 border border-[#00D9F5]/20">
                <span className="text-[#00D9F5] text-[10px] tracking-[0.4em] uppercase font-black">Market Intelligence</span>
              </div>
              <h1 className="editorial-heading text-5xl md:text-7xl">
                Trending <span className="neon-gradient-text italic">Nodes</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl leading-relaxed font-light">
                Real-time surveillance of the most active signal emitters within the global sub-networks.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
              <div className="relative group w-full sm:w-96">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00D9F5] to-[#7F5AF0] rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="IDENT_FILTER..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a2236]/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder-slate-700 focus:outline-none transition-all backdrop-blur-xl uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8 animate-pulse">
            <div className="h-16 w-16 border-4 border-[#00D9F5]/20 border-t-[#00D9F5] rounded-full animate-spin neon-glow" />
            <p className="text-slate-600 font-black text-[10px] tracking-[0.5em] uppercase">Harvesting Network Data...</p>
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {filteredRepos.map((repo) => (
              <div
                key={repo.fullName}
                className="cinematic-card p-10 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-[#00D9F5]/10 to-transparent rounded-full blur-3xl group-hover:from-[#00D9F5]/20 transition-colors duration-700" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                      {repo.avatarUrl && (
                        <div className="p-1 rounded-xl bg-white/5 border border-white/10">
                          <img
                            src={repo.avatarUrl}
                            alt={repo.owner}
                            className="w-12 h-12 rounded-lg grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#00D9F5] transition-colors line-clamp-1 tracking-tight">
                          {repo.name}
                        </h3>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{repo.owner}</p>
                      </div>
                    </div>
                    <a
                      href={`https://github.com/${repo.fullName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 glass-effect rounded-xl text-slate-500 hover:text-white transition-all hover:scale-110"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 min-h-[4.5rem] font-light">
                    {repo.description || "No signal metadata broadcasted for this node."}
                  </p>

                  <div className="pt-8 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-[#00F5A0]" />
                        <span className="text-xs font-mono text-slate-300 font-bold">
                          {parseInt(repo.stars).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GitFork className="w-3.5 h-3.5 text-[#7F5AF0]" />
                        <span className="text-xs font-mono text-slate-300 font-bold">
                          {parseInt(repo.forks).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {repo.language && (
                      <div className="px-3 py-1 glass-effect rounded-md border border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#00D9F5]">
                          {repo.language}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 cinematic-card">
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px]">No active signals matching search parameters</p>
          </div>
        )}

        <div className="mt-32 text-center">
          <p className="text-[10px] text-slate-700 uppercase tracking-[0.5em] mb-12 font-black">
            Transmission Source: GitHub Global Protocol
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-4 px-10 py-5 glass-effect rounded-xl text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-[#00F5A0] hover:border-[#00F5A0]/30 transition-all group"
            >
              Access Vanguard Index
              <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
