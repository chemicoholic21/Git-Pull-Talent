import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userRepoScores, githubRepos, leaderboard } from "@/lib/schema";
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
    const repoSearch = searchParams.get("repoSearch");
    const language = searchParams.get("language");
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");
    const minPrs = searchParams.get("minPrs");
    const maxPrs = searchParams.get("maxPrs");
    const minStars = searchParams.get("minStars");
    const maxStars = searchParams.get("maxStars");

    // Sorting
    const sortBy = searchParams.get("sortBy") || "repoScore";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build filters
    const filters = [];

    // Only include entries with repo score
    filters.push(sql`${userRepoScores.repoScore} IS NOT NULL`);
    filters.push(sql`${userRepoScores.repoScore} > 0`);

    if (search) {
      filters.push(ilike(userRepoScores.username, `%${search}%`));
    }

    if (repoSearch) {
      filters.push(ilike(userRepoScores.repoName, `%${repoSearch}%`));
    }

    if (language) {
      filters.push(ilike(githubRepos.primaryLanguage, `%${language}%`));
    }

    if (minScore) {
      filters.push(gte(userRepoScores.repoScore, parseFloat(minScore)));
    }

    if (maxScore) {
      filters.push(lte(userRepoScores.repoScore, parseFloat(maxScore)));
    }

    if (minPrs) {
      filters.push(gte(userRepoScores.totalPrs, parseInt(minPrs)));
    }

    if (maxPrs) {
      filters.push(lte(userRepoScores.totalPrs, parseInt(maxPrs)));
    }

    if (minStars) {
      filters.push(gte(userRepoScores.stars, parseInt(minStars)));
    }

    if (maxStars) {
      filters.push(lte(userRepoScores.stars, parseInt(maxStars)));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    // Determine sort column
    let orderByColumn: any;
    switch (sortBy) {
      case "repoScore":
        orderByColumn = userRepoScores.repoScore;
        break;
      case "totalPrs":
        orderByColumn = userRepoScores.totalPrs;
        break;
      case "userPrs":
        orderByColumn = userRepoScores.userPrs;
        break;
      case "stars":
        orderByColumn = userRepoScores.stars;
        break;
      case "repoName":
        orderByColumn = userRepoScores.repoName;
        break;
      case "username":
        orderByColumn = userRepoScores.username;
        break;
      default:
        orderByColumn = userRepoScores.repoScore;
    }

    const sortFn = sortOrder === "asc" ? asc : desc;

    // Get total count
    const countResult = await db
      .select({ value: count() })
      .from(userRepoScores)
      .leftJoin(githubRepos, eq(userRepoScores.repoName, githubRepos.repoName))
      .where(whereClause);
    const totalCount = Number(countResult[0].value);

    // Get data with join to github_repos for repo details
    const results = await db
      .select({
        id: userRepoScores.id,
        username: userRepoScores.username,
        repoName: userRepoScores.repoName,
        userPrs: userRepoScores.userPrs,
        totalPrs: userRepoScores.totalPrs,
        stars: userRepoScores.stars,
        repoScore: userRepoScores.repoScore,
        computedAt: userRepoScores.computedAt,
        // From github_repos
        description: githubRepos.description,
        primaryLanguage: githubRepos.primaryLanguage,
        topics: githubRepos.topics,
        ownerLogin: githubRepos.ownerLogin,
      })
      .from(userRepoScores)
      .leftJoin(githubRepos, eq(userRepoScores.repoName, githubRepos.repoName))
      .where(whereClause)
      .orderBy(sortFn(orderByColumn))
      .limit(limit)
      .offset(offset);

    // Get user avatars from leaderboard
    const usernames = [...new Set(results.map((r) => r.username))];
    const userAvatars = await db
      .select({
        username: leaderboard.username,
        avatarUrl: leaderboard.avatarUrl,
        name: leaderboard.name,
      })
      .from(leaderboard)
      .where(
        usernames.length > 0
          ? sql`${leaderboard.username} IN ${usernames}`
          : sql`1=0`
      );

    const avatarMap = new Map(userAvatars.map((u) => [u.username, u]));

    const data = results.map((row, index) => ({
      rank: offset + index + 1,
      ...row,
      avatarUrl: avatarMap.get(row.username)?.avatarUrl || null,
      name: avatarMap.get(row.username)?.name || null,
    }));

    return NextResponse.json({
      data,
      totalCount,
      page,
      limit,
    });
  } catch (error: any) {
    console.error("[scores/repos]", error);
    return NextResponse.json(
      { error: "Failed to fetch repo scores" },
      { status: 500 }
    );
  }
}
