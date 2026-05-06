import { useQuery } from "@tanstack/react-query";

export interface EfficiencyEntry {
  rank: number;
  username: string;
  contributorEfficiency: number | null;
  totalScore: number | null;
  aiScore: number | null;
  backendScore: number | null;
  frontendScore: number | null;
  devopsScore: number | null;
  dataScore: number | null;
  contributionCount: number | null;
  updatedAt: string | null;
  name: string | null;
  avatarUrl: string | null;
  location: string | null;
  company: string | null;
  email: string | null;
  linkedin: string | null;
  twitterUsername: string | null;
  hireable: boolean | null;
  bio: string | null;
}

export interface EfficiencyResponse {
  data: EfficiencyEntry[];
  totalCount: number;
  page: number;
  limit: number;
}

export function useEfficiencyScores(
  limit?: number,
  page?: number,
  search?: string,
  location?: string,
  minEfficiency?: number,
  maxEfficiency?: number,
  minScore?: number,
  maxScore?: number,
  sortBy?: string,
  sortOrder?: string,
  hireable?: boolean,
  hasLinkedIn?: boolean,
  hasEmail?: boolean
) {
  return useQuery({
    queryKey: [
      "efficiency-scores",
      limit,
      page,
      search,
      location,
      minEfficiency,
      maxEfficiency,
      minScore,
      maxScore,
      sortBy,
      sortOrder,
      hireable,
      hasLinkedIn,
      hasEmail,
    ],
    queryFn: async (): Promise<EfficiencyResponse> => {
      const params = new URLSearchParams();
      if (limit) params.set("limit", limit.toString());
      if (page) params.set("page", page.toString());
      if (search) params.set("search", search);
      if (location) params.set("location", location);
      if (minEfficiency !== undefined) params.set("minEfficiency", minEfficiency.toString());
      if (maxEfficiency !== undefined) params.set("maxEfficiency", maxEfficiency.toString());
      if (minScore !== undefined) params.set("minScore", minScore.toString());
      if (maxScore !== undefined) params.set("maxScore", maxScore.toString());
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      if (hireable === true) params.set("hireable", "true");
      if (hasLinkedIn === true) params.set("hasLinkedIn", "true");
      if (hasEmail === true) params.set("hasEmail", "true");

      const url = `/api/scores/efficiency?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch efficiency scores");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
