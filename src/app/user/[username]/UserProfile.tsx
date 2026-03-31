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
  Newcomer: "text-slate-500 border-white/5 bg-white/5",
  Contributor: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  "Active Contributor": "text-[#00D9F5] border-[#00D9F5]/20 bg-[#00D9F5]/5",
  "Core Contributor": "text-[#7F5AF0] border-[#7F5AF0]/20 bg-[#7F5AF0]/5",
  "Open Source Leader": "text-[#00F5A0] border-[#00F5A0]/20 bg-[#00F5A0]/5",
};

const CHART_COLORS = [
  "#00F5A0",
  "#00D9F5",
  "#7F5AF0",
  "#2CB67D",
  "#0072FF",
  "#F500D9",
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
    alert("Profile identity captured and copied!");
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-6 py-40 text-center min-h-screen layout-grid border-x border-white/5 border-dashed">
        <div className="max-w-xl mx-auto p-10 md:p-16 dev-surface">
          <h2 className="dev-heading text-3xl text-red-500 mb-6">System Malfunction</h2>
          <p className="text-slate-400 mb-10 text-sm">{(error as Error).message}</p>
          <Link href="/" className="text-white font-bold tracking-widest uppercase text-xs border-b border-white/10 pb-2 hover:border-[#00D9F5] hover:text-[#00D9F5] transition-all">
            &larr; Re-initialize System
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
    <div className="relative min-h-screen pt-24 md:pt-32 pb-40 px-6 overflow-x-hidden layout-grid border-x border-white/5 border-dashed">
      <div className="container mx-auto max-w-6xl relative z-10 w-full">
        {/* Profile Hero */}
        <header className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
          <div className="relative group shrink-0 w-32 md:w-48">
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#00F5A0] to-[#00D9F5] rounded-xl blur-xl opacity-10 group-hover:opacity-30 transition duration-1000" />
            <div className="relative rounded-2xl bg-[#121826] border border-white/10 p-2 w-full">
              <img
                src={profile.user.avatarUrl}
                alt={username}
                className="w-full h-auto aspect-square rounded-xl object-cover shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#0b0f1a] border border-white/10 p-3 rounded-xl shadow-xl">
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
                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest shrink-0 ${
                  EXPERIENCE_COLORS[profile.experienceLevel as keyof typeof EXPERIENCE_COLORS]
                }`}
              >
                {profile.experienceLevel}
              </span>
            </div>
            
            <p className="text-sm md:text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed italic border-l-2 border-[#00D9F5]/30 pl-4 mx-auto lg:mx-0 break-words">
              &ldquo;{profile.user.bio || "This identity has not yet broadcasted a biography to the network."}&rdquo;
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-x-6 lg:gap-x-10 gap-y-4 mb-10 text-[10px] sm:text-xs text-slate-500 tracking-wider font-bold uppercase w-full">
              {profile.user.location && (
                <div className="flex items-center gap-2 max-w-full">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-[#00F5A0] shrink-0" />
                  <span className="truncate max-w-full">{profile.user.location}</span>
                </div>
              )}
              {profile.user.company && (
                <div className="flex items-center gap-2 max-w-full">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-[#00D9F5] shrink-0" />
                  <span className="truncate max-w-full">{profile.user.company}</span>
                </div>
              )}
              {profile.user.websiteUrl && (
                <a href={profile.user.websiteUrl.startsWith('http') ? profile.user.websiteUrl : `https://${profile.user.websiteUrl}`} 
                   target="_blank" 
                   className="flex items-center gap-2 hover:text-white transition-colors group max-w-full">
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-[#7F5AF0] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate max-w-full">{profile.user.websiteUrl.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {profile.user.twitterUsername && (
                <a href={`https://twitter.com/${profile.user.twitterUsername}`} 
                   target="_blank" 
                   className="flex items-center gap-2 hover:text-[#00D9F5] transition-colors group max-w-full">
                  <Twitter className="h-3 w-3 sm:h-4 sm:w-4 text-[#00D9F5] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate max-w-full">@{profile.user.twitterUsername}</span>
                </a>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 lg:gap-12 text-[10px] tracking-widest uppercase font-bold text-slate-500 w-full">
              <span className="flex items-center gap-3">
                <span className="text-white text-xl md:text-2xl font-mono">{profile.user.followers}</span>
                <span className="text-[9px] md:text-[10px]">Network<br/>Units</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-white text-xl md:text-2xl font-mono">{profile.contributionCount}</span>
                <span className="text-[9px] md:text-[10px]">Impact<br/>Events</span>
              </span>
              <div className="h-8 w-px bg-white/10 hidden lg:block" />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={copyToClipboard}
                  className="hover:text-[#00F5A0] transition-colors border-b border-white/5 pb-1 hover:border-[#00F5A0] text-[10px]"
                >
                  Capture Identity
                </button>
                <button
                  onClick={handleRefresh}
                  className="hover:text-[#7F5AF0] transition-colors border-b border-white/5 pb-1 hover:border-[#7F5AF0] text-[10px]"
                >
                  Recalibrate
                </button>
              </div>
            </div>
          </div>

          <div className="lg:text-right flex flex-col items-center lg:items-end lg:min-w-[250px] bg-[#121826]/50 p-6 md:p-8 rounded-2xl border border-white/5 w-full lg:w-auto shrink-0 mt-8 lg:mt-0">
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-4">Aggregate Impact</div>
            <div className="text-5xl md:text-6xl lg:text-7xl font-black text-[#00F5A0] leading-none mb-6 tabular-nums truncate max-w-full">
              {profile.totalScore.toFixed(1)}
            </div>
            {rankData && (
              <div className="bg-[#0b0f1a] text-[#00F5A0] px-4 py-1.5 rounded-md text-[10px] tracking-widest uppercase font-bold mb-8 md:mb-12 border border-[#00F5A0]/20">
                Protocol Rank #{rankData.rank}
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
          {/* Contribution Matrix */}
          <div className="xl:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between px-2 gap-4">
              <h2 className="dev-heading text-2xl md:text-3xl">Impact Nodes</h2>
              <span className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">Latest 50 Sub-networks</span>
            </div>
            
            <div className="dev-surface overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs md:text-sm whitespace-nowrap min-w-[600px]">
                  <thead>
                    <tr className="bg-[#0b0f1a]/50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
                      <th className="px-6 md:px-8 py-6 max-w-[200px]">Node Path</th>
                      <th className="px-6 py-6 w-32">Magnitude</th>
                      <th className="px-6 md:px-8 py-6 text-right w-24">Impact Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {profile.topRepositories.map((repo) => (
                      <tr key={repo.name} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 md:px-8 py-6 max-w-[200px] md:max-w-[300px] truncate">
                          <Link
                             href={`https://github.com/${repo.ownerLogin || username}/${repo.name}`}
                             target="_blank"
                             className="text-white text-sm md:text-base font-bold group-hover:text-[#00F5A0] transition-colors tracking-tight block truncate"
                          >
                             {repo.name}
                          </Link>
                          <div className="flex items-center gap-2 md:gap-3 mt-2 truncate">
                            <span className="text-[9px] md:text-[10px] text-slate-500 font-bold tracking-widest uppercase truncate max-w-[100px]">
                              {repo.language || 'POLYLANG'}
                            </span>
                            <div className="w-1 h-1 bg-white/20 rounded-full shrink-0" />
                            <span className="text-[9px] md:text-[10px] text-[#00D9F5] font-bold tracking-widest uppercase shrink-0">
                              {repo.userPRs} / {repo.totalPRs} EVT
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col gap-2">
                            <span className="text-slate-400 font-mono text-xs">
                              {formatStars(repo.stars)} <span className="text-[9px] opacity-50 ml-1">MAG</span>
                            </span>
                            <div className="w-24 md:w-32 h-1 bg-[#0b0f1a] rounded-full overflow-hidden border border-white/5">
                               <div 
                                 className="h-full bg-[#00F5A0] transition-all duration-1000"
                                 style={{ width: `${Math.min((repo.userPRs / repo.totalPRs) * 100, 100)}%` }}
                               />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-6 text-right">
                          <span className="text-[#00F5A0] font-mono font-bold text-lg md:text-xl">
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

          {/* Linguistic Bias */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 w-full overflow-hidden">
            <div className="px-2">
              <h2 className="dev-heading text-2xl md:text-3xl">Linguistic Bias</h2>
            </div>
            
            <div className="dev-surface p-6 md:p-8 h-[500px] md:h-[600px] flex flex-col group w-full overflow-hidden">
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={chartData} margin={{ left: -20, right: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
                      width={90}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.02)" }}
                      contentStyle={{
                        backgroundColor: "#0b0f1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        textTransform: "uppercase",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 pt-8 border-t border-white/5 overflow-hidden">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-500 group-hover:text-[#00F5A0] transition-colors truncate">
                   Dominant Signal Patterns
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.uniqueSkills.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2 py-1 rounded bg-[#0b0f1a] border border-white/5 text-[9px] font-bold uppercase tracking-widest text-slate-400 truncate max-w-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol breakdown */}
        <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600 w-full">
          <div className="dev-surface overflow-hidden w-full">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full px-6 md:px-10 py-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0b0f1a] border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-[#00F5A0] font-bold text-xs">01</span>
                </div>
                <span className="dev-heading text-lg md:text-2xl text-left truncate">Score Logic Calibration</span>
              </div>
              <span className="text-slate-500 text-2xl md:text-3xl font-light pl-4 shrink-0">{showExplanation ? "−" : "+"}</span>
            </button>
            
            {showExplanation && (
              <div className="px-6 md:px-10 pb-12 animate-in slide-in-from-top-4 duration-300 w-full overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 pt-8 border-t border-white/5 w-full">
                  <div className="space-y-8 min-w-0">
                    <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#00F5A0] truncate">Mathematical Foundation</h4>
                    <div className="bg-[#0b0f1a] p-4 md:p-6 rounded-xl border border-white/10 text-[10px] sm:text-xs md:text-sm font-mono text-white/90 leading-relaxed shadow-inner overflow-x-auto text-nowrap whitespace-nowrap">
                      score = stars × (identity_evt / network_total)
                    </div>
                    <ul className="space-y-6">
                      {[
                        "Nodes with < 10 star magnitude are excluded from the protocol.",
                        "Per-node impact weight is capped at 10,000 units to prevent network distortion.",
                        "Analysis encompasses the most active 50 signal emitters in the network."
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4 items-start min-w-0">
                          <span className="text-[#00F5A0] font-mono font-bold text-[10px] pt-1 shrink-0">0{i+1}</span>
                          <p className="text-[10px] md:text-xs text-slate-400 tracking-wider leading-relaxed uppercase font-bold break-words">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-8 min-w-0">
                    <h4 className="text-[10px] tracking-widest uppercase font-bold text-[#7F5AF0] truncate">Live Sample Data</h4>
                    {topRepo ? (
                      <div className="bg-[#0b0f1a] border border-white/10 p-6 md:p-8 rounded-xl space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest shrink-0">Node ID</span>
                          <span className="text-white font-bold text-sm truncate max-w-full">{topRepo.name}</span>
                        </div>
                        <div className="h-px bg-white/5 w-full" />
                        <div className="grid grid-cols-2 gap-6 md:gap-8">
                          <div className="space-y-2 min-w-0">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">Magnitude</p>
                            <p className="text-lg md:text-xl text-white font-mono truncate">{topRepo.stars}</p>
                          </div>
                          <div className="space-y-2 min-w-0">
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">Weight</p>
                            <p className="text-lg md:text-xl text-[#00F5A0] font-mono truncate">{topRepo.score.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#0b0f1a] border border-white/10 p-6 rounded-xl flex items-center justify-center min-h-[150px]">
                         <span className="text-xs font-bold uppercase tracking-widest text-slate-500">No qualifying samples</span>
                      </div>
                    )}
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold italic truncate">
                      * Real-time calibration based on latest GraphQL harvest.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mt-24 md:mt-32 text-center w-full">
          <Link href="/" className="inline-flex items-center gap-3 text-[10px] tracking-widest uppercase font-bold text-slate-500 hover:text-white transition-colors border-b border-white/10 pb-2 hover:border-[#00D9F5] max-w-full">
            &larr; <span className="truncate">Return to Global Search</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
