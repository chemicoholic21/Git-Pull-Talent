import { NextRequest, NextResponse } from "next/server";
import { graphql } from "@octokit/graphql";
import { getBestToken, updateTokenPoints } from "@/lib/pat-pool";

const SEARCH_ISSUES_QUERY = `
  query SearchIssues($query: String!) {
    rateLimit { remaining cost }
    search(query: $query, type: ISSUE, first: 50) {
      nodes {
        ... on Issue {
          id
          title
          url
          createdAt
          bodyText
          repository {
            nameWithOwner
            stargazerCount
            url
            primaryLanguage {
              name
            }
          }
          labels(first: 5) {
            nodes {
              name
              color
            }
          }
          author {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const { token, index } = await getBestToken();
    
    const client = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });

    const query = 'label:"good first issue" is:issue is:open archived:false';
    
    const response = await client<any>(SEARCH_ISSUES_QUERY, {
      query,
    });

    if (index !== -1) {
      await updateTokenPoints(index, response.rateLimit.remaining);
    }

    const issues = response.search.nodes.map((node: any) => ({
      id: node.id,
      title: node.title,
      url: node.url,
      createdAt: node.createdAt,
      bodyText: node.bodyText.slice(0, 200) + (node.bodyText.length > 200 ? "..." : ""),
      repository: {
        name: node.repository.nameWithOwner,
        stars: node.repository.stargazerCount,
        url: node.repository.url,
        language: node.repository.primaryLanguage?.name || "Unknown",
      },
      labels: node.labels.nodes.map((label: any) => ({
        name: label.name,
        color: label.color,
      })),
      author: {
        login: node.author?.login || "ghost",
        avatarUrl: node.author?.avatarUrl || "https://github.com/identicons/ghost.png",
      },
    }));

    return NextResponse.json({ issues });
  } catch (error: any) {
    console.error("[issues-api]", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}
