# GitPulse — Project Intelligence

GitPulse is a public GitHub analytics platform that computes a **contribution importance score** for any GitHub user based on their merged pull requests across open source repositories. It surfaces meaningful developer insights that aren't visible on a standard GitHub profile.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A GitHub account (for PATs and OAuth)
- [Neon](https://neon.tech) (PostgreSQL)
- [Upstash](https://upstash.com) (Redis)

### Local Setup
1. **Clone and install:**
   ```bash
   git clone https://github.com/your-username/gitpulse.git
   cd gitpulse
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file (copy from `.env.example` if available) and fill in the credentials:
   ```env
   # Auth
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"

   # Database (Neon)
   DATABASE_URL="postgresql://..."

   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL="..."
   UPSTASH_REDIS_REST_TOKEN="..."

   # GitHub PAT Pool
   GITHUB_TOKEN_1="ghp_..."
   ```

3. **Database Migration:**
   ```bash
   npm run db:push
   ```

4. **Run Dev Server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Deployment Guide (Vercel)

### 1. Database Setup (Neon)
1. Create a new project on [Neon](https://neon.tech).
2. Copy the **Connection String** (Pooled is recommended).
3. Run `npm run db:push` locally with this string to sync the schema.

### 2. Cache & Rate Limiting (Upstash)
1. Create a Redis database on [Upstash](https://upstash.com).
2. Copy the `REST_URL` and `REST_TOKEN`.
3. (Optional) Set up a global rate limit window in the Upstash console.

### 3. GitHub OAuth
1. Go to **GitHub Settings > Developer Settings > OAuth Apps**.
2. Create a new App.
3. Set **Homepage URL** to your Vercel URL (e.g., `https://gitpulse.vercel.app`).
4. Set **Authorization callback URL** to `https://gitpulse.vercel.app/api/auth/callback/github`.

### 4. Vercel Deployment
1. Import your repository to Vercel.
2. Add all variables from your `.env.local` to the **Environment Variables** section in Vercel project settings.
3. Ensure `NEXTAUTH_URL` is set to your production domain.
4. Deploy!

---

## 📊 Core Scoring Formula
The importance score is calculated as:
```
contribution_importance = stars × (user_merged_PRs / total_merged_PRs)
```
- **Filter**: Repos with < 10 stars are skipped.
- **Cap**: Per-repo score is capped at 10,000 to prevent outliers.
- **Levels**:
  - `< 10`: Newcomer
  - `10 – 99`: Contributor
  - `100 – 499`: Active Contributor
  - `500 – 1999`: Core Contributor
  - `2000+`: Open Source Leader

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14/15 (App Router)
- **Database**: Neon (Serverless Postgres)
- **ORM**: Drizzle
- **Cache**: Upstash Redis
- **Auth**: NextAuth.js v5
- **Charts**: Recharts
- **Styling**: Tailwind CSS (Dark Terminal Aesthetic)

---

## 🤝 Contributing
Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

## 📜 License
MIT
