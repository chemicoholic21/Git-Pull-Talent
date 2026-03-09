"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import Link from "next/link";

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
      router.push(`/analyze/${username.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 font-sans selection:bg-green-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 border-b border-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              What does your GitHub <br />
              <span className="text-green-400">really say about you?</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Contribution importance scoring across every open source project
              you&apos;ve touched. Data-dense analytics for developers.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mb-8">
              <input
                type="text"
                placeholder="Enter a GitHub username"
                className="w-full bg-gray-900 border border-gray-800 rounded-md py-4 px-6 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all shadow-xl"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                type="submit"
                disabled={isPending}
                className="absolute right-2 top-2 bottom-2 bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-500 text-gray-950 font-bold px-6 rounded transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center min-w-[100px]"
              >
                {isPending ? (
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Analyze"
                )}
              </button>
            </form>

            {(session?.user?.login || session?.user?.name) && (
              <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <img
                  src={session.user.image || ""}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded border border-gray-800"
                />
                <Link
                  href={`/analyze/${(session.user.login || session.user.name!).toLowerCase()}`}
                  className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 border-b border-cyan-400/30 hover:border-cyan-400 pb-0.5"
                >
                  Analyze my profile &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 border-b border-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded flex items-center justify-center mx-auto mb-6 group-hover:border-green-500/50 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-3">Scanning Repos & PRs</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We crawl your entire contribution history, focusing on merged pull requests in qualifying projects.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded flex items-center justify-center mx-auto mb-6 group-hover:border-green-500/50 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-3">Scoring by Repo Impact</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Scores are weighted by project stars and your relative contribution volume. Outlier protection included.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded flex items-center justify-center mx-auto mb-6 group-hover:border-green-500/50 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white font-bold mb-3">Insight Visualization</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                See where you&apos;ve truly made a difference with clean, data-dense summaries and rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Stats Preview */}
      <section className="py-24 bg-gray-950/50 border-b border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">
            <div className="flex-1">
              <span className="text-green-500 font-mono text-xs tracking-widest uppercase mb-4 block font-bold">Terminal Preview</span>
              <h2 className="text-4xl font-bold text-white mb-6">Real-world analytics for real-world impact.</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                GitPulse doesn&apos;t just count commits. We calculate the mathematical importance of your work
                relative to the projects you contribute to.
              </p>
              <Link href="/leaderboard" className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-6 py-3 rounded-md font-medium transition-all">
                View Global Leaderboard
              </Link>
            </div>
            <div className="w-full md:w-[480px] grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-6 rounded-md border border-gray-800 shadow-xl">
                <p className="text-gray-500 text-xs uppercase mb-1 font-bold">Total Score</p>
                <p className="text-3xl font-mono text-white font-bold">1,422.8</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-md border border-gray-800 shadow-xl">
                <p className="text-gray-500 text-xs uppercase mb-1 font-bold">Experience</p>
                <p className="text-lg text-cyan-400 font-bold uppercase tracking-tight">Core Contributor</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-md border border-gray-800 shadow-xl col-span-2">
                <p className="text-gray-500 text-xs uppercase mb-1 font-bold">Top Project</p>
                <div className="flex justify-between items-end">
                  <p className="text-xl text-white font-bold">subsurface/subsurface</p>
                  <p className="text-green-400 font-mono text-sm">+842.1</p>
                </div>
              </div>
              <div className="bg-gray-900 p-6 rounded-md border border-gray-800 shadow-xl col-span-2">
                <p className="text-gray-500 text-xs uppercase mb-4 font-bold">Language Affinity</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 uppercase">TypeScript</span>
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded border border-yellow-500/20 uppercase">JavaScript</span>
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded border border-cyan-500/20 uppercase">Go</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Top Contributors</h2>
            <p className="text-gray-500">The most impactful open source leaders right now.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-md overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-950/50 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Developer</th>
                  <th className="px-6 py-4 text-right">Importance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leaderboardLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-4 bg-gray-800 rounded" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gray-800 rounded" />
                          <div className="h-4 w-24 bg-gray-800 rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right"><div className="h-4 w-12 bg-gray-800 ml-auto rounded" /></td>
                    </tr>
                  ))
                ) : (
                  leaderboard?.slice(0, 5).map((entry) => (
                    <tr key={entry.username} className="hover:bg-gray-800/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-gray-500 group-hover:text-green-400 transition-colors">#{entry.rank}</td>
                      <td className="px-6 py-4">
                        <Link href={`/analyze/${entry.username}`} className="flex items-center gap-3">
                          <img src={entry.avatarUrl} alt={entry.username} className="w-6 h-6 rounded border border-gray-700" />
                          <span className="text-white font-medium hover:text-green-400 transition-colors underline decoration-gray-800 underline-offset-4 decoration-1">
                            {entry.username}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-white font-bold">{entry.totalScore.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link href="/leaderboard" className="text-sm text-gray-500 hover:text-white transition-colors underline decoration-gray-800 underline-offset-4 decoration-1 hover:decoration-white">
              View full leaderboard &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-8 text-gray-500">
            <Link href="https://github.com" className="hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <p className="text-gray-600 text-xs uppercase tracking-widest font-bold">
            Built with <span className="text-white">Next.js</span> • <span className="text-white">Neon</span> • <span className="text-white">Upstash</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
