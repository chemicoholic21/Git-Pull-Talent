"use client";

import { useState, useEffect } from "react";
import { useEfficiencyScores, EfficiencyEntry } from "@/hooks/useEfficiencyScores";
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
  MapPin,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Filter,
  UserCheck,
  Mail,
  Linkedin,
  Twitter,
  Github,
  Zap,
  TrendingUp,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EfficiencyLeaderboardPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [minEfficiency, setMinEfficiency] = useState<number | undefined>();
  const [maxEfficiency, setMaxEfficiency] = useState<number | undefined>();
  const [minScore, setMinScore] = useState<number | undefined>();
  const [maxScore, setMaxScore] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState("contributorEfficiency");
  const [sortOrder, setSortOrder] = useState("desc");
  const [hireable, setHireable] = useState(false);
  const [hasLinkedIn, setHasLinkedIn] = useState(false);
  const [hasEmail, setHasEmail] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(20);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPageIndex(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
      setPageIndex(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);

  const { data, isLoading } = useEfficiencyScores(
    pageSize,
    pageIndex + 1,
    debouncedSearch,
    debouncedLocation,
    minEfficiency,
    maxEfficiency,
    minScore,
    maxScore,
    sortBy,
    sortOrder,
    hireable,
    hasLinkedIn,
    hasEmail
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

  const toggleExpanded = (username: string) => {
    setExpanded((prev) => ({ ...prev, [username]: !prev[username] }));
  };

  return (
    <div className="min-h-screen layout-grid border-x border-white/5 border-dashed">
      <div className="container mx-auto px-6 pt-32 pb-24">
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00F5A0]/10">
              <Zap className="h-6 w-6 text-[#00F5A0]" />
            </div>
            <h1 className="dev-heading text-4xl md:text-5xl">Contributor Efficiency</h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Ranking developers by their contributor efficiency score - measuring impact relative to contribution volume.
          </p>
        </div>

        <div className="dev-surface p-4 md:p-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center mb-8">
            <div className="w-full lg:flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="SEARCH_DEV..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0b0f1a] border border-white/10 pl-11 h-12 rounded-xl focus:border-[#00D9F5]/50 transition-colors text-xs font-bold tracking-wider uppercase text-white placeholder-slate-600"
                />
              </div>

              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="LOCATION..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0b0f1a] border border-white/10 pl-11 h-12 rounded-xl focus:border-[#00D9F5]/50 transition-colors text-xs font-bold tracking-wider uppercase text-white placeholder-slate-600"
                />
              </div>

              <div className="relative group">
                <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="MIN_EFFICIENCY..."
                  type="number"
                  value={minEfficiency ?? ""}
                  onChange={(e) => setMinEfficiency(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full bg-[#0b0f1a] border border-white/10 pl-11 h-12 rounded-xl focus:border-[#00D9F5]/50 transition-colors text-xs font-bold tracking-wider uppercase text-white placeholder-slate-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => setHireable(!hireable)}
                className={cn(
                  "flex-1 md:flex-none h-12 bg-[#0b0f1a] border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors px-6",
                  hireable ? "border-[#00F5A0]/50 text-[#00F5A0] bg-[#00F5A0]/10" : "text-slate-400 hover:text-white"
                )}
              >
                <UserCheck className={cn("mr-2 h-4 w-4", hireable ? "text-[#00F5A0]" : "text-slate-500")} />
                HIREABLE
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none h-12 bg-[#0b0f1a] border border-white/10 rounded-xl text-slate-400 hover:text-white min-w-[160px] justify-between px-6 text-xs font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      CONTACTS
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#121826] border border-white/10 text-slate-300 min-w-[200px] rounded-xl p-2 shadow-2xl">
                  <DropdownMenuItem
                    className="flex items-center gap-3 hover:bg-white/5 cursor-pointer text-xs font-bold uppercase tracking-wider p-3 rounded-lg mb-1"
                    onClick={() => setHasLinkedIn(!hasLinkedIn)}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                        hasLinkedIn ? "bg-[#00D9F5] border-[#00D9F5]" : "bg-[#0b0f1a] border-white/20"
                      )}
                    >
                      {hasLinkedIn && <Check className="h-3.5 w-3.5 text-[#0b0f1a]" />}
                    </div>
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-3 hover:bg-white/5 cursor-pointer text-xs font-bold uppercase tracking-wider p-3 rounded-lg"
                    onClick={() => setHasEmail(!hasEmail)}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                        hasEmail ? "bg-[#00D9F5] border-[#00D9F5]" : "bg-[#0b0f1a] border-white/20"
                      )}
                    >
                      {hasEmail && <Check className="h-3.5 w-3.5 text-[#0b0f1a]" />}
                    </div>
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 md:flex-none h-12 bg-[#0b0f1a] border border-white/10 rounded-xl text-slate-400 hover:text-white min-w-[160px] justify-between px-6 text-xs font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-500" />
                      {sortBy === "contributorEfficiency" ? "EFFICIENCY" : sortBy === "totalScore" ? "TOTAL_SCORE" : "CONTRIBUTIONS"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#121826] border border-white/10 text-slate-300 min-w-[200px] rounded-xl p-2 shadow-2xl">
                  {[
                    { value: "contributorEfficiency", label: "Efficiency" },
                    { value: "totalScore", label: "Total Score" },
                    { value: "contributionCount", label: "Contributions" },
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
            <div className="relative min-w-[800px]">
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
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("username")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        Developer
                        {getSortIcon("username")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("contributorEfficiency")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        Efficiency
                        {getSortIcon("contributorEfficiency")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("totalScore")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        Total Score
                        {getSortIcon("totalScore")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSort("contributionCount")}
                        className="hover:bg-white/5 -ml-4 text-[10px] uppercase tracking-wider text-slate-400"
                      >
                        Contributions
                        {getSortIcon("contributionCount")}
                      </Button>
                    </TableHead>
                    <TableHead className="py-4 px-6 text-[10px] uppercase tracking-wider text-slate-400">
                      Location
                    </TableHead>
                    <TableHead className="py-4 px-6" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.length ? (
                    data.data.map((entry) => (
                      <>
                        <TableRow
                          key={entry.username}
                          className={cn(
                            "border-white/5 transition-colors cursor-pointer group h-20",
                            expanded[entry.username] ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                          )}
                          onClick={() => toggleExpanded(entry.username)}
                        >
                          <TableCell className="px-6 py-4">
                            <div className="font-medium text-slate-500">#{entry.rank}</div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10 border border-white/10 rounded-lg">
                                <AvatarImage src={entry.avatarUrl || ""} alt={entry.username} className="rounded-lg object-cover" />
                                <AvatarFallback className="rounded-lg bg-[#1a2236] text-slate-300">
                                  {entry.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-left">
                                <span className="font-bold text-white leading-none mb-1 text-sm">
                                  {entry.name || entry.username}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-500 mr-2 uppercase tracking-wide">
                                    @{entry.username}
                                  </span>
                                  {entry.email && (
                                    <a href={`mailto:${entry.email}`} onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-white">
                                      <Mail className="h-3 w-3" />
                                    </a>
                                  )}
                                  {entry.linkedin && (
                                    <a href={entry.linkedin.startsWith("http") ? entry.linkedin : `https://${entry.linkedin}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-[#00D9F5]">
                                      <Linkedin className="h-3 w-3" />
                                    </a>
                                  )}
                                  {entry.twitterUsername && (
                                    <a href={`https://twitter.com/${entry.twitterUsername}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-500 hover:text-[#00D9F5]">
                                      <Twitter className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="font-bold text-[#00F5A0] text-lg">
                              {(entry.contributorEfficiency || 0).toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="font-medium text-white text-sm">
                              {(entry.totalScore || 0).toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="text-slate-400 text-sm">
                              {entry.contributionCount || 0}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="text-slate-400 text-xs truncate max-w-[150px]">
                              {entry.location || "—"}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/5 text-slate-500">
                              {expanded[entry.username] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expanded[entry.username] && (
                          <TableRow className="bg-[#0b0f1a] border-white/5 hover:bg-transparent">
                            <TableCell colSpan={7} className="p-0 border-b border-white/5">
                              <div className="p-6 md:p-10 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                  <div className="p-4 bg-[#121826] rounded-xl border border-white/5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">AI Score</p>
                                    <p className="text-2xl font-bold text-[#7F5AF0]">{(entry.aiScore || 0).toFixed(1)}</p>
                                  </div>
                                  <div className="p-4 bg-[#121826] rounded-xl border border-white/5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Backend Score</p>
                                    <p className="text-2xl font-bold text-[#00D9F5]">{(entry.backendScore || 0).toFixed(1)}</p>
                                  </div>
                                  <div className="p-4 bg-[#121826] rounded-xl border border-white/5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Frontend Score</p>
                                    <p className="text-2xl font-bold text-[#F59E0B]">{(entry.frontendScore || 0).toFixed(1)}</p>
                                  </div>
                                  <div className="p-4 bg-[#121826] rounded-xl border border-white/5">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">DevOps Score</p>
                                    <p className="text-2xl font-bold text-[#EF4444]">{(entry.devopsScore || 0).toFixed(1)}</p>
                                  </div>
                                </div>
                                {entry.bio && (
                                  <p className="mt-6 text-sm text-slate-400 leading-relaxed border-l-2 border-[#00D9F5]/30 pl-4 italic">
                                    &ldquo;{entry.bio}&rdquo;
                                  </p>
                                )}
                                <div className="flex gap-4 mt-6">
                                  <Link href={`/user/${entry.username}`} onClick={(e) => e.stopPropagation()}>
                                    <Button className="bg-[#00D9F5] text-[#0b0f1a] hover:bg-[#00D9F5]/90 h-10 rounded-lg font-bold uppercase tracking-wider text-xs">
                                      VIEW_PROFILE
                                    </Button>
                                  </Link>
                                  <a href={`https://github.com/${entry.username}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="outline" className="h-10 border-white/10 bg-[#121826] text-white hover:bg-[#1a2236] rounded-lg flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                                      <Github className="h-4 w-4" />
                                      GITHUB
                                    </Button>
                                  </a>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-bold tracking-widest uppercase text-xs">
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
          <div>Formula: baseTechnicalScore + min(contributor_efficiency, 20)</div>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[#00F5A0]" />
              Efficiency Cap: 20
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
