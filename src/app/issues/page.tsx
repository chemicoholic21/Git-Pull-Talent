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
    <div className="min-h-screen bg-gray-950 text-gray-200 py-32 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Good First Issues
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                Jumpstart your open-source journey with these beginner-friendly issues.
              </p>
            </div>
            
            <div className="relative group w-full lg:w-96">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search by title, repo, or label..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Scanning for Opportunities...</p>
          </div>
        ) : filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="group relative bg-gray-900/40 border border-gray-800 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-[10px] font-bold text-green-400 uppercase tracking-wider">
                        Open
                      </div>
                      <Link 
                        href={`https://github.com/${issue.repository.name}`}
                        target="_blank"
                        className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3 h-3" />
                        {issue.repository.name}
                      </Link>
                    </div>

                    <a 
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group-hover:text-cyan-400 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {issue.title}
                      </h3>
                    </a>

                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                      {issue.bodyText}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {issue.labels.map((label) => (
                        <span
                          key={label.name}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                          style={{ 
                            backgroundColor: `#${label.color}15`, 
                            borderColor: `#${label.color}40`,
                            color: `#${label.color}` 
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 shrink-0">
                    <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Star className="w-3 h-3 text-amber-400" />
                        {issue.repository.stars.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-cyan-500/10 border border-gray-700 hover:border-cyan-500/30 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-all"
                    >
                      View Issue
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-900/20 border border-gray-800/50 rounded-3xl backdrop-blur-sm">
            <Tag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-mono uppercase tracking-widest">No issues found matching your criteria</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] mb-8">
            Real-time search powered by GitHub API
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 border border-gray-800 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:border-gray-600 transition-all"
            >
              Discover Trending Repos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
