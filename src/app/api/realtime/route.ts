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
      `https://api-faa.my.id/faa/webpilot?text=${encodeURIComponent(text.trim())}`,
      {
        headers: {
          "User-Agent": "TaoSite-Realtime",
        },
      }
    );

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("Webpilot API error:", errText);
      return NextResponse.json(
        { error: "Failed to fetch from web." },
        { status: 500 }
      );
    }

    const data = await apiRes.json();

    if (!data.status) {
      return NextResponse.json(
        { error: "Invalid response from API." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: data.result || "",
      source: data.source || [],
    });
  } catch (error) {
    console.error("Realtime error:", error);
    return NextResponse.json(
      { error: "Failed to fetch real-time data." },
      { status: 500 }
    );
  }
}
