"use client";

import { useState } from "react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useUserRank } from "@/hooks/useUserRank";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Link from "next/link";

const EXPERIENCE_COLORS = {
  Newcomer: "text-gray-400 border-gray-800 bg-gray-900/50",
  Contributor: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  "Active Contributor": "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  "Core Contributor": "text-purple-400 border-purple-500/20 bg-purple-500/5",
  "Open Source Leader": "text-green-400 border-green-500/20 bg-green-500/5",
};

const CHART_COLORS = [
  "#10b981", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // purple-500
  "#f43f5e", // rose-500
  "#f59e0b", // amber-500
];

export default function UserProfile({ username }: { username: string }) {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError, error } = useAnalysis(username);
  const { data: rankData } = useUserRank(username);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["analysis", username.toLowerCase()] });
    queryClient.invalidateQueries({ queryKey: ["userRank", username.toLowerCase()] });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile URL copied to clipboard!");
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto p-8 bg-gray-900 border border-red-900/20 rounded-md">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{(error as Error).message}</p>
          <Link href="/" className="text-green-400 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !profile) return null; // Let Suspense handle loading

  const chartData = Object.entries(profile.languageBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const formatStars = (stars: number) => {
    if (stars >= 1000) return (stars / 1000).toFixed(1) + "K";
    return stars.toString();
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 50) return "bg-green-500";
    if (percent >= 20) return "bg-yellow-500";
    return "bg-gray-700";
  };

  const topRepo = profile.topRepositories[0];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row gap-8 items-start mb-12 border-b border-gray-900 pb-12">
        <img
          src={profile.user.avatarUrl}
          alt={username}
          className="w-24 h-24 rounded-md border border-gray-800 shadow-2xl"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">{profile.user.name || username}</h1>
            <span
              className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest ${
                EXPERIENCE_COLORS[profile.experienceLevel]
              }`}
            >
              {profile.experienceLevel}
            </span>
          </div>
          <p className="text-gray-400 mb-4 max-w-xl">{profile.user.bio}</p>
          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="text-white">{profile.user.followers}</span> Followers
            </span>
            <span className="flex items-center gap-1">
              <span className="text-white">{profile.user.following}</span> Following
            </span>
            <button
              onClick={copyToClipboard}
              className="ml-4 px-3 py-1 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded text-xs transition-colors"
            >
              Share
            </button>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded text-xs transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="md:text-right flex flex-col items-start md:items-end gap-1">
          <div className="text-xs uppercase text-gray-500 font-bold tracking-widest">Total Importance Score</div>
          <div className="text-5xl font-mono text-white font-bold tabular-nums">
            {profile.totalScore.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
          {rankData && (
            <div className="text-cyan-400 font-bold mt-1">
              #{rankData.rank} globally
              <span className="text-gray-600 font-normal text-xs ml-2">among {rankData.totalUsers} tracked</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Repository Table */}
        <div className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-4 bg-green-500 inline-block" />
              Top Repositories
            </h2>
          </div>
          <div className="bg-gray-900/50 border border-gray-900 rounded-md overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-gray-950/50 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
                  <th className="px-6 py-4">Repository</th>
                  <th className="px-4 py-4">Stars</th>
                  <th className="px-4 py-4">Your PRs</th>
                  <th className="px-4 py-4">Contribution %</th>
                  <th className="px-6 py-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {profile.topRepositories.map((repo) => {
                  const percent = Math.round((repo.userPRs / repo.totalPRs) * 100) || 0;
                  return (
                    <tr key={repo.name} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link
                          href={`https://github.com/${username}/${repo.name}`}
                          target="_blank"
                          className="text-white font-medium hover:text-green-400 transition-colors"
                        >
                          {repo.name}
                        </Link>
                        <div className="text-[10px] text-gray-600 font-bold uppercase mt-0.5">{repo.language}</div>
                      </td>
                      <td className="px-4 py-4 font-mono text-gray-400">{formatStars(repo.stars)}</td>
                      <td className="px-4 py-4 font-mono text-gray-400">
                        {repo.userPRs} <span className="text-[10px] opacity-30">/ {repo.totalPRs}</span>
                      </td>
                      <td className="px-4 py-4 min-w-[120px]">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(percent)} transition-all`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] w-8">{percent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-green-400 font-bold">
                        +{repo.score.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts and Language */}
        <div className="space-y-8">
          <div className="bg-gray-900/30 border border-gray-900 p-6 rounded-md h-full flex flex-col">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-500 inline-block" />
              Language Mix
            </h2>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData} margin={{ left: -10, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#030712",
                      border: "1px solid #1f2937",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Score Explanation */}
      <section className="bg-gray-900/30 border border-gray-900 rounded-md overflow-hidden">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900/50 transition-colors"
        >
          <span className="font-bold text-gray-400 uppercase text-xs tracking-widest">How is this calculated?</span>
          <span className="text-gray-600">{showExplanation ? "−" : "+"}</span>
        </button>
        {showExplanation && (
          <div className="px-6 pb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4 border-t border-gray-800">
              <div>
                <h4 className="text-white font-bold mb-4">The Formula</h4>
                <div className="bg-gray-950 p-6 rounded-md border border-gray-800 font-mono text-sm leading-relaxed mb-6">
                  score = stars × (merged_prs_by_user / total_merged_prs)
                </div>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    Projects with &lt;10 stars are skipped.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    Scores are capped at 10,000 per repo to prevent outliers.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    We use GraphQL to scan your last 50 active repos and contributions.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Actual Calculation</h4>
                {topRepo && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 italic">Example from your top project: {topRepo.name}</p>
                    <div className="bg-gray-950 p-6 rounded-md border border-gray-800 font-mono text-sm">
                      <div className="flex justify-between mb-2">
                        <span>Stars:</span>
                        <span className="text-white">{topRepo.stars}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Your Merged PRs:</span>
                        <span className="text-white">{topRepo.userPRs}</span>
                      </div>
                      <div className="flex justify-between mb-4 border-b border-gray-800 pb-2">
                        <span>Total Merged PRs:</span>
                        <span className="text-white">{topRepo.totalPRs}</span>
                      </div>
                      <div className="flex justify-between text-green-400 font-bold">
                        <span>Computed Score:</span>
                        <span>{topRepo.score.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer link */}
      <div className="mt-12 text-center">
        <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">
          &larr; Back to Global Search
        </Link>
      </div>
    </div>
  );
}
