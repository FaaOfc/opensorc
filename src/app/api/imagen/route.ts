import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt diperlukan." },
        { status: 400 }
      );
    }

    const apiUrl = `https://api-faa.my.id/faa/ai-text2img-pro?prompt=${encodeURIComponent(prompt)}`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      const err = await res.text();
      console.error("AI Image API error:", err);
      return NextResponse.json(
        { error: `API error: ${err.slice(0, 300)}` },
        { status: 502 }
      );
    }

    // The API returns the image directly
    const contentType = res.headers.get("content-type") || "";

    if (contentType.startsWith("image/")) {
      // Return as base64
      const buffer = Buffer.from(await res.arrayBuffer());
      const base64 = buffer.toString("base64");
      return NextResponse.json({
        image: `data:${contentType};base64,${base64}`,
      });
    }

    // Maybe JSON response
    const data = await res.json();
    if (data.image || data.url || data.result) {
      return NextResponse.json({
        image: data.image || data.url || data.result,
      });
    }

    return NextResponse.json(
      { error: "Tidak ada gambar dari API." },
      { status: 502 }
    );
  } catch (error: unknown) {
    console.error("AI Image error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal memproses: ${msg}` },
      { status: 500 }
    );
  }
}
