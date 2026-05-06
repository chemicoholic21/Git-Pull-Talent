import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userScores, githubUsers, leaderboard } from "@/lib/schema";
import { desc, asc, ilike, count, sql, or, and, eq, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");
    const limit = limitParam ? parseInt(limitParam) : 20;
    const page = pageParam ? parseInt(pageParam) : 1;
    const offset = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const minEfficiency = searchParams.get("minEfficiency");
    const maxEfficiency = searchParams.get("maxEfficiency");
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");
    const hireable = searchParams.get("hireable") === "true";
    const hasLinkedIn = searchParams.get("hasLinkedIn") === "true";
    const hasEmail = searchParams.get("hasEmail") === "true";

    // Sorting
    const sortBy = searchParams.get("sortBy") || "contributorEfficiency";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build filters
    const filters = [];

    // Only include users with contributor efficiency data
    filters.push(sql`${userScores.contributorEfficiency} IS NOT NULL`);

    if (search) {
      filters.push(
        or(
          ilike(userScores.username, `%${search}%`),
          ilike(leaderboard.name, `%${search}%`)
        )
      );
    }

    if (location) {
      filters.push(ilike(leaderboard.location, `%${location}%`));
    }

    if (minEfficiency) {
      filters.push(gte(userScores.contributorEfficiency, parseFloat(minEfficiency)));
    }

    if (maxEfficiency) {
      filters.push(lte(userScores.contributorEfficiency, parseFloat(maxEfficiency)));
    }

    if (minScore) {
      filters.push(gte(userScores.totalScore, parseFloat(minScore)));
    }

    if (maxScore) {
      filters.push(lte(userScores.totalScore, parseFloat(maxScore)));
    }

    if (hireable) {
      filters.push(eq(leaderboard.hireable, true));
    }

    const contactFilters = [];
    if (hasLinkedIn) contactFilters.push(sql`${leaderboard.linkedin} IS NOT NULL`);
    if (hasEmail) contactFilters.push(sql`${leaderboard.email} IS NOT NULL`);
    if (contactFilters.length > 0) {
      filters.push(or(...contactFilters));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // Determine sort column
    let orderByColumn: any;
    switch (sortBy) {
      case "contributorEfficiency":
        orderByColumn = userScores.contributorEfficiency;
        break;
      case "totalScore":
        orderByColumn = userScores.totalScore;
        break;
      case "username":
        orderByColumn = userScores.username;
        break;
      case "contributionCount":
        orderByColumn = userScores.contributionCount;
        break;
      default:
        orderByColumn = userScores.contributorEfficiency;
    }

    const sortFn = sortOrder === "asc" ? asc : desc;

    // Get total count
    const countResult = await db
      .select({ value: count() })
      .from(userScores)
      .leftJoin(leaderboard, eq(userScores.username, leaderboard.username))
      .where(whereClause);
    const totalCount = Number(countResult[0].value);

    // Get data with join to leaderboard for user details
    const results = await db
      .select({
        username: userScores.username,
        contributorEfficiency: userScores.contributorEfficiency,
        totalScore: userScores.totalScore,
        aiScore: userScores.aiScore,
        backendScore: userScores.backendScore,
        frontendScore: userScores.frontendScore,
        devopsScore: userScores.devopsScore,
        dataScore: userScores.dataScore,
        contributionCount: userScores.contributionCount,
        updatedAt: userScores.updatedAt,
        // From leaderboard
        name: leaderboard.name,
        avatarUrl: leaderboard.avatarUrl,
        location: leaderboard.location,
        company: leaderboard.company,
        email: leaderboard.email,
        linkedin: leaderboard.linkedin,
        twitterUsername: leaderboard.twitterUsername,
        hireable: leaderboard.hireable,
        bio: leaderboard.bio,
      })
      .from(userScores)
      .leftJoin(leaderboard, eq(userScores.username, leaderboard.username))
      .where(whereClause)
      .orderBy(sortFn(orderByColumn))
      .limit(limit)
      .offset(offset);

    const data = results.map((row, index) => ({
      rank: offset + index + 1,
      ...row,
    }));

    return NextResponse.json({
      data,
      totalCount,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("[scores/efficiency]", error);
    return NextResponse.json(
      { error: "Failed to fetch efficiency scores" },
      { status: 500 }
    );
  }
}
