import { NextRequest, NextResponse } from "next/server";

// POST — AI Waifu roleplay chat
// Body: { prompt: string (character/persona), query: string (user message) }
export async function POST(request: NextRequest) {
  try {
    const { prompt, query } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt (character definition) is required." },
        { status: 400 }
      );
    }

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "query (user message) is required." },
        { status: 400 }
      );
    }

    const url = `https://api-faa.my.id/faa/ai-promt?prompt=${encodeURIComponent(prompt)}&query=${encodeURIComponent(query)}`;

    const res = await fetch(url);

    if (!res.ok) {
      const err = await res.text();
      console.error("AI-Waifu API error:", err);
      return NextResponse.json(
        { error: `AI Waifu error: ${err.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.status || !data.result?.response) {
      return NextResponse.json(
        { error: "Tidak ada respons dari AI Waifu." },
        { status: 502 }
      );
    }

    return NextResponse.json({ content: data.result.response });
  } catch (error: unknown) {
    console.error("AI-Waifu error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal memproses pesan: ${msg}` },
      { status: 500 }
    );
  }
      }
