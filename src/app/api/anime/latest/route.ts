import { NextResponse } from "next/server";
import { animeConfig } from "@/lib/config";

export async function GET() {
  try {
    const res = await fetch(`${animeConfig.baseUrl}/latest`, {
      headers: { "User-Agent": "TaoSite-Anime" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch latest anime." },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal mengambil data: ${msg}` },
      { status: 500 }
    );
  }
}
