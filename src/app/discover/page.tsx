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
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 py-40 px-6 grid-background">
      <div className="grain-overlay opacity-[0.02]" />
      <div className="container mx-auto max-w-5xl">
        <div className="mb-20 space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-4 py-1 rounded-sm bg-[#00F5A0]/10 border border-[#00F5A0]/20 mb-6">
            <span className="text-[#00F5A0] text-[10px] tracking-[0.4em] uppercase font-black">Talent Identification</span>
          </div>
          <h1 className="editorial-heading text-5xl md:text-7xl">
            Discover <span className="neon-gradient-text italic">Talent</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Surveil global sub-networks for high-impact engineers by geographical coordinates.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-24 relative max-w-2xl mx-auto group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000" />
          <div className="relative flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="GEOGRAPHIC_NODE (e.g. London, Tokyo)"
                className="pl-12 h-16 bg-[#1a2236]/80 border-white/10 text-[10px] font-black tracking-widest uppercase text-white placeholder-slate-700 focus:border-[#00F5A0]/50 transition-all backdrop-blur-xl rounded-xl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="neon-gradient-bg text-[#0b0f1a] font-black h-16 px-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs neon-glow">
              Initialize Search
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40 gap-8 animate-pulse">
            <div className="h-16 w-16 border-4 border-[#00F5A0]/20 border-t-[#00F5A0] rounded-full animate-spin neon-glow" />
            <p className="text-slate-600 font-black text-[10px] tracking-[0.5em] uppercase">Scanning Network Nodes...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 cinematic-card border-red-500/20 bg-red-500/5 px-8">
            <AlertCircle className="h-10 w-10 mx-auto mb-6 text-red-500" />
            <p className="text-red-400 font-black text-[10px] tracking-[0.3em] uppercase">
              {error instanceof Error ? error.message : "NETWORK_FAILURE: SEARCH_INTERRUPTED"}
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex justify-between items-center text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] px-4">
              <span>{data.totalCount.toLocaleString()} NODES_DETECTED</span>
              <span className="text-[#00F5A0]">PAGE_{page}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.results.map((user) => (
                <div 
                  key={user.username}
                  className="cinematic-card p-8 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-[#00F5A0]/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Avatar className="h-14 w-14 border-2 border-white/5 relative">
                        <AvatarImage src={`https://github.com/${user.username}.png`} className="grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <AvatarFallback className="bg-[#1a2236] text-white font-black">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white group-hover:text-[#00F5A0] transition-colors tracking-tight">
                        {user.username}
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest mt-1">
                        {user.status === "analyzed" ? (
                          <span className="text-[#00F5A0]">MAGNITUDE: {user.score?.toFixed(1)}</span>
                        ) : (
                          <span className="text-slate-600">UNRANKED_NODE</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.status === "analyzed" ? (
                    <div className="bg-[#00F5A0]/10 text-[#00F5A0] px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#00F5A0]/20 flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      RANKED
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-12 px-6 glass-effect text-slate-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 hover:border-[#00F5A0]/30 transition-all group/btn"
                      disabled={analyzeMutation.isPending && analyzeMutation.variables === user.username}
                      onClick={() => analyzeMutation.mutate(user.username)}
                    >
                      {analyzeMutation.isPending && analyzeMutation.variables === user.username ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          ANALYZE
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
                className="h-14 px-10 glass-effect border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all disabled:opacity-20"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                &larr; PREV_CHUNK
              </Button>
              <Button 
                variant="outline" 
                className="h-14 px-10 glass-effect border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all disabled:opacity-20"
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoading || page >= 10 || (data.results.length < 100)}
              >
                NEXT_CHUNK &rarr;
              </Button>
            </div>
            {page >= 10 && (
              <p className="text-center text-[9px] text-slate-700 mt-8 font-black uppercase tracking-widest">
                PROTOCOL_LIMIT: 1,000 NODES_SAMPLED. REFINE COORDINATES FOR FURTHER SURVEILLANCE.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
