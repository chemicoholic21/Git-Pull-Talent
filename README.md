# Git Pull Talent

**Project Intelligence for Open Source Contributors**

Git Pull Talent computes a *contribution importance score* for any GitHub user — a single number that reflects not just how much someone contributes, but how much it *matters*. It works by analyzing merged pull requests across open source repositories and weighting them by the influence of those projects.

Standard GitHub profiles show activity. Git Pull Talent shows impact.

---

## How the Score Works

The core formula is simple by design:

```
contribution_importance = stars × (user_merged_PRs / total_merged_PRs)
```

A PR merged into a 40,000-star repo counts for more than ten merged into projects nobody uses. Repos under 10 stars are excluded, and per-repo scores are capped at 10,000 to prevent a single viral project from dominating the picture.

**Score levels:**

| Score | Level |
|-------|-------|
| < 10 | Newcomer |
| 10 – 99 | Contributor |
| 100 – 499 | Active Contributor |
| 500 – 1,999 | Core Contributor |
| 2,000+ | Open Source Leader |

---

## Features

- **User Analysis** — Look up any GitHub user to see their contribution importance score, language distribution, and merged PR history across starred repos.
- **Global Leaderboard** — Ranked developer index with filters by location, skills, open-to-work status, and more.
- **Repo Score Leaderboard** — See which repos have the highest contributor efficiency scores.
- **Efficiency Leaderboard** — Rank developers by contribution efficiency metrics.
- **Trending Repositories** — Discover currently trending open source projects on GitHub.
- **Good First Issues** — Find curated beginner-friendly issues from popular repos to start contributing.
- **Discover** — Search for developers by location and analyze them in bulk.
- **OpenGraph Images** — Auto-generated shareable cards for user profiles.

---

## Stack

Git Pull Talent is built on Next.js 16 (App Router) with a dark terminal aesthetic.

- **Database** — Supabase (Postgres) via Drizzle ORM
- **Cache & rate limiting** — Upstash Redis
- **Auth** — NextAuth.js v5 with GitHub OAuth
- **Charts** — Recharts
- **UI components** — shadcn/ui
- **Styling** — Tailwind CSS v4
- **Data fetching** — TanStack React Query, Octokit (GraphQL + REST)

---

## Running Locally

**Prerequisites:** Node.js 18+, a GitHub account, a [Supabase](https://supabase.com) project, and an [Upstash](https://upstash.com) Redis database.

**1. Clone and install**

```bash
git clone https://github.com/chemicoholic21/gitpulltalent.git
cd gitpulltalent
npm install
```

**2. Configure environment**

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# GitHub OAuth
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# NextAuth
NEXTAUTH_SECRET="..."       # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Supabase (Postgres) — use the Transaction pooler connection string (port 6543)
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"

# Upstash (Redis)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# GitHub PAT pool (add more as needed)
GITHUB_TOKEN_1="ghp_..."
```

**3. Push the schema**

```bash
npm run db:push
```

**4. Start the dev server**

```bash
npm run dev
```

---

## Deploying to Vercel

**Supabase (database)**

Create a project, grab the pooled connection string (port 6543), and run `npm run db:push` locally against it to sync the schema before deploying.

**Upstash (cache)**

Create a Redis database and copy the `REST_URL` and `REST_TOKEN`. You can optionally configure a global rate limit window from the Upstash console.

**GitHub OAuth**

Go to *Settings → Developer Settings → OAuth Apps* and create a new app:

- Homepage URL: `https://gitpulltalent.vercel.app`
- Callback URL: `https://gitpulltalent.vercel.app/api/auth/callback/github`

**Vercel**

Import the repo, add all `.env.local` variables to the project's environment settings (make sure `NEXTAUTH_URL` points to your production domain), and deploy.

---

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

Copyright (c) 2026 Taniya Souza
