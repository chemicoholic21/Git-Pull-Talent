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
    <div className="min-h-screen bg-gray-950 text-gray-200 py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Trending Repositories
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                Stay updated with the most popular repositories on GitHub today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative group w-full sm:w-80">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search trending repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Fetching Trending Content...</p>
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <div
                key={repo.fullName}
                className="group relative bg-gray-900/40 border border-gray-800 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/5 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-500" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {repo.avatarUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={repo.avatarUrl}
                          alt={repo.owner}
                          className="w-10 h-10 rounded-lg border border-gray-800"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {repo.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">{repo.owner}</p>
                      </div>
                    </div>
                    <a
                      href={`https://github.com/${repo.fullName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
                    </a>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 min-h-[4.5rem]">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-gray-800/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-mono text-gray-300">
                          {parseInt(repo.stars).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GitFork className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-mono text-gray-300">
                          {parseInt(repo.forks).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {repo.language && (
                      <div className="px-2 py-1 bg-gray-800/50 rounded-md border border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
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
          <div className="text-center py-24 bg-gray-900/20 border border-gray-800/50 rounded-3xl backdrop-blur-sm">
            <p className="text-gray-500 font-mono uppercase tracking-widest">No repositories found matching your search</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] mb-8">
            Data sourced directly from GitHub Trending
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 border border-gray-800 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:border-gray-600 transition-all"
            >
              Check Developer Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
