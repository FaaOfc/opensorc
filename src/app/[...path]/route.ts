import { NextRequest, NextResponse } from "next/server";

// MIME type map for common file extensions
const MIME_TYPES: Record<string, string> = {
  // Images
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".bmp": "image/bmp",
  ".avif": "image/avif",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
  // Video
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".flv": "video/x-flv",
  // Audio
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
  ".aac": "audio/aac",
  ".m4a": "audio/mp4",
  ".opus": "audio/opus",
  // Documents
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Text / Code
  ".txt": "text/plain",
  ".html": "text/html",
  ".htm": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".ts": "application/typescript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".md": "text/markdown",
  ".csv": "text/csv",
  // Fonts
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  // Archives
  ".zip": "application/zip",
  ".rar": "application/vnd.rar",
  ".7z": "application/x-7z-compressed",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  // Executables / Other
  ".exe": "application/x-msdownload",
  ".dmg": "application/x-apple-diskimage",
  ".deb": "application/vnd.debian.binary-package",
  ".apk": "application/vnd.android.package-archive",
  ".ipa": "application/vnd.iphone",
  // Subtitle
  ".srt": "text/plain",
  ".vtt": "text/vtt",
};

function getMimeType(filename: string): string {
  const ext = filename.includes(".")
    ? "." + filename.split(".").pop()!.toLowerCase()
    : "";
  return MIME_TYPES[ext] || "application/octet-stream";
}

/**
 * Catch-all route handler for:
 * 1. CDN file serving — if the path has a file extension, fetch from GitHub repo and serve with correct MIME type
 * 2. Short URL redirect — if no extension, lookup in GitHub Gist and redirect (302)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const fullPath = path.join("/");
  const hasExtension = fullPath.includes(".");

  if (hasExtension) {
    // === CDN FILE SERVING ===
    return serveCdnFile(fullPath);
  } else {
    // === SHORT URL REDIRECT ===
    return redirectShortUrl(fullPath);
  }
}

/**
 * Serve a CDN file from the GitHub repository.
 * Fetches the file content via GitHub Contents API and returns it with the correct MIME type.
 */
async function serveCdnFile(filePath: string): Promise<NextResponse> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
  const GITHUB_USER = process.env.GITHUB_USER || "";
  const CDN_REPO = process.env.CDN_REPO || "";

  if (!GITHUB_TOKEN || !GITHUB_USER || !CDN_REPO) {
    return NextResponse.json(
      { error: "CDN not configured. Set GITHUB_TOKEN, GITHUB_USER, and CDN_REPO env vars." },
      { status: 500 }
    );
  }

  try {
    // Fetch file metadata from GitHub Contents API
    const metaRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${CDN_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "TaoSite-CDN",
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!metaRes.ok) {
      if (metaRes.status === 404) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      const errText = await metaRes.text();
      console.error("GitHub meta fetch error:", errText);
      return NextResponse.json(
        { error: "Failed to fetch file metadata" },
        { status: 500 }
      );
    }

    const metaData = await metaRes.json();

    // GitHub returns { download_url } for files
    if (!metaData.download_url) {
      return NextResponse.json({ error: "Not a file" }, { status: 400 });
    }

    // Download the actual file content from GitHub's raw URL
    const fileRes = await fetch(metaData.download_url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "TaoSite-CDN",
      },
    });

    if (!fileRes.ok) {
      return NextResponse.json(
        { error: "Failed to download file" },
        { status: 500 }
      );
    }

    const mimeType = getMimeType(filePath);
    const arrayBuffer = await fileRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(arrayBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("CDN serve error:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  }
}

/**
 * Look up a short URL code in the GitHub Gist and redirect to the original URL.
 */
async function redirectShortUrl(code: string): Promise<NextResponse> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
  const GIST_ID = process.env.GIST_ID || "";

  if (!GITHUB_TOKEN || !GIST_ID) {
    return NextResponse.json(
      { error: "Short URL not configured. Set GITHUB_TOKEN and GIST_ID env vars." },
      { status: 500 }
    );
  }

  try {
    // Fetch the gist
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "TaoSite-ShortURL",
      },
    });

    if (!gistRes.ok) {
      const errText = await gistRes.text();
      console.error("Gist fetch error:", errText);
      return NextResponse.json(
        { error: "Failed to fetch URL database" },
        { status: 500 }
      );
    }

    const gistData = await gistRes.json();
    const gistFile = Object.keys(gistData.files)[0];
    const links: Record<string, string> = JSON.parse(
      gistData.files[gistFile].content || "{}"
    );

    const longUrl = links[code];

    if (!longUrl) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Redirect to the original URL
    return NextResponse.redirect(longUrl, 302);
  } catch (error) {
    console.error("Short URL redirect error:", error);
    return NextResponse.json(
      { error: "Failed to redirect" },
      { status: 500 }
    );
  }
}
