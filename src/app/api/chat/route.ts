import { NextRequest, NextResponse } from "next/server";

const FREE_MODELS = [
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash" },
  { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B" },
  { id: "qwen/qwen-2.5-7b-instruct:free", name: "Qwen 2.5 7B" },
  { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1" },
];

// GET — list available models
export async function GET() {
  return NextResponse.json({ models: FREE_MODELS });
}

// POST — send message
export async function POST(request: NextRequest) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

    const { messages, model } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required." },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: "Set OPENROUTER_API_KEY di .env untuk mengaktifkan AI.",
          demo: true,
        },
        { status: 200 }
      );
    }

    const selectedModel = model || "google/gemini-2.0-flash-exp:free";

    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nefusite.app",
          "X-Title": "Tao-Site AI Chat",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant inside Tao-Site. Be concise, friendly, and helpful. Use markdown formatting when appropriate.",
            },
            ...messages,
          ],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenRouter error:", err);
      return NextResponse.json(
        { error: `AI error: ${err.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content =
      data.choices?.[0]?.message?.content ||
      "Maaf, tidak ada respons dari AI.";

    return NextResponse.json({ content, model: selectedModel });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal memproses pesan: ${msg}` },
      { status: 500 }
    );
  }
}
