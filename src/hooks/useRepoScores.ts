import { useQuery } from "@tanstack/react-query";

export interface RepoScoreEntry {
  rank: number;
  id: number;
  username: string;
  repoName: string;
  userPrs: number;
  totalPrs: number;
  stars: number;
  repoScore: number | null;
  computedAt: string | null;
  description: string | null;
  primaryLanguage: string | null;
  topics: string[] | null;
  forks: number | null;
  ownerLogin: string | null;
  avatarUrl: string | null;
  name: string | null;
}

export interface RepoScoreResponse {
  data: RepoScoreEntry[];
  totalCount: number;
  page: number;
  limit: number;
}

export function useRepoScores(
  limit?: number,
  page?: number,
  search?: string,
  repoSearch?: string,
  language?: string,
  minScore?: number,
  maxScore?: number,
  minPrs?: number,
  maxPrs?: number,
  minStars?: number,
  maxStars?: number,
  sortBy?: string,
  sortOrder?: string
) {
  return useQuery({
    queryKey: [
      "repo-scores",
      limit,
      page,
      search,
      repoSearch,
      language,
      minScore,
      maxScore,
      minPrs,
      maxPrs,
      minStars,
      maxStars,
      sortBy,
      sortOrder,
    ],
    queryFn: async (): Promise<RepoScoreResponse> => {
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit.toString());
      if (page) params.set("page", page.toString());
      if (search) params.set("search", search);
      if (repoSearch) params.set("repoSearch", repoSearch);
      if (language) params.set("language", language);
      if (minScore !== undefined) params.set("minScore", minScore.toString());
      if (maxScore !== undefined) params.set("maxScore", maxScore.toString());
      if (minPrs !== undefined) params.set("minPrs", minPrs.toString());
      if (maxPrs !== undefined) params.set("maxPrs", maxPrs.toString());
      if (minStars !== undefined) params.set("minStars", minStars.toString());
      if (maxStars !== undefined) params.set("maxStars", maxStars.toString());
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);

      const url = `/api/scores/repos?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch repo scores");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
