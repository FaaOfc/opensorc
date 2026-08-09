import { NextRequest, NextResponse } from "next/server";

// Generate random code for filenames/codes
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
const CDN_REPO = process.env.CDN_REPO || "";
const APP_DOMAIN = process.env.APP_DOMAIN || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    // Check env vars
    if (!GITHUB_TOKEN || !GITHUB_USER || !CDN_REPO) {
      return NextResponse.json(
        {
          error:
            "Server not configured. Set GITHUB_TOKEN, GITHUB_USER, and CDN_REPO env vars.",
          url: `${APP_DOMAIN}/demo-${generateRandomCode()}`,
          demo: true,
        },
        { status: 200 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File upload failed. No file provided." },
        { status: 400 }
      );
    }

    // Read file as base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Generate random filename
    const ext = file.name.includes(".")
      ? "." + file.name.split(".").pop()
      : "";
    const fileName = generateRandomCode() + ext;

    // Upload to GitHub
    const githubRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${CDN_REPO}/contents/${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "NefuSite",
        },
        body: JSON.stringify({
          message: `Upload ${fileName}`,
          content: base64,
        }),
      }
    );

    if (!githubRes.ok) {
      const errText = await githubRes.text();
      console.error("GitHub upload error:", errText);
      return NextResponse.json(
        { error: "Failed to upload file to GitHub." },
        { status: 500 }
      );
    }

    const url = `${APP_DOMAIN}/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
