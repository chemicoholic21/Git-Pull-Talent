import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaderboard } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let limit = parseInt(searchParams.get("limit") ?? "20");
    if (isNaN(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100;

    const topUsers = await db
      .select({
        username: leaderboard.username,
        totalScore: leaderboard.totalScore,
        avatarUrl: leaderboard.avatarUrl,
      })
      .from(leaderboard)
      .orderBy(desc(leaderboard.totalScore))
      .limit(limit);

    const result = topUsers.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[leaderboard]", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
