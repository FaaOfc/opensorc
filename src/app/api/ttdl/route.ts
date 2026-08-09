import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { status: false, message: "URL parameter is required." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://adalahpokoknya-khaki.vercel.app/download/tiktok?url=${encodeURIComponent(url)}`,
      {
        headers: {
          "User-Agent": "NefuSite/1.0",
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("TikTok download error:", error);
    return NextResponse.json(
      { status: false, message: "Gagal mengambil data dari server TikTok." },
      { status: 500 }
    );
  }
}
