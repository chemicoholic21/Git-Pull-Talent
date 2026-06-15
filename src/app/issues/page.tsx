"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Search, BookOpen, Star, Clock, Tag } from "lucide-react";

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
    <div className="min-h-screen bg-[#0c0c0f] text-zinc-400 py-40 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                Good first issues
              </div>
              <h1 className="dev-heading text-5xl md:text-7xl">
                Open issues
              </h1>
              <p className="text-xl text-zinc-500 max-w-3xl leading-relaxed">
                Start contributing to open source with beginner-friendly issues from popular repositories.
              </p>
            </div>
            
            <div className="relative group w-full lg:w-96">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500" />
              </div>
              <input
                type="text"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#18181c] border border-white/[0.06] rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8 animate-pulse">
            <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-zinc-600 text-sm">Loading issues...</p>
          </div>
        ) : filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="dev-card p-8 group"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-400">
                        Open
                      </div>
                      <Link 
                        href={`https://github.com/${issue.repository.name}`}
                        target="_blank"
                        className="text-xs font-medium text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {issue.repository.name}
                      </Link>
                    </div>

                    <a 
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group-hover:text-indigo-400 transition-all"
                    >
                      <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                        {issue.title}
                      </h3>
                    </a>

                    <p className="text-zinc-500 line-clamp-2 leading-relaxed">
                      {issue.bodyText || "No description provided."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {issue.labels.map((label) => (
                        <span
                          key={label.name}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-white/[0.04] bg-white/[0.04]"
                          style={{ 
                            color: `#${label.color}` 
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between md:items-end gap-6 shrink-0">
                    <div className="flex items-center gap-6 md:flex-col md:items-end md:gap-3">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Star className="w-4 h-4 text-emerald-400" />
                        {issue.repository.stars.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Clock className="w-4 h-4 text-violet-400" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all hover:bg-indigo-400 active:scale-[0.98]"
                    >
                      View issue
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 dev-card">
            <Tag className="w-16 h-16 text-zinc-700 mx-auto mb-8" />
            <p className="text-zinc-600 text-sm">No issues match your search</p>
          </div>
        )}

        <div className="mt-32 text-center">
          <p className="text-xs text-zinc-700 mb-12">
            Data from GitHub
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/trending"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all font-medium group"
            >
              Trending repositories
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
