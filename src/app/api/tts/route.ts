import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    const apiRes = await fetch(
      `https://api-faa.my.id/faa/tts-legkap?text=${encodeURIComponent(text.trim())}`,
      {
        headers: {
          "User-Agent": "TaoSite-TTS",
        },
      }
    );

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("TTS API error:", errText);
      return NextResponse.json(
        { error: "Failed to generate speech." },
        { status: 500 }
      );
    }

    const data = await apiRes.json();

    if (!data.status || !data.result) {
      return NextResponse.json(
        { error: "Invalid response from TTS API." },
        { status: 500 }
      );
    }

    // Filter out results with errors, return only successful ones
    const voices = data.result
      .filter((v: { error?: string }) => !v.error)
      .map((v: { model: string; voice_name: string; voice_id: string; channel_id: number; url: string }) => ({
        model: v.model,
        voiceName: v.voice_name,
        url: v.url,
      }));

    return NextResponse.json({ text: data.text, voices });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech." },
      { status: 500 }
    );
  }
}
