import { NextRequest, NextResponse } from "next/server";

// MIME type map for common file extensions
const MIME_TYPES: Record<string, string> = {
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
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".flv": "video/x-flv",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
  ".aac": "audio/aac",
  ".m4a": "audio/mp4",
  ".opus": "audio/opus",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".zip": "application/zip",
  ".rar": "application/vnd.rar",
  ".7z": "application/x-7z-compressed",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".exe": "application/x-msdownload",
  ".dmg": "application/x-apple-diskimage",
  ".deb": "application/vnd.debian.binary-package",
  ".apk": "application/vnd.android.package-archive",
  ".ipa": "application/vnd.iphone",
  ".srt": "text/plain",
  ".vtt": "text/vtt",
};

function getMimeType(filename: string): string {
  const ext = filename.includes(".")
    ? "." + filename.split(".").pop()!.toLowerCase()
    : "";
  return MIME_TYPES[ext] || "application/octet-stream";
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Catch-all route handler:
 * 1. CDN file serving — path has extension → fetch from GitHub repo, serve with MIME type
 * 2. Short URL — no extension → show countdown redirect page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const fullPath = path.join("/");
  const hasExtension = fullPath.includes(".");

  if (hasExtension) {
    return serveCdnFile(fullPath);
  } else {
    return showRedirectPage(fullPath);
  }
}

/**
 * Serve a CDN file from the GitHub repository.
 */
async function serveCdnFile(filePath: string): Promise<NextResponse> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
  const GITHUB_USER = process.env.GITHUB_USER || "";
  const CDN_REPO = process.env.CDN_REPO || "";

  if (!GITHUB_TOKEN || !GITHUB_USER || !CDN_REPO) {
    return NextResponse.json(
      { error: "CDN not configured." },
      { status: 500 }
    );
  }

  try {
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
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 500 }
      );
    }

    const metaData = await metaRes.json();

    if (!metaData.download_url) {
      return NextResponse.json({ error: "Not a file" }, { status: 400 });
    }

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
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
  }
}

/**
 * Show a countdown redirect page for short URLs.
 * Displays "Anda akan diarahkan ke website <domain> dalam X detik"
 * with a "Kunjungi Sekarang" button and auto-redirect after countdown.
 */
async function showRedirectPage(code: string): Promise<NextResponse> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
  const GIST_ID = process.env.GIST_ID || "";

  if (!GITHUB_TOKEN || !GIST_ID) {
    return NextResponse.json(
      { error: "Short URL not configured." },
      { status: 500 }
    );
  }

  try {
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "TaoSite-ShortURL",
      },
    });

    if (!gistRes.ok) {
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

    const domain = extractDomain(longUrl);
    const html = buildRedirectPage(longUrl, domain, code);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Short URL redirect error:", error);
    return NextResponse.json({ error: "Failed to redirect" }, { status: 500 });
  }
}

/**
 * Build the HTML redirect countdown page with Neobrutalism design.
 */
