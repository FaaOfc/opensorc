import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, from, to } = await request.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Teks diperlukan untuk diterjemahkan." },
        { status: 400 }
      );
    }

    if (!to || typeof to !== "string") {
      return NextResponse.json(
        { error: "Bahasa tujuan diperlukan." },
        { status: 400 }
      );
    }

    const fromLabel = from || "auto-detect";
    const systemPrompt = `You are a professional translator. Translate the following text to ${to}. ${from ? `The source language is ${from}.` : "Auto-detect the source language."} Return ONLY the translated text, nothing else. Do not add explanations, notes, or quotation marks around the translation.`;

    const fullPrompt = `[System]: ${systemPrompt}\n\n[User]: ${text.trim()}\n\n[Assistant]:`;

    const model = "openai/gpt-5.1-instant";
    const url = `https://api-faa.my.id/faa/chatdayai?prompt=${encodeURIComponent(fullPrompt)}&model=${encodeURIComponent(model)}`;

    const res = await fetch(url);

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `API error: ${err.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.status || !data.response) {
      return NextResponse.json(
        { error: "Tidak ada respons dari AI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ translation: data.response.trim() });
  } catch (error: unknown) {
    console.error("Translate error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal menerjemahkan: ${msg}` },
      { status: 500 }
    );
  }
}
