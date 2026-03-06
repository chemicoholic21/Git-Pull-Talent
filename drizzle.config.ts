import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables for CLI usage.
// Prefer .env.local (Next.js-style) but also load .env if present.
loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/lib/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});

