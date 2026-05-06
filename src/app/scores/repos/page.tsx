"use client";

import { useState, useEffect } from "react";
import { useRepoScores, RepoScoreEntry } from "@/hooks/useRepoScores";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Filter,
  Github,
  GitPullRequest,
  Star,
  Info,
  Calculator,
  Code2,
  Timer,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RepoScoresPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [repoSearch, setRepoSearch] = useState("");
  const [debouncedRepoSearch, setDebouncedRepoSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [debouncedLanguage, setDebouncedLanguage] = useState("");
  const [minScore, setMinScore] = useState<number | undefined>();
  const [maxScore, setMaxScore] = useState<number | undefined>();
  const [minPrs, setMinPrs] = useState<number | undefined>();
  const [minStars, setMinStars] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState("repoScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(20);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRepoSearch(repoSearch);
      setPageIndex(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [repoSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLanguage(language);
      setPageIndex(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [language]);

  const { data, isLoading } = useRepoScores(
    pageSize,
    pageIndex + 1,
    debouncedSearch,
    debouncedRepoSearch,
    debouncedLanguage,
    minScore,
    maxScore,
    minPrs,
    undefined,
    minStars,
    undefined,
    sortBy,
    sortOrder
  );

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPageIndex(0);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
    return sortOrder === "desc" ? (
      <ChevronDown className="ml-2 h-3 w-3 text-[#00F5A0]" />
    ) : (
      <ChevronRight className="ml-2 h-3 w-3 text-[#00F5A0] rotate-90" />
    );
  };

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getLanguageColor = (lang: string | null) => {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f7df1e",
      Python: "#3572A5",
      Go: "#00ADD8",
      Rust: "#dea584",
      Java: "#b07219",
      Ruby: "#701516",
      PHP: "#4F5D95",
      "C++": "#f34b7d",
      C: "#555555",
      Swift: "#F05138",
      Kotlin: "#A97BFF",
    };
    return colors[lang || ""] || "#6e7681";
  };

  return (
    <div className="min-h-screen layout-grid border-x border-white/5 border-dashed">
      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#7F5AF0]/10">
              <Timer className="h-6 w-6 text-[#7F5AF0]" />
            </div>
            <h1 className="dev-heading text-4xl md:text-5xl">Repo Scores</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            PR TTM-based repository scoring - rewarding repos with faster merge times and higher contribution volumes.
          </p>
        </div>

        <div className="dev-surface p-4 md:p-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center mb-8">
            <div className="w-full lg:flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="USER..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0b0f1a] border border-white/10 pl-11 h-12 rounded-xl focus:border-[#00D9F5]/50 transition-colors text-xs font-bold tracking-wider uppercase text-white placeholder-slate-600"
                />
              </div>

              <div className="relative group">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="REPO..."
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full bg-[#0b0f1a] border border-white/10 pl-11 h-12 rounded-xl focus:border-[#00D9F5]/50 transition-colors text-xs font-bold tracking-wider uppercase text-white placeholder-slate-600"
                />
              </div>

              <div className="relative group">
                <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="LANGUAGE..."
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0b0f1a] border border-white/10 pl-11 h-12 rounded-xl focus:border-[#00D9F5]/50 transition-colors text-xs font-bold tracking-wider uppercase text-white placeholder-slate-600"
                />
              </div>

              <div className="relative group">
                <Star className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="MIN_STARS..."
                  type="number"
                  value={minStars ?? ""}
                  onChange={(e) => setMinStars(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full bg-[#0b0f1a] border border-white/10 pl-11 h-12 rounded-xl focus:border-[#00D9F5]/50 transition-colors text-xs font-bold tracking-wider uppercase text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none h-12 bg-[#0b0f1a] border border-white/10 rounded-xl text-slate-400 hover:text-white min-w-[160px] justify-between px-6 text-xs font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-500" />
                      {sortBy === "repoScore"
                        ? "SCORE"
                        : sortBy === "totalPrs"
                        ? "TOTAL_PRS"
                        : sortBy === "userPrs"
                        ? "USER_PRS"
                        : "STARS"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#121826] border border-white/10 text-slate-300 min-w-[200px] rounded-xl p-2 shadow-2xl">
                  {[
                    { value: "repoScore", label: "Repo Score" },
                    { value: "totalPrs", label: "Total PRs" },
                    { value: "userPrs", label: "User PRs" },
                    { value: "stars", label: "Stars" },
                  ].map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className="hover:bg-white/5 cursor-pointer text-xs font-bold uppercase tracking-wider p-3 rounded-lg mb-1"
                      onClick={() => {
                        setSortBy(option.value);
                        setPageIndex(0);
                      }}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <div className="relative min-w-[900px]">
              {isLoading && (
                <div className="absolute inset-0 bg-[#0b0f1a]/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-[#00D9F5]/20 border-t-[#00D9F5] rounded-full animate-spin" />
                </div>
              )}
              <Table>
                <TableHeader className="bg-transparent border-b border-white/5">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="py-4 px-6 text-[10px] uppercase tracking-wider text-slate-400">
                      Rank
                    </TableHead>
                    <TableHead className="py-4 px-6 text-[10px] uppercase tracking-wider text-slate-400">
                      Repository
                    </TableHead>
                    <TableHead className="py-4 px-6 text-[10px] uppercase tracking-wider text-slate-400">
                      Contributor
                    </TableHead>
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("repoScore")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        Score
                        {getSortIcon("repoScore")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("userPrs")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        User PRs
                        {getSortIcon("userPrs")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("totalPrs")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        Total PRs
                        {getSortIcon("totalPrs")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("stars")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        Stars
                        {getSortIcon("stars")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.length ? (
                    data.data.map((entry) => (
                      <>
                        <TableRow
                          key={entry.id}
                          className={cn(
                            "border-white/5 transition-colors cursor-pointer group h-20",
                            expanded[entry.id] ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                          )}
                          onClick={() => toggleExpanded(entry.id)}
                        >
                          <TableCell className="px-6 py-4">
                            <div className="font-medium text-slate-500">#{entry.rank}</div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm truncate max-w-[200px]">
                                {entry.repoName}
                              </span>
                              {entry.primaryLanguage && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <div
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(entry.primaryLanguage) }}
                                  />
                                  <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                                    {entry.primaryLanguage}
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border border-white/10 rounded-lg">
                                <AvatarImage src={entry.avatarUrl || ""} alt={entry.username} className="rounded-lg object-cover" />
                                <AvatarFallback className="rounded-lg bg-[#1a2236] text-slate-300 text-xs">
                                  {entry.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-slate-400">@{entry.username}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="font-bold text-[#7F5AF0] text-lg">
                              {(entry.repoScore || 0).toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                              <GitPullRequest className="h-3.5 w-3.5" />
                              {entry.userPrs}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="text-slate-400 text-sm">{entry.totalPrs}</div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                              <Star className="h-3.5 w-3.5 text-yellow-500" />
                              {entry.stars.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/5 text-slate-500">
                              {expanded[entry.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expanded[entry.id] && (
                          <TableRow className="bg-[#0b0f1a] border-white/5 hover:bg-transparent">
                            <TableCell colSpan={8} className="p-0 border-b border-white/5">
                              <div className="p-6 md:p-10 animate-in fade-in slide-in-from-top-2 duration-300">
                                {entry.description && (
                                  <p className="text-sm text-slate-400 leading-relaxed mb-6 border-l-2 border-[#7F5AF0]/30 pl-4">
                                    {entry.description}
                                  </p>
                                )}

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                  <div className="p-4 bg-[#121826] rounded-xl border border-white/5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Repo Score</p>
                                    <p className="text-2xl font-bold text-[#7F5AF0]">{(entry.repoScore || 0).toFixed(2)}</p>
                                  </div>
                                  <div className="p-4 bg-[#121826] rounded-xl border border-white/5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">User PRs</p>
                                    <p className="text-2xl font-bold text-[#00D9F5]">{entry.userPrs}</p>
                                  </div>
                                  <div className="p-4 bg-[#121826] rounded-xl border border-white/5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Total PRs</p>
                                    <p className="text-2xl font-bold text-[#00F5A0]">{entry.totalPrs}</p>
                                  </div>
                                </div>

                                {/* Score Calculation Explanation */}
                                <div className="mb-6 p-5 bg-[#121826] rounded-xl border border-white/5">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Calculator className="h-4 w-4 text-[#7F5AF0]" />
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">How This Score Was Calculated</p>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="text-sm text-slate-300 font-mono bg-[#0b0f1a] p-4 rounded-lg border border-white/5">
                                      <p className="text-[#7F5AF0] mb-2">Repo Score = PR Factor × TTM Factor × Scale</p>
                                      <div className="text-slate-500 space-y-1 text-xs">
                                        <p>• <span className="text-[#00F5A0]">PR Factor</span> = log₁₀(Total PRs + 1) = log₁₀({entry.totalPrs} + 1) = <span className="text-white">{Math.log10(entry.totalPrs + 1).toFixed(3)}</span></p>
                                        <p>• <span className="text-[#00D9F5]">TTM Factor</span> = 72 / (Median TTM + 72)</p>
                                        <p className="pl-4 text-slate-600">→ Faster merge times = higher factor (max 1.0 at 0 hours)</p>
                                        <p className="pl-4 text-slate-600">→ 72 hours (3 days) TTM = 0.5 factor</p>
                                        <p className="pl-4 text-slate-600">→ 168 hours (7 days) TTM = 0.3 factor</p>
                                        <p>• <span className="text-[#F59E0B]">Scale</span> = 10</p>
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2 text-xs text-slate-500">
                                      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-600" />
                                      <p>
                                        The score rewards repositories with <span className="text-[#00F5A0]">high PR activity</span> and
                                        <span className="text-[#00D9F5]"> fast merge times</span>. Repos where PRs get reviewed and merged quickly
                                        score higher than those with long review cycles. The TTM (Time To Merge) is calculated as the median
                                        time between PR creation and merge for all merged PRs in the repository.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {entry.topics && entry.topics.length > 0 && (
                                  <div className="mb-6">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Topics</p>
                                    <div className="flex flex-wrap gap-2">
                                      {entry.topics.slice(0, 10).map((topic) => (
                                        <Badge
                                          key={topic}
                                          variant="outline"
                                          className="px-2.5 py-1 bg-[#1a2236] border-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                          {topic}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                  <a
                                    href={`https://github.com/${entry.repoName}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button className="bg-[#7F5AF0] text-white hover:bg-[#7F5AF0]/90 h-10 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                                      <Github className="h-4 w-4" />
                                      VIEW_REPO
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </a>
                                  <a
                                    href={`https://github.com/${entry.repoName}/pulls?q=is%3Apr+author%3A${entry.username}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button
                                      variant="outline"
                                      className="h-10 border-[#00D9F5]/30 bg-[#00D9F5]/10 text-[#00D9F5] hover:bg-[#00D9F5]/20 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center gap-2"
                                    >
                                      <GitPullRequest className="h-4 w-4" />
                                      VIEW_USER_PRS ({entry.userPrs})
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </a>
                                  <a
                                    href={`https://github.com/${entry.repoName}/pulls?q=is%3Apr+is%3Amerged`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button
                                      variant="outline"
                                      className="h-10 border-[#00F5A0]/30 bg-[#00F5A0]/10 text-[#00F5A0] hover:bg-[#00F5A0]/20 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center gap-2"
                                    >
                                      <GitPullRequest className="h-4 w-4" />
                                      ALL_MERGED_PRS
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </a>
                                  <Link href={`/user/${entry.username}`} onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      variant="outline"
                                      className="h-10 border-white/10 bg-[#121826] text-white hover:bg-[#1a2236] rounded-lg font-bold uppercase tracking-wider text-xs"
                                    >
                                      VIEW_CONTRIBUTOR
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-slate-500 font-bold tracking-widest uppercase text-xs">
                        {isLoading ? "LOADING..." : "0_MATCHES_FOUND"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-2 mt-4">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              Showing <span className="text-white">{pageIndex * pageSize + 1}</span>-
              <span className="text-white">{Math.min((pageIndex + 1) * pageSize, data?.totalCount || 0)}</span> OF{" "}
              <span className="text-white">{data?.totalCount || 0}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="h-10 bg-[#121826] border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 transition-colors rounded-lg px-6 text-xs font-bold uppercase tracking-wider"
              >
                PREV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={(pageIndex + 1) * pageSize >= (data?.totalCount || 0)}
                className="h-10 bg-[#121826] border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 transition-colors rounded-lg px-6 text-xs font-bold uppercase tracking-wider"
              >
                NEXT
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-600 uppercase tracking-[0.3em] border-t border-white/5 pt-8">
          <div>Formula: log₁₀(Total PRs + 1) × (72 / (Median TTM + 72)) × Scale</div>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[#7F5AF0]" />
              TTM Half-life: 72 hours
            </span>
            <span className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[#00D9F5]" />
              Scale: 10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
