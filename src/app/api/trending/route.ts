import { NextRequest, NextResponse } from "next/server";

async function fetchRepos() {
  const response = await fetch("https://github.com/trending", {
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
  });
  if (!response.ok) throw new Error("Failed to fetch repos");
  const html = await response.text();
  
  const repoMatches = html.matchAll(/<article class="Box-row">([\s\S]*?)<\/article>/g);
  const repos = [];
  
  for (const match of repoMatches) {
    const content = match[1];
    
    const nameMatch = content.match(/<h2[^>]*>[\s\S]*?href="\/([^"/ \t\n]+\/[^"/ \t\n]+)"/);
    const fullName = nameMatch ? nameMatch[1].trim() : "";
    
    const descMatch = content.match(/<p class="col-9 color-fg-muted my-1 pr-4">([\s\S]*?)<\/p>/);
    const description = descMatch ? descMatch[1].trim() : "";
    
    const langMatch = content.match(/<span itemprop="programmingLanguage">([\s\S]*?)<\/span>/);
    const language = langMatch ? langMatch[1].trim() : "";
    
    const starsMatch = content.match(/href="\/[^"]+\/stargazers"[\s\S]*?<\/svg>([\s\S]*?)<\/a>/);
    const stars = starsMatch ? starsMatch[1].trim().replace(/,/g, "") : "0";
    
    const forksMatch = content.match(/href="\/[^"]+\/forks"[\s\S]*?<\/svg>([\s\S]*?)<\/a>/);
    const forks = forksMatch ? forksMatch[1].trim().replace(/,/g, "") : "0";
    
    const avatarMatch = content.match(/src="([^"]+)"/);
    const avatarUrl = avatarMatch ? avatarMatch[1] : "";

    if (fullName) {
      repos.push({
        fullName,
        owner: fullName.split("/")[0],
        name: fullName.split("/")[1],
        description: description.replace(/<[^>]*>/g, '').trim(),
        language,
        stars,
        forks,
        avatarUrl,
      });
    }
  }
  return repos;
}

async function fetchDevelopers() {
  const response = await fetch("https://github.com/trending/developers", {
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
  });
  if (!response.ok) throw new Error("Failed to fetch developers");
  const html = await response.text();
  
  // GitHub sometimes uses "Box-row d-flex" or just "Box-row"
  const devMatches = html.matchAll(/<article class="Box-row[^"]*">([\s\S]*?)<\/article>/g);
  const developers = [];
  
  for (const match of devMatches) {
    const content = match[1];
    
    // Extract username: <a href="/username" class="Link--secondary">username</a>
    const usernameMatch = content.match(/<a[^>]*class="Link--secondary"[^>]*>([\s\S]*?)<\/a>/i);
    const username = usernameMatch ? usernameMatch[1].trim().replace(/@/g, '') : "";
    
    // Extract name: <h1 class="h3 lh-condensed"><a href="/username">Name</a></h1>
    const nameMatch = content.match(/<h1 class="h3 lh-condensed">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const name = nameMatch ? nameMatch[1].trim() : "";
    
    // Extract avatar
    const avatarMatch = content.match(/src="([^"]+)"/i);
    const avatarUrl = avatarMatch ? avatarMatch[1] : "";
    
    // Extract popular repository: <h1 class="h4 lh-condensed"><a href="/username/repo">repo</a></h1>
    const repoMatch = content.match(/<h1 class="h4 lh-condensed">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const popularRepo = repoMatch ? repoMatch[1].trim() : "";
    
    // Extract repo description: <div class="f6 color-fg-muted mt-1">description</div>
    const repoDescMatch = content.match(/<div class="f6 color-fg-muted mt-1">([\s\S]*?)<\/div>/i);
    const repoDescription = repoDescMatch ? repoDescMatch[1].trim().replace(/<[^>]*>/g, '') : "";

    // If username is not found via Link--secondary, try to get it from the h1 link
    let finalUsername = username;
    if (!finalUsername && nameMatch) {
      const hrefMatch = content.match(/<h1 class="h3 lh-condensed">[\s\S]*?href="\/([^"/]+)"/i);
      if (hrefMatch) finalUsername = hrefMatch[1];
    }

    if (finalUsername && finalUsername !== 'trending') {
      developers.push({
        username: finalUsername,
        name: name.replace(/<[^>]*>/g, '').trim() || finalUsername,
        avatarUrl,
        popularRepo: popularRepo.replace(/<[^>]*>/g, '').trim(),
        repoDescription: repoDescription.trim()
      });
    }
  }
  return developers;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "repositories";

  try {
    if (type === "developers") {
      const developers = await fetchDevelopers();
      return NextResponse.json({ developers });
    } else {
      const repos = await fetchRepos();
      return NextResponse.json({ repos });
    }
  } catch (error: any) {
    console.error("[trending]", error);
    return NextResponse.json({ error: "Failed to fetch trending data", details: error.message }, { status: 500 });
  }
}
