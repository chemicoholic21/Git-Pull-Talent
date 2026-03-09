"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { deriveExperienceLevel } from "@/lib/scoring";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RANK_BADGES: Record<number, string> = {
  1: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
  2: "bg-gray-400/10 text-gray-400 border-gray-400/20 shadow-[0_0_15px_rgba(156,163,175,0.1)]",
  3: "bg-amber-700/10 text-amber-700 border-amber-700/20 shadow-[0_0_15px_rgba(180,83,9,0.1)]",
};

const EXPERIENCE_COLORS = {
  Newcomer: "text-gray-500",
  Contributor: "text-blue-400",
  "Active Contributor": "text-cyan-400",
  "Core Contributor": "text-purple-400",
  "Open Source Leader": "text-green-400",
};

export default function LeaderboardPage() {
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const { data: leaderboard, isLoading } = useLeaderboard(limit);

  const filteredData = leaderboard?.filter((user) =>
    user.username.toLowerCase().includes(filter.toLowerCase())
  );

  const maxScore = leaderboard?.[0]?.totalScore || 1;

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      router.push(`/analyze/${searchUsername.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 font-sans selection:bg-green-500/30 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header CTA */}
        <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-900/30 p-8 rounded-md border border-gray-900 shadow-2xl">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Global Rankings</h1>
            <p className="text-gray-500 text-sm">See where you stand in the global open-source community.</p>
          </div>
          <form onSubmit={handleUserSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Find a developer..."
              className="bg-gray-950 border border-gray-800 rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500 w-full"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-400 text-gray-950 font-bold px-4 py-2 rounded text-sm transition-colors"
            >
              Analyze
            </button>
          </form>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex bg-gray-900 p-1 rounded-md border border-gray-800">
            {[20, 50, 100].map((val) => (
              <button
                key={val}
                onClick={() => setLimit(val)}
                className={`px-4 py-1 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                  limit === val
                    ? "bg-gray-800 text-green-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Top {val}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Filter by name..."
              className="w-full bg-transparent border-b border-gray-900 py-2 px-1 text-sm text-white focus:outline-none focus:border-green-500/50 transition-all placeholder:text-gray-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-900 rounded-md overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-950/50 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
                <th className="px-6 py-5">Rank</th>
                <th className="px-6 py-5">Developer</th>
                <th className="px-6 py-5">Experience Level</th>
                <th className="px-6 py-5 text-right">Importance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50">
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-5 h-16 bg-gray-900/20" />
                  </tr>
                ))
              ) : (
                filteredData?.map((entry) => {
                  const isCurrentUser = (session?.user?.login || session?.user?.name)?.toLowerCase() === entry.username.toLowerCase();
                  const expLevel = deriveExperienceLevel(entry.totalScore);
                  const scoreWidth = (entry.totalScore / maxScore) * 100;

                  return (
                    <tr
                      key={entry.username}
                      className={`hover:bg-gray-800/30 transition-all group ${
                        isCurrentUser ? "bg-green-500/[0.03] border-x-2 border-green-500/20" : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded border text-xs font-mono font-bold ${
                            RANK_BADGES[entry.rank] || "bg-gray-900/50 border-gray-800 text-gray-500"
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <Link href={`/analyze/${entry.username}`} className="flex items-center gap-3">
                          <img
                            src={entry.avatarUrl}
                            alt={entry.username}
                            className={`w-8 h-8 rounded border transition-all ${
                              isCurrentUser ? "border-green-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "border-gray-800"
                            }`}
                          />
                          <span className="text-white font-medium group-hover:text-green-400 transition-colors">
                            {entry.username}
                            {isCurrentUser && (
                              <span className="ml-2 text-[8px] uppercase tracking-tighter bg-green-500 text-gray-950 px-1 rounded">You</span>
                            )}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${EXPERIENCE_COLORS[expLevel]}`}>
                          {expLevel}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-lg font-mono text-white font-bold tracking-tight">
                            {entry.totalScore.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                          </span>
                          <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                              style={{ width: `${scoreWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {!isLoading && filteredData?.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500 italic text-sm">No matches found for &quot;{filter}&quot;</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-xs text-gray-600 uppercase tracking-[0.2em] font-bold">
          Data refreshes every 6 hours • Score capped at 10K per repo
        </div>
      </div>
    </div>
  );
}
