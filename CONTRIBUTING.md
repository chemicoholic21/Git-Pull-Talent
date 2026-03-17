# Contributing to Git Pull Talent

First off, thank you for considering contributing to Git Pull Talent! It's people like you that make Git Pull Talent a great tool for the open-source community.

---

## 🏗️ Project Goal
Git Pull Talent is a public GitHub analytics platform that computes a **contribution importance score** for any GitHub user. The goal is to surface meaningful developer insights by weighting contributions based on project popularity and personal impact.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- [Neon](https://neon.tech) (PostgreSQL)
- [Upstash](https://upstash.com) (Redis)
- GitHub account (for OAuth and Personal Access Tokens)

### Local Setup
1. **Fork and clone:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gitpulltalent.git
   cd gitpulltalent
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env.local` and fill in your credentials.
   ```bash
   cp .env.example .env.local
   ```
   *For local development, you'll need at least one GitHub PAT (`GITHUB_TOKEN_1`).*

3. **Database Sync:**
   ```bash
   npm run db:push
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

## 🛠️ Project Architecture & Rules

To keep the codebase maintainable and the performance high, we follow these strict rules:

### 1. The Core Formula (DO NOT CHANGE)
Any changes to the scoring logic must be discussed in an Issue first. The current formula is:
`contribution_importance = stars × (user_merged_PRs / total_merged_PRs)`
- Skip repos with < 10 stars.
- Skip repos with 0 total merged PRs.
- Cap per-repo score at 10,000.

### 2. Tech Stack & Standards
- **Framework**: Next.js 14+ (App Router only).
- **TypeScript**: Strict mode is enabled. No `any` types.
- **Styling**: **Tailwind CSS only**. Do not use CSS modules, styled-components, or component libraries (shadcn, Radix, etc.) without prior approval.
- **Data Flow**: We use a tiered cache: Upstash Redis (L1) → Neon Postgres (L2).
- **API**: Use `@octokit/graphql` as the primary fetcher. Max 2 GraphQL requests per analysis.

### 3. Server vs. Client
- Default to **Server Components**. Only use `"use client"` for interactivity (hooks, event handlers).
- Files in `src/lib/` are **server-only**. Do not import them into client components.

### 4. Design System
We follow a **Dark Terminal Aesthetic** (Bloomberg meets GitHub dark mode).
- Background: `bg-gray-950`
- Cards: `bg-gray-900`
- Accents: `text-green-400` (Primary), `text-cyan-400` (Secondary)
- Font: Use `font-mono` for numbers and data points.

---

## 📜 Git & Commit Guidelines

- **Branching**: Create a feature branch for your changes (e.g., `feat/add-leaderboard-filters` or `fix/user-not-found`).
- **Commits**: Write clear, concise commit messages. Focus on the *why*, not just the *what*.
- **Style**: Match the existing project style (check `git log -n 3` for examples).

---

## 📥 Submitting a Pull Request

1. **Verify your changes**: Ensure the app builds and your changes follow the design system.
2. **Lint & Typecheck**: Run `npm run lint` and `tsc --noEmit` to catch errors.
3. **Submit**: Open a PR against the `main` branch with a clear description of your changes and any relevant issue numbers.

---

## 💬 Communication
If you have questions or want to propose a major change, please open an **Issue** first to discuss it with the maintainers.

Happy coding! 🚀
