import { NextRequest, NextResponse } from "next/server";

// Generate random code
function generateRandomCode(length = 4): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Environment config
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_USER = process.env.GITHUB_USER || "";
const GIST_ID = process.env.GIST_ID || "";
const APP_DOMAIN = process.env.APP_DOMAIN || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { longUrl, customCode } = body;

    if (!longUrl) {
      return NextResponse.json(
        { error: "URL is required." },
        { status: 400 }
      );
    }

    // Check env vars — demo mode
    if (!GITHUB_TOKEN || !GIST_ID) {
      const demoCode = customCode || generateRandomCode();
      return NextResponse.json(
        {
          error:
            "Server not configured. Set GITHUB_TOKEN and GIST_ID env vars.",
          url: `${APP_DOMAIN}/${demoCode}`,
          demo: true,
        },
        { status: 200 }
      );
    }

    // Fetch the gist
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "NefuSite",
      },
    });

    if (!gistRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URL database." },
        { status: 500 }
      );
    }

    const gistData = await gistRes.json();
    const gistFile = Object.keys(gistData.files)[0];
    const links: Record<string, string> = JSON.parse(
      gistData.files[gistFile].content || "{}"
    );

    // Determine short code
    let shortCode: string;
    if (customCode) {
      if (links[customCode]) {
        return NextResponse.json(
          { error: "Custom code already in use." },
          { status: 400 }
        );
      }
      shortCode = customCode;
    } else {
      // Generate unique random code
      do {
        shortCode = generateRandomCode();
      } while (links[shortCode]);
    }

    // Add the mapping
    links[shortCode] = longUrl;

    // Update the gist
    const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "NefuSite",
      },
      body: JSON.stringify({
        files: {
          [gistFile]: {
            content: JSON.stringify(links, null, 2),
          },
        },
      }),
    });

    if (!patchRes.ok) {
      return NextResponse.json(
        { error: "Failed to save shortened URL." },
        { status: 500 }
      );
    }

    const url = `${APP_DOMAIN}/${shortCode}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Shorten error:", error);
    return NextResponse.json(
      { error: "Failed to shorten URL." },
      { status: 500 }
    );
  }
}
