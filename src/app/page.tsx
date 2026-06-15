"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import Link from "next/link";
import { ArrowRight, BarChart2, Activity, Shield, Database, Code2 } from "lucide-react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && !isPending) {
      setIsPending(true);
      router.push(`/user/${username.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-zinc-400 selection:bg-indigo-500/30">
      
      <section className="container mx-auto px-6 pt-32 pb-24 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full mb-8 text-sm font-medium">
            <Code2 className="w-4 h-4" />
            Open source analytics
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05] text-balance">
            Quantify your open source impact
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 mb-12 max-w-2xl leading-relaxed">
            GitPullTalent transforms raw GitHub activity into meaningful metrics, helping you understand the real weight of your engineering contributions.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mb-12">
            <div className="dev-surface flex items-center p-1.5 focus-within:border-indigo-500/30 transition-colors rounded-2xl">
              <input
                type="text"
                placeholder="Enter a GitHub username..."
                className="w-full bg-transparent border-none py-3.5 px-5 text-white text-base placeholder:text-zinc-600 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={isPending}
                className="bg-indigo-500 text-white font-semibold h-11 px-7 rounded-xl shrink-0 flex items-center justify-center min-w-[130px] hover:bg-indigo-400 transition-colors active:scale-[0.98] disabled:opacity-50 text-sm"
              >
                {isPending ? (
                   <span>Analyzing...</span>
                ) : (
                  <span className="flex items-center gap-2">
                     Analyze <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {(session?.user?.login || session?.user?.name) && (
            <div className="flex items-center gap-4 animate-in fade-in duration-500">
               <span className="text-xs text-zinc-600">Signed in as</span>
               <Link
                href={`/user/${(session.user.login || session.user.name!).toLowerCase()}`}
                className="flex items-center gap-3 bg-[#141418] hover:bg-[#1c1c22] border border-white/[0.06] py-2 px-4 rounded-xl transition-all"
               >
                  <img
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-zinc-200 font-medium">{(session.user.login || session.user.name!)}</span>
               </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24 border-t border-white/[0.04]">
        <div className="mb-16">
           <h2 className="dev-heading text-3xl mb-3">How it works</h2>
           <p className="text-zinc-500 text-sm">Real insights from real contribution data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dev-card p-8 flex flex-col">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <BarChart2 className="w-5 h-5 text-indigo-400" />
             </div>
             <h3 className="text-lg font-semibold text-white mb-3">Impact weighting</h3>
             <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow">
               Raw commit counts are superficial. We analyze the trajectory of repositories you contribute to, weighing your specific merge ratio against project popularity.
             </p>
             <div className="bg-[#0c0c0f] border border-white/[0.04] p-4 rounded-xl font-mono text-xs text-zinc-600">
                <span className="text-emerald-400">score</span> = min(stars × (userPRs / totalPRs), 10000)
             </div>
          </div>

          <div className="dev-card p-8 flex flex-col">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Activity className="w-5 h-5 text-emerald-400" />
             </div>
             <h3 className="text-lg font-semibold text-white mb-3">Language distribution</h3>
             <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow">
               Understand your proficiency across different technology stacks. The system tracks the primary languages of repositories you contribute to.
             </p>
             <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                   <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: '60%' }}></div>
                   </div>
                   <span className="text-xs text-zinc-500 w-8 font-medium">TS</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '30%' }}></div>
                   </div>
                   <span className="text-xs text-zinc-500 w-8 font-medium">Rust</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-full bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '10%' }}></div>
                   </div>
                   <span className="text-xs text-zinc-500 w-8 font-medium">Py</span>
                </div>
             </div>
          </div>

          <div className="dev-card p-8 flex flex-col md:row-span-2">
             <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                <Database className="w-5 h-5 text-violet-400" />
             </div>
             <h3 className="text-lg font-semibold text-white mb-3">Infrastructure</h3>
             <p className="text-zinc-500 text-sm leading-relaxed mb-8">
               Built for scale and reliability. A tiered pipeline caches evaluations, backed by scalable relational databases.
             </p>
             <div className="space-y-4">
               {[
                 { label: "GraphQL API", val: "Up to 15k req/hr" },
                 { label: "Cache layer", val: "Redis · 6h TTL" },
                 { label: "Storage", val: "Neon Postgres" },
                 { label: "Authentication", val: "NextAuth v5" }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.04] last:border-0">
                   <span className="text-sm text-zinc-500">{item.label}</span>
                   <span className="text-xs font-mono text-emerald-400">{item.val}</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="dev-card p-8 md:col-span-2 flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-semibold text-white mb-2">Global leaderboard</h3>
                 <p className="text-zinc-500 text-sm">See how you stack up against other developers worldwide.</p>
              </div>
              <Link href="/leaderboard" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] transition-colors rounded-xl border border-white/[0.06] text-sm text-white font-medium">
                 View rankings <Activity className="w-4 h-4" />
              </Link>
          </div>
        </div>
      </section>

      {/* Leaderboard Teaser */}
      <section className="container mx-auto px-6 py-24 border-t border-white/[0.04]">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/[0.04] pb-6">
            <div>
               <h2 className="dev-heading text-3xl mb-2">Top contributors</h2>
               <p className="text-zinc-500 text-sm max-w-lg">Ranked by aggregate score across all repositories.</p>
            </div>
            <Link href="/leaderboard" className="mt-6 md:mt-0 text-indigo-400 hover:text-indigo-300 transition-colors text-sm flex items-center gap-2 font-medium">
               View full leaderboard →
            </Link>
         </div>

         <div className="dev-surface overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead>
                   <tr className="bg-[#0c0c0f] border-b border-white/[0.04]">
                     <th className="px-6 py-4 font-medium text-xs text-zinc-500">Rank</th>
                     <th className="px-6 py-4 font-medium text-xs text-zinc-500">Developer</th>
                     <th className="px-6 py-4 font-medium text-xs text-zinc-500 text-right">Score</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.04]">
                   {leaderboardLoading ? (
                     [...Array(5)].map((_, i) => (
                       <tr key={i} className="animate-pulse bg-[#141418]/30">
                         <td className="px-6 py-4"><div className="w-4 h-4 bg-white/[0.04] rounded" /></td>
                         <td className="px-6 py-4"><div className="w-32 h-4 bg-white/[0.04] rounded" /></td>
                         <td className="px-6 py-4"><div className="w-20 h-4 bg-white/[0.04] ml-auto rounded" /></td>
                       </tr>
                     ))
                   ) : (
                     leaderboard?.data?.slice(0, 5).map((entry, idx) => (
                       <tr key={entry.username} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-6 py-5 text-zinc-600 group-hover:text-zinc-400 transition-colors font-mono text-xs">
                            {String(idx + 1).padStart(2, '0')}
                         </td>
                         <td className="px-6 py-5">
                           <Link href={`/user/${entry.username}`} className="flex items-center gap-4">
                             <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-lg border border-white/[0.06] grayscale group-hover:grayscale-0 transition-all" />
                             <span className="text-zinc-300 group-hover:text-indigo-400 transition-colors font-medium">{entry.username}</span>
                           </Link>
                         </td>
                         <td className="px-6 py-5 text-right text-white font-mono font-semibold">
                           {entry.totalScore.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/[0.04]">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12">
            <div className="flex items-center gap-2 text-zinc-600 text-xs">
               <Shield className="w-4 h-4 text-violet-400" /> Built with care
            </div>
            
            <div className="text-white font-bold text-xl tracking-tight">
               Git<span className="text-indigo-400">PullTalent</span>
            </div>

            <div className="text-zinc-600 text-xs">
               © 2026
            </div>
         </div>
      </footer>
    </div>
  );
}
