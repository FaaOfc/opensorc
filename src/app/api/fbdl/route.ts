import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL Facebook diperlukan." },
        { status: 400 }
      );
    }

    const apiUrl = `https://api-faa.my.id/faa/fbdownload?url=${encodeURIComponent(url)}`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      const err = await res.text();
      console.error("FB DL API error:", err);
      return NextResponse.json(
        { error: `API error: ${err.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.status || !data.result?.media) {
      return NextResponse.json(
        { error: "Gagal mengambil video. Pastikan URL valid." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      video_sd: data.result.media.video_sd || null,
      video_hd: data.result.media.video_hd || null,
    });
  } catch (error: unknown) {
    console.error("FB DL error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal memproses: ${msg}` },
      { status: 500 }
    );
  }
}
