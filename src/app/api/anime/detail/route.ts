import { NextRequest, NextResponse } from "next/server";
import { animeConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    let urlId = request.nextUrl.searchParams.get("urlId");

    if (!urlId) {
      return NextResponse.json(
        { error: "urlId diperlukan." },
        { status: 400 }
      );
    }

    // Ensure trailing slash
    if (!urlId.endsWith("/")) {
      urlId += "/";
    }

    const res = await fetch(
      `${animeConfig.baseUrl}/detail?urlId=${encodeURIComponent(urlId)}`,
      {
        headers: { "User-Agent": "TaoSite-Anime" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil detail anime." },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal mengambil detail: ${msg}` },
      { status: 500 }
    );
  }
}
