"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import Link from "next/link";
import { ArrowRight, Terminal, BarChart2, Activity, Shield, Users, Database } from "lucide-react";

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
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 layout-grid selection:bg-[#00D9F5]/30">
      
      {/* Top Protocol Status Bar */}
      <div className="w-full border-b border-white/5 bg-[#121826]/50 backdrop-blur-md sticky top-0 z-40 hidden md:block">
        <div className="container mx-auto px-6 h-10 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F5A0]"></span>
              Core System Active
            </span>
            <span>Version: 2.1.0</span>
            <span>Uptime: 99.99%</span>
          </div>
          <div className="flex items-center gap-6 mt-8 md:mt-0 text-slate-500 text-xs font-bold uppercase tracking-widest">
             <Link href="https://github.com/chemicoholic21/Git-Pull-Talent" className="hover:text-white transition-colors">GitHub</Link>
             <Link href="/leaderboard" className="hover:text-white transition-colors">Global Index</Link>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-6 pt-32 pb-24 border-x border-white/5 border-dashed min-h-[calc(100vh-2.5rem)] flex flex-col justify-center">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-[#121826] px-3 py-1.5 rounded-full mb-8">
             <Terminal className="w-4 h-4 text-[#00F5A0]" />
             <span className="text-xs font-mono text-slate-400">gitpulltalent init --analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Quantify Open Source Impact
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-light">
            GitPullTalent transforms raw GitHub activity into precise mathematical metrics, offering a comprehensive assessment of engineering contribution quality.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mb-12">
            <div className="dev-surface flex items-center p-2 focus-within:border-white/20 transition-colors">
              <div className="pl-4 text-slate-500 font-mono text-sm shrink-0">~/$ search --user</div>
              <input
                type="text"
                placeholder="github_username"
                className="w-full bg-transparent border-none py-3 px-4 text-white text-lg font-mono placeholder:text-slate-600 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#00D9F5] text-[#0b0f1a] font-bold h-12 px-8 rounded-xl shrink-0 flex items-center justify-center min-w-[140px] hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? (
                   <span className="font-mono text-sm uppercase">Executing...</span>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider">
                     Analyze <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {(session?.user?.login || session?.user?.name) && (
            <div className="flex items-center gap-4 animate-in fade-in duration-500">
               <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Authenticated as</span>
               <Link
                href={`/user/${(session.user.login || session.user.name!).toLowerCase()}`}
                className="flex items-center gap-3 bg-[#121826] hover:bg-[#1a2236] border border-white/5 py-2 px-4 rounded-xl transition-all"
               >
                  <img
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-mono text-sm text-slate-200">{(session.user.login || session.user.name!)}</span>
               </Link>
            </div>
          )}
        </div>
      </section>

      {/* Grid Dashboard Layout Section */}
      <section className="container mx-auto px-6 py-24 border-x border-t border-white/5 border-dashed">
        <div className="mb-16">
           <h2 className="dev-heading text-3xl mb-4">Architecture & Metrics</h2>
           <p className="text-slate-400 font-mono text-sm">Real-time insight protocol structure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="dev-card p-8 flex flex-col">
             <div className="w-10 h-10 rounded-lg bg-[#1a2236] border border-white/10 flex items-center justify-center mb-6">
                <BarChart2 className="w-5 h-5 text-[#00D9F5]" />
             </div>
             <h3 className="text-lg font-bold text-white mb-3 tracking-tight">Impact Weighting</h3>
             <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
               Raw commit counts are superficial. We analyze the trajectory of repositories you contribute to, evaluating repository popularity against your specific merge ratio.
             </p>
             <div className="bg-[#0b0f1a] border border-white/5 p-4 rounded-xl font-mono text-[10px] text-slate-500">
                <span className="text-[#00F5A0]">score</span> = Math.min(stars * (userPRs / totalPRs), 10000)
             </div>
          </div>

          {/* Card 2 */}
          <div className="dev-card p-8 flex flex-col">
             <div className="w-10 h-10 rounded-lg bg-[#1a2236] border border-white/10 flex items-center justify-center mb-6">
                <Activity className="w-5 h-5 text-[#00D9F5]" />
             </div>
             <h3 className="text-lg font-bold text-white mb-3 tracking-tight">Language Distribution</h3>
             <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
               Analyze proficiency across diverse technology stacks. The system tracks the primary languages of integrated project environments.
             </p>
             <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <div className="w-full bg-[#1a2236] h-1.5 rounded-full overflow-hidden">
                       <div className="bg-[#00D9F5] h-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs font-mono text-slate-500 w-8">TS</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-full bg-[#1a2236] h-1.5 rounded-full overflow-hidden">
                       <div className="bg-[#00F5A0] h-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-xs font-mono text-slate-500 w-8">rs</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-full bg-[#1a2236] h-1.5 rounded-full overflow-hidden">
                       <div className="bg-[#7F5AF0] h-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-xs font-mono text-slate-500 w-8">py</span>
                 </div>
             </div>
          </div>

          {/* Card 3 */}
          <div className="dev-card p-8 flex flex-col md:row-span-2">
             <div className="w-10 h-10 rounded-lg bg-[#1a2236] border border-white/10 flex items-center justify-center mb-6">
                <Database className="w-5 h-5 text-[#00D9F5]" />
             </div>
             <h3 className="text-lg font-bold text-white mb-3 tracking-tight">System Infrastructure</h3>
             <p className="text-slate-400 text-sm leading-relaxed mb-8">
               Built for absolute scale and determinism. A tiered pipeline caches initial evaluations, backed by scalable relational databases.
             </p>
             <div className="space-y-4">
               {[
                 { label: "GraphQL Relay", val: "Up to 15k req/hr" },
                 { label: "Data Cache", val: "Redis L1 • 6h TTL" },
                 { label: "Storage", val: "Neon Postgres L2" },
                 { label: "Edge Auth", val: "NextAuth v5 Protocol" }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                   <span className="text-sm text-slate-400">{item.label}</span>
                   <span className="text-xs font-mono text-[#00F5A0]">{item.val}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Card 4 - Spans 2 columns */}
          <div className="dev-card p-8 md:col-span-2 flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Global Leaderboard View</h3>
                 <p className="text-slate-400 text-sm">Compare technical footprint securely against peer developers.</p>
              </div>
              <Link href="/leaderboard" className="hidden sm:flex items-center gap-2 px-6 py-3 bg-[#1a2236] hover:bg-white/10 transition-colors rounded-xl border border-white/5 text-sm font-mono text-white">
                 Query Data <Activity className="w-4 h-4" />
              </Link>
          </div>
        </div>
      </section>

      {/* Structured Leaderboard Teaser */}
      <section className="container mx-auto px-6 py-24 border-x border-t border-white/5 border-dashed">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-6">
            <div>
               <h2 className="dev-heading text-3xl mb-2">Vanguard Identity Matrix</h2>
               <p className="text-slate-400 font-mono text-sm max-w-lg">Ranked dynamically by mathematical score coefficient across aggregate repositories.</p>
            </div>
            <Link href="/leaderboard" className="mt-6 md:mt-0 text-[#00D9F5] hover:text-white transition-colors font-mono text-sm flex items-center gap-2">
               [View Full Array]
            </Link>
         </div>

         <div className="dev-surface overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left font-mono text-sm">
                 <thead>
                   <tr className="bg-[#0b0f1a] border-b border-white/5 text-slate-500">
                     <th className="px-6 py-4 font-normal uppercase tracking-wider">Rank</th>
                     <th className="px-6 py-4 font-normal uppercase tracking-wider">Identity</th>
                     <th className="px-6 py-4 font-normal text-right uppercase tracking-wider">Computed Coefficient</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {leaderboardLoading ? (
                     [...Array(5)].map((_, i) => (
                       <tr key={i} className="animate-pulse bg-[#121826]/30">
                         <td className="px-6 py-4"><div className="w-4 h-4 bg-white/5 rounded" /></td>
                         <td className="px-6 py-4"><div className="w-32 h-4 bg-white/5 rounded" /></td>
                         <td className="px-6 py-4"><div className="w-20 h-4 bg-white/5 ml-auto rounded" /></td>
                       </tr>
                     ))
                   ) : (
                     leaderboard?.data?.slice(0, 5).map((entry, idx) => (
                       <tr key={entry.username} className="hover:bg-white/5 transition-colors group">
                         <td className="px-6 py-5 text-slate-500 group-hover:text-white transition-colors">
                            {String(idx + 1).padStart(2, '0')}
                         </td>
                         <td className="px-6 py-5">
                           <Link href={`/user/${entry.username}`} className="flex items-center gap-4">
                             <img src={entry.avatarUrl} alt="" className="w-8 h-8 rounded-lg border border-white/10 grayscale group-hover:grayscale-0 transition-all" />
                             <span className="text-slate-300 group-hover:text-[#00D9F5] transition-colors">{entry.username}</span>
                           </Link>
                         </td>
                         <td className="px-6 py-5 text-right text-white">
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

      {/* Footer Grid */}
      <footer className="container mx-auto px-6 py-12 border-x border-t border-white/5 border-dashed">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-12">
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
               <Shield className="w-4 h-4 text-[#7F5AF0]" /> Internal Build
            </div>
            
            <div className="text-white font-bold text-xl tracking-tight">
               GIT<span className="text-[#00F5A0]">PULLTALENT</span>
            </div>

            <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">
               2026 Protocol
            </div>
         </div>
      </footer>
    </div>
  );
}
