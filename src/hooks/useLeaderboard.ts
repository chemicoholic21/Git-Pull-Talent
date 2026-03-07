import { useQuery } from "@tanstack/react-query";
import { LeaderboardEntry } from "@/lib/scoring";

export function useLeaderboard(limit: number = 20) {
  return useQuery({
    queryKey: ["leaderboard", limit],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const res = await fetch(`/api/leaderboard?limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
