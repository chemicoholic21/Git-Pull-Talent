import { graphql } from "@octokit/graphql";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RawGitHubData {
    user: {
        name: string | null;
        avatarUrl: string;
        bio: string | null;
        followers: number;
        following: number;
        createdAt: string;
    };
    repos: Array<{
        name: string;
        ownerLogin: string;
        stargazerCount: number;
        primaryLanguage: string | null;
        pushedAt: string | null;
        isFork: boolean;
        mergedPrCount: number;
        mergedPrsByUserCount: number;
    }>;
}

// ---------------------------------------------------------------------------
// GraphQL query types (responses)
// ---------------------------------------------------------------------------

interface UserReposResponse {
    user: {
        name: string | null;
        avatarUrl: string;
        bio: string | null;
        followers: { totalCount: number };
        following: { totalCount: number };
        createdAt: string;
        repositories: {
            nodes: Array<{
                name: string;
                owner: { login: string };
                stargazerCount: number;
                primaryLanguage: { name: string } | null;
                pushedAt: string | null;
                isFork: boolean;
                pullRequests: { totalCount: number };
            }>;
        };
    } | null;
}

interface SearchResponse {
    search: {
        issueCount: number;
        nodes: Array<{
            __typename?: string;
            repository?: {
                owner: { login: string };
                name: string;
            };
        }>;
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
        };
    };
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

function getClient(token?: string) {
    const auth = token ?? process.env.GITHUB_TOKEN;
    if (!auth) {
        throw new Error(
            "No GitHub token provided. Pass a token or set GITHUB_TOKEN."
        );
    }
    return graphql.defaults({
        headers: {
            authorization: `token ${auth}`,
        },
    });
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

const USER_REPOS_QUERY = `
  query UserRepos($login: String!) {
    user(login: $login) {
      name
      avatarUrl
      bio
      followers { totalCount }
      following { totalCount }
      createdAt
      repositories(
        first: 30
        orderBy: { field: PUSHED_AT, direction: DESC }
        ownerAffiliations: [OWNER]
      ) {
        nodes {
          name
          owner { login }
          stargazerCount
          primaryLanguage { name }
          pushedAt
          isFork
          pullRequests(states: [MERGED]) {
            totalCount
          }
        }
      }
    }
  }
`;

const SEARCH_MERGED_PRS_QUERY = `
  query SearchMergedPrs($searchQuery: String!) {
    search(query: $searchQuery, type: ISSUE, first: 100) {
      issueCount
      nodes {
        ... on PullRequest {
          repository {
            owner { login }
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Fetches GitHub user analysis data: profile, top repos, and merged PR counts.
 * Uses at most 2 GraphQL requests.
 */
export async function fetchUserAnalysis(
    username: string,
    token?: string
): Promise<RawGitHubData> {
    const client = getClient(token);

    // Request 1: User profile + 30 most recently pushed owned repos + total merged PRs per repo
    const userRes = await client<UserReposResponse>(USER_REPOS_QUERY, {
        login: username,
    });

    const user = userRes.user;
    if (!user) {
        throw new Error(`User "${username}" not found`);
    }

    const nodes = user.repositories.nodes ?? [];
    const repos = nodes.map((r) => ({
        name: r.name,
        ownerLogin: r.owner.login,
        stargazerCount: r.stargazerCount,
        primaryLanguage: r.primaryLanguage?.name ?? null,
        pushedAt: r.pushedAt,
        isFork: r.isFork,
        mergedPrCount: r.pullRequests.totalCount,
        mergedPrsByUserCount: 0, // filled by request 2
    }));

    // Request 2: Search for merged PRs authored by username in those repos
    if (repos.length > 0) {
        const repoQueries = repos.map(
            (r) => `repo:${r.ownerLogin}/${r.name}`
        );
        const searchQuery = `${repoQueries.join(" ")} is:pr is:merged author:${username}`;

        const searchRes = await client<SearchResponse>(SEARCH_MERGED_PRS_QUERY, {
            searchQuery,
        });

        const countsByRepo = new Map<string, number>();
        for (const node of searchRes.search.nodes) {
            const repo = node.repository;
            if (!repo) continue;
            const key = `${repo.owner.login}/${repo.name}`;
            countsByRepo.set(key, (countsByRepo.get(key) ?? 0) + 1);
        }

        for (const r of repos) {
            const key = `${r.ownerLogin}/${r.name}`;
            r.mergedPrsByUserCount = countsByRepo.get(key) ?? 0;
        }

        // Search returns at most 100 nodes; if hasNextPage, we'd need more requests.
        // Per requirements, we stop at 2 requests. Counts may be understated for
        // users with >100 merged PRs across these repos.
    }

    return {
        user: {
            name: user.name,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            followers: user.followers.totalCount,
            following: user.following.totalCount,
            createdAt: user.createdAt,
        },
        repos,
    };
}

fetchUserAnalysis('torvalds').then(console.log).catch(console.error);
