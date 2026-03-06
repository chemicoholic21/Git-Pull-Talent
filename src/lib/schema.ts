import { integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const analyses = pgTable("analyses", {
    id: text("id").primaryKey(), // GitHub username
    username: text("username").notNull(),
    totalScore: real("total_score"),
    topReposJson: text("top_repos_json"),
    languagesJson: text("languages_json"),
    contributionCount: integer("contribution_count"),
    cachedAt: timestamp("cached_at").defaultNow(),
});

export const leaderboard = pgTable("leaderboard", {
    username: text("username").primaryKey(),
    totalScore: real("total_score"),
    avatarUrl: text("avatar_url"),
    updatedAt: timestamp("updated_at").defaultNow(),
});
