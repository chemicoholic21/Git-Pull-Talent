"use client";

import { useState } from"react";
import { useQuery, useMutation, useQueryClient } from"@tanstack/react-query";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { Search, Loader2, CheckCircle2, AlertCircle, PlusCircle } from"lucide-react";
import { Badge } from"@/components/ui/badge";
import Link from"next/link";
import { Avatar, AvatarImage, AvatarFallback } from"@/components/ui/avatar";

interface SearchResult {
  username: string;
  status:"analyzed" |"pending";
  score: number | null;
}

interface SearchResponse {
  totalCount: number;
  results: SearchResult[];
  error?: string;
}

export default function DiscoverPage() {
  const [location, setLocation] = useState("San Francisco");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<SearchResponse>({
    queryKey: ["discover", location, page],
    queryFn: async () => {
      const res = await fetch(`/api/github/search?location=${encodeURIComponent(location)}&page=${page}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ||"Search failed");
      return json;
    },
    enabled: !!location,
    staleTime: 60000,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (username: string) => {
      const res = await fetch(`/api/analyze/${username}`);
      if (!res.ok) throw new Error("Analysis failed");
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["discover", location, page], (old: SearchResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((r) => 
            r.username === variables ? { ...r, status:"analyzed", score: data.totalScore } : r
          ),
        };
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-zinc-400 py-40 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-20 space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-4 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <span className="text-indigo-400 text-xs tracking-wide uppercase font-semibold">Discover developers</span>
          </div>
          <h1 className="dev-heading text-5xl md:text-7xl">
            Discover talent
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-light">
            Find high-impact open-source developers by location.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-24 relative max-w-2xl mx-auto group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000" />
          <div className="relative flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="City or region (e.g. London, Tokyo)"
                className="pl-12 h-16 bg-[#18181c]/80 border-white/[0.06] text-xs font-semibold tracking-widest uppercase text-white placeholder-slate-700 focus:border-indigo-500/50 transition-all backdrop-blur-xl rounded-xl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-indigo-500 text-white font-semibold h-16 px-12 rounded-xl transition-all hover:bg-indigo-400 active:scale-[0.98] text-xs">
              Search
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40 gap-8 animate-pulse">
            <div className="h-16 w-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-zinc-600 font-semibold text-xs tracking-wide uppercase">Searching...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 dev-card border-red-500/20 bg-red-500/5 px-8">
            <AlertCircle className="h-10 w-10 mx-auto mb-6 text-red-500" />
            <p className="text-red-400 font-semibold text-xs tracking-[0.3em] uppercase">
              {error instanceof Error ? error.message : "Search failed"}
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex justify-between items-center text-xs text-zinc-600 font-semibold uppercase tracking-wide px-4">
              <span>{data.totalCount.toLocaleString()} developers found</span>
              <span className="text-indigo-400">Page {page}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.results.map((user) => (
                <div 
                  key={user.username}
                  className="dev-card p-8 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-indigo-500/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Avatar className="h-14 w-14 border-2 border-white/[0.04] relative">
                        <AvatarImage src={`https://github.com/${user.username}.png`} className="grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <AvatarFallback className="bg-[#18181c] text-white font-semibold">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                        {user.username}
                      </div>
                      <div className="text-[9px] font-semibold uppercase tracking-widest mt-1">
                        {user.status === "analyzed" ? (
                          <span className="text-indigo-400">Score: {user.score?.toFixed(1)}</span>
                        ) : (
                          <span className="text-zinc-600">Not yet analyzed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.status === "analyzed" ? (
                    <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-lg text-[9px] font-semibold uppercase tracking-widest border border-indigo-500/20 flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      Analyzed
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-12 px-6 bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-white rounded-xl text-[9px] font-semibold uppercase tracking-widest border border-white/[0.04] hover:border-indigo-500/30 transition-all group/btn"
                      disabled={analyzeMutation.isPending && analyzeMutation.variables === user.username}
                      onClick={() => analyzeMutation.mutate(user.username)}
                    >
                      {analyzeMutation.isPending && analyzeMutation.variables === user.username ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Analyze
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-12 pt-12">
              <Button 
                variant="outline" 
                className="h-14 px-10 bg-white/[0.04] border border-white/[0.06] border-white/[0.04] rounded-xl text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-white transition-all disabled:opacity-20"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                &larr; Previous
              </Button>
              <Button 
                variant="outline" 
                className="h-14 px-10 bg-white/[0.04] border border-white/[0.06] border-white/[0.04] rounded-xl text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-white transition-all disabled:opacity-20"
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoading || page >= 10 || (data.results.length < 100)}
              >
                Next &rarr;
              </Button>
            </div>
            {page >= 10 && (
              <p className="text-center text-[9px] text-zinc-700 mt-8 font-semibold uppercase tracking-widest">
                Maximum 1,000 results. Try a more specific location.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