function buildRedirectPage(longUrl: string, domain: string, code: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redirecting to ${domain}...</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      color: #18181b;
      padding: 1rem;
    }

    @media (prefers-color-scheme: dark) {
      body { background: #18181b; color: #e4e4e7; }
      .card { background: #27272a; border-color: #e4e4e7; }
      .card-shadow { box-shadow: 5px 5px 0px #e4e4e7; }
      .btn {
        background: #18181b; color: #fafafa; border-color: #e4e4e7;
        box-shadow: 4px 4px 0px #e4e4e7;
      }
      .btn:hover { box-shadow: 2px 2px 0px #e4e4e7; transform: translate(2px, 2px); }
      .btn:active { box-shadow: none; transform: translate(4px, 4px); }
      .btn-outline { background: #27272a; color: #e4e4e7; border-color: #e4e4e7; }
      .muted { color: #a1a1aa; }
      .domain-tag { background: #3f3f46; color: #a1a1aa; border-color: #e4e4e7; }
      .countdown-ring { stroke: #a1a1aa; }
      .countdown-ring-active { stroke: #10b981; }
      .info-box { background: #3f3f46; border-color: #e4e4e7; }
    }

    .card {
      background: white;
      border: 2px solid #18181b;
      border-radius: 8px;
      padding: 2rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 5px 5px 0px #18181b;
      animation: slideUp 0.4s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .countdown-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 1.5rem 0;
      position: relative;
    }

    .countdown-svg {
      width: 80px;
      height: 80px;
      transform: rotate(-90deg);
    }

    .countdown-ring {
      fill: none;
      stroke: #d4d4d8;
      stroke-width: 4;
    }

    .countdown-ring-active {
      fill: none;
      stroke: #10b981;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: 226.2;
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 1s linear;
    }

    .countdown-number {
      position: absolute;
      font-size: 1.75rem;
      font-weight: 700;
      color: #10b981;
    }

    .message {
      font-size: 0.875rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .muted { color: #71717a; }

    .domain-tag {
      display: inline-block;
      background: #f4f4f5;
      border: 1.5px solid #18181b;
      border-radius: 6px;
      padding: 0.25rem 0.625rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: #52525b;
      margin: 0.5rem 0;
      word-break: break-all;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: 2px solid #18181b;
      border-radius: 6px;
      padding: 0.625rem 1.25rem;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.1s ease;
      background: #18181b;
      color: white;
      box-shadow: 4px 4px 0px #18181b;
    }

    .btn:hover {
      box-shadow: 2px 2px 0px #18181b;
      transform: translate(2px, 2px);
    }

    .btn:active {
      box-shadow: none;
      transform: translate(4px, 4px);
    }

    .btn-outline {
      background: white;
      color: #18181b;
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    .info-box {
      margin-top: 1.25rem;
      padding: 0.75rem;
      background: #f4f4f5;
      border: 1.5px solid #18181b;
      border-radius: 6px;
      font-size: 0.7rem;
      color: #71717a;
    }

    .info-box a {
      color: #10b981;
      text-decoration: none;
    }

    .info-box a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <!-- Icon -->
    <div style="margin-bottom: 0.75rem;">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    </div>

    <!-- Title -->
    <p class="message">
      Anda akan diarahkan ke website
    </p>

    <!-- Domain tag -->
    <div class="domain-tag">${domain}</div>

    <!-- Countdown -->
    <div class="countdown-wrapper">
      <svg class="countdown-svg" viewBox="0 0 80 80">
        <circle class="countdown-ring" cx="40" cy="40" r="36" />
        <circle id="progress-ring" class="countdown-ring-active" cx="40" cy="40" r="36" />
      </svg>
      <span id="countdown" class="countdown-number">10</span>
    </div>

    <p class="muted" style="font-size:0.75rem; margin-bottom:1.25rem;">
      dalam <span id="seconds-text">10</span> detik
    </p>

    <!-- Buttons -->
    <div class="btn-group">
      <a href="${longUrl}" class="btn" id="visit-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Kunjungi Sekarang
      </a>
      <a href="/" class="btn btn-outline">
        Kembali ke Beranda
      </a>
    </div>

    <!-- Info -->
    <div class="info-box">
      Link <strong>/${code}</strong> mengarah ke <a href="${longUrl}">${domain}</a>
    </div>
  </div>

  <script>
    (function() {
      var seconds = 10;
      var total = 10;
      var circumference = 2 * Math.PI * 36; // 226.2
      var ring = document.getElementById('progress-ring');
      var countdown = document.getElementById('countdown');
      var secondsText = document.getElementById('seconds-text');

      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = 0;

      function update() {
        seconds--;
        if (seconds < 0) seconds = 0;

        countdown.textContent = seconds;
        secondsText.textContent = seconds;

        var offset = circumference * (1 - seconds / total);
        ring.style.strokeDashoffset = offset;

        if (seconds <= 0) {
          window.location.href = ${JSON.stringify(longUrl)};
        }
      }

      setInterval(update, 1000);
    })();
  </script>
</body>
</html>`;
}
