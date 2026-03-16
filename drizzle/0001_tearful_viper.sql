ALTER TABLE "analyses" ADD COLUMN "ai_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "backend_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "frontend_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "devops_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "data_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "analyses" ADD COLUMN "unique_skills_json" text;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "ai_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "backend_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "frontend_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "devops_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "data_score" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "unique_skills_json" text;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "linkedin" text;