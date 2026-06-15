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
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { SkillBreakdown } from "@/components/SkillBreakdown";
import { Linkedin, Twitter, Globe, Mail, MapPin, Building2, Github, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EXPERIENCE_COLORS = {
  Newcomer: "text-zinc-500 border-white/[0.06] bg-white/[0.04]",
  Contributor: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  "Active Contributor": "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  "Core Contributor": "text-violet-400 border-violet-500/20 bg-violet-500/10",
  "Open Source Leader": "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
};

const CHART_COLORS = [
  "#818cf8",
  "#34d399",
  "#f59e0b",
  "#f472b6",
  "#60a5fa",
  "#a78bfa",
];

export default function UserProfile({ username }: { username: string }) {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError, error } = useAnalysis(username);
  const { data: rankData } = useUserRank(username);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["analysis", username.toLowerCase()] });
    queryClient.invalidateQueries({ queryKey: ["userRank", username.toLowerCase()] });
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-6 py-40 text-center min-h-screen">
        <div className="max-w-xl mx-auto p-10 md:p-16 dev-surface">
          <h2 className="dev-heading text-3xl text-red-400 mb-6">Something went wrong</h2>
          <p className="text-zinc-500 mb-10 text-sm">{(error as Error).message}</p>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium">
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const chartData = Object.entries(profile.languageBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const formatStars = (stars: number) => {
    if (stars >= 1000) return (stars / 1000).toFixed(1) + "K";
    return stars.toString();
  };

  const topRepo = profile.topRepositories[0];

  return (
    <div className="relative min-h-screen pt-24 md:pt-32 pb-40 px-6 overflow-x-hidden">
      <div className="container mx-auto max-w-6xl relative z-10 w-full">
        {/* Profile Hero */}
        <header className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
          <div className="relative group shrink-0 w-32 md:w-48">
            <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl blur-xl opacity-10 group-hover:opacity-20 transition duration-1000" />
            <div className="relative rounded-2xl bg-[#141418] border border-white/[0.06] p-2 w-full">
              <img
                src={profile.user.avatarUrl}
                alt={username}
                className="w-full h-auto aspect-square rounded-xl object-cover shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#141418] border border-white/[0.06] p-3 rounded-xl shadow-xl">
              <Github className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-center lg:text-left min-w-0 w-full overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-8 mb-6 overflow-hidden">
              <h1 className="dev-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex-1 truncate leading-tight">
                {profile.user.name?.split(' ')[0] || username}
                <span className="opacity-30 ml-2 md:ml-4">{profile.user.name?.split(' ')[1] || ""}</span>
              </h1>
              <span
                className={`px-4 py-1.5 md:px-5 md:py-2 rounded-lg border text-xs font-semibold shrink-0 ${
                  EXPERIENCE_COLORS[profile.experienceLevel as keyof typeof EXPERIENCE_COLORS]
                }`}
              >
                {profile.experienceLevel}
              </span>
            </div>
            
            <p className="text-sm md:text-lg text-zinc-500 mb-8 max-w-2xl leading-relaxed border-l-2 border-indigo-500/30 pl-4 mx-auto lg:mx-0 break-words">
              &ldquo;{profile.user.bio || "No bio provided."}&rdquo;
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-x-6 lg:gap-x-10 gap-y-4 mb-10 text-xs text-zinc-500 w-full">
              {profile.user.location && (
                <div className="flex items-center gap-2 max-w-full">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-full">{profile.user.location}</span>
                </div>
              )}
              {profile.user.company && (
                <div className="flex items-center gap-2 max-w-full">
                  <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-full">{profile.user.company}</span>
                </div>
              )}
              {profile.user.websiteUrl && (
                <a href={profile.user.websiteUrl.startsWith('http') ? profile.user.websiteUrl : `https://${profile.user.websiteUrl}`} 
                   target="_blank" 
                   className="flex items-center gap-2 hover:text-white transition-colors group max-w-full">
                  <Globe className="h-4 w-4 text-violet-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate max-w-full">{profile.user.websiteUrl.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {profile.user.twitterUsername && (
                <a href={`https://twitter.com/${profile.user.twitterUsername}`} 
                   target="_blank" 
                   className="flex items-center gap-2 hover:text-indigo-400 transition-colors group max-w-full">
                  <Twitter className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate max-w-full">@{profile.user.twitterUsername}</span>
                </a>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12 text-zinc-500 w-full">
              <span className="flex items-center gap-3">
                <span className="text-white text-xl md:text-2xl font-semibold">{profile.user.followers}</span>
                <span className="text-xs">Followers</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-white text-xl md:text-2xl font-semibold">{profile.contributionCount}</span>
                <span className="text-xs">Contributions</span>
              </span>
              <div className="h-8 w-px bg-white/[0.06] hidden lg:block" />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={copyToClipboard}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs font-medium"
                >
                  Copy link
                </button>
                <button
                  onClick={handleRefresh}
                  className="text-zinc-500 hover:text-indigo-400 transition-colors text-xs font-medium"
                >
                  Refresh data
                </button>
              </div>
            </div>
          </div>

          <div className="lg:text-right flex flex-col items-center lg:items-end lg:min-w-[250px] bg-[#141418]/80 p-6 md:p-8 rounded-2xl border border-white/[0.06] w-full lg:w-auto shrink-0 mt-8 lg:mt-0">
            <div className="text-xs text-zinc-500 mb-4 font-medium">Aggregate score</div>
            <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-indigo-400 leading-none mb-6 tabular-nums truncate max-w-full">
              {profile.totalScore.toFixed(1)}
            </div>
            {rankData && (
              <div className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-lg text-xs font-semibold mb-8 md:mb-12">
                Rank #{rankData.rank}
              </div>
            )}

            <div className="w-full max-w-sm lg:ml-auto">
              <SkillBreakdown 
                scores={{
                  total: profile.totalScore,
                  ai: profile.aiScore || 0,
                  backend: profile.backendScore || 0,
                  frontend: profile.frontendScore || 0,
                  devops: profile.devopsScore || 0,
                  data: profile.dataScore || 0,
                }}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12 mb-24 w-full">
          {/* Top Repositories */}
          <div className="xl:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between px-2 gap-4">
              <h2 className="dev-heading text-2xl md:text-3xl">Top repositories</h2>
              <span className="text-xs text-zinc-600 font-medium">Latest 50 contributions</span>
            </div>
            
            <div className="dev-surface overflow-hidden w-full rounded-2xl">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs md:text-sm whitespace-nowrap min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0c0c0f]/50 text-xs text-zinc-500 font-medium border-b border-white/[0.04]">
                      <th className="px-6 md:px-8 py-5 max-w-[200px]">Repository</th>
                      <th className="px-6 py-5 w-32">Stars</th>
                      <th className="px-6 md:px-8 py-5 text-right w-24">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {profile.topRepositories.map((repo) => (
                      <tr key={repo.name} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 md:px-8 py-5 max-w-[200px] md:max-w-[300px] truncate">
                          <Link
                             href={`https://github.com/${repo.ownerLogin || username}/${repo.name}`}
                             target="_blank"
                             className="text-white text-sm md:text-base font-semibold group-hover:text-indigo-400 transition-colors block truncate"
                          >
                             {repo.name}
                          </Link>
                          <div className="flex items-center gap-3 mt-2 truncate">
                            <span className="text-xs text-zinc-600 font-medium truncate max-w-[100px]">
                              {repo.language || 'Multi'}
                            </span>
                            <div className="w-1 h-1 bg-white/[0.1] rounded-full shrink-0" />
                            <span className="text-xs text-indigo-400 font-medium shrink-0">
                              {repo.userPRs} / {repo.totalPRs} PRs
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2">
                            <span className="text-zinc-400 font-mono text-xs">
                              {formatStars(repo.stars)}
                            </span>
                            <div className="w-24 md:w-32 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-indigo-500 transition-all duration-1000 rounded-full"
                                 style={{ width: `${Math.min((repo.userPRs / repo.totalPRs) * 100, 100)}%` }}
                               />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 text-right">
                          <span className="text-indigo-400 font-mono font-semibold text-lg md:text-xl">
                            +{repo.score.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 w-full overflow-hidden">
            <div className="px-2">
              <h2 className="dev-heading text-2xl md:text-3xl">Languages</h2>
            </div>
            
            <div className="dev-surface p-6 md:p-8 h-[500px] md:h-[600px] flex flex-col group w-full overflow-hidden rounded-2xl">
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={chartData} margin={{ left: -20, right: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }}
                      width={90}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.02)" }}
                      contentStyle={{
                        backgroundColor: "#141418",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        padding: "8px 12px",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={14}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 pt-8 border-t border-white/[0.04] overflow-hidden">
                <p className="text-xs text-zinc-500 font-medium group-hover:text-indigo-400 transition-colors truncate">
                   Key skills
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.uniqueSkills.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.04] text-xs font-medium text-zinc-400 truncate max-w-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring explanation */}
        <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600 w-full">
          <div className="dev-surface overflow-hidden w-full rounded-2xl">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full px-6 md:px-10 py-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <span className="text-indigo-400 font-bold text-xs">01</span>
                </div>
                <span className="dev-heading text-lg md:text-2xl text-left truncate">How scoring works</span>
              </div>
              <span className="text-zinc-500 text-2xl md:text-3xl font-light pl-4 shrink-0">{showExplanation ? "−" : "+"}</span>
            </button>
            
            {showExplanation && (
              <div className="px-6 md:px-10 pb-12 animate-in slide-in-from-top-4 duration-300 w-full overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 pt-8 border-t border-white/[0.04] w-full">
                  <div className="space-y-8 min-w-0">
                    <h4 className="text-xs font-semibold text-emerald-400">Formula</h4>
                    <div className="bg-[#0c0c0f] p-4 md:p-6 rounded-xl border border-white/[0.04] font-mono text-sm text-white/80 leading-relaxed overflow-x-auto text-nowrap whitespace-nowrap">
                      score = stars × (user_prs / total_prs)
                    </div>
                    <ul className="space-y-6">
                      {[
                        "Repositories with fewer than 10 stars are excluded from scoring.",
                        "Per-repository score is capped at 10,000 to prevent outliers.",
                        "Analysis covers the 50 most active repositories in your history."
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4 items-start min-w-0">
                          <span className="text-indigo-400 font-mono font-semibold text-xs pt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                          <p className="text-sm text-zinc-500 leading-relaxed break-words">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-8 min-w-0">
                    <h4 className="text-xs font-semibold text-violet-400">Example</h4>
                    {topRepo ? (
                      <div className="bg-[#0c0c0f] border border-white/[0.04] p-6 md:p-8 rounded-xl space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
                          <span className="text-xs text-zinc-500 font-medium">Repository</span>
                          <span className="text-white font-semibold text-sm truncate max-w-full">{topRepo.name}</span>
                        </div>
                        <div className="h-px bg-white/[0.04] w-full" />
                        <div className="grid grid-cols-2 gap-6 md:gap-8">
                          <div className="space-y-2 min-w-0">
                            <p className="text-xs text-zinc-500 font-medium truncate">Stars</p>
                            <p className="text-lg md:text-xl text-white font-mono truncate">{topRepo.stars}</p>
                          </div>
                          <div className="space-y-2 min-w-0">
                            <p className="text-xs text-zinc-500 font-medium truncate">Score</p>
                            <p className="text-lg md:text-xl text-indigo-400 font-mono truncate">{topRepo.score.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#0c0c0f] border border-white/[0.04] p-6 rounded-xl flex items-center justify-center min-h-[150px]">
                         <span className="text-sm text-zinc-500">No data available</span>
                      </div>
                    )}
                    <p className="text-xs text-zinc-600 italic">
                      Based on latest data from GitHub.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mt-24 md:mt-32 text-center w-full">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors font-medium max-w-full">
            ← <span className="truncate">Back to search</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
