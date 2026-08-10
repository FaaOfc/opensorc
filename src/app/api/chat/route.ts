import { NextRequest, NextResponse } from "next/server";

const MODELS = [
  { id: "openai/gpt-5.5", name: "GPT-5.5", group: "OpenAI" },
  { id: "openai/gpt-5.4", name: "GPT-5.4", group: "OpenAI" },
  { id: "openai/gpt-5.3-chat", name: "GPT-5.3 Chat", group: "OpenAI" },
  { id: "openai/gpt-5.1-instant", name: "GPT-5.1 Instant", group: "OpenAI" },
  { id: "openai/gpt-5", name: "GPT-5", group: "OpenAI" },
  { id: "openai/gpt-4o", name: "GPT-4o", group: "OpenAI" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", group: "OpenAI" },
  { id: "xai/grok-4.1-fast-non-reasoning", name: "Grok 4.1 Fast", group: "xAI" },
  { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5", group: "Anthropic" },
  { id: "anthropic/claude-sonnet-4.6", name: "Claude Sonnet 4.6", group: "Anthropic" },
  { id: "anthropic/claude-opus-4.5", name: "Claude Opus 4.5", group: "Anthropic" },
  { id: "anthropic/claude-opus-4.6", name: "Claude Opus 4.6", group: "Anthropic" },
  { id: "anthropic/claude-opus-4.7", name: "Claude Opus 4.7", group: "Anthropic" },
  { id: "anthropic/claude-opus-4.8", name: "Claude Opus 4.8", group: "Anthropic" },
  { id: "anthropic/claude-fable-5", name: "Claude Fable 5", group: "Anthropic" },
  { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro", group: "DeepSeek" },
  { id: "deepseek/deepseek-v4-flash", name: "DeepSeek V4 Flash", group: "DeepSeek" },
  { id: "deepseek/deepseek-v3.2-thinking", name: "DeepSeek V3.2 Think", group: "DeepSeek" },
  { id: "google/gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", group: "Google" },
  { id: "google/gemini-3-pro-preview", name: "Gemini 3 Pro", group: "Google" },
  { id: "google/gemini-3.1-flash-lite", name: "Gemini 3.1 Flash", group: "Google" },
  { id: "alibaba/qwen3-max", name: "Qwen3 Max", group: "Alibaba" },
  { id: "meta/llama-4-maverick", name: "Llama 4 Maverick", group: "Meta" },
  { id: "moonshotai/kimi-k2.6", name: "Kimi K2.6", group: "Moonshot" },
];

// GET — list available models
export async function GET() {
  return NextResponse.json({ models: MODELS });
}

// POST — send message via chatday API
export async function POST(request: NextRequest) {
  try {
    const { messages, model } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required." },
        { status: 400 }
      );
    }

    const selectedModel = model || "openai/gpt-5.5";

    // Build conversation context as a single prompt string
    // Format: [system] then each message with role prefix
    const systemPrompt =
      "You are a helpful AI assistant inside TaoSite. Be concise, friendly, and helpful. Use markdown formatting when appropriate.";

    const parts: string[] = [`[System]: ${systemPrompt}`];
    for (const msg of messages) {
      const prefix = msg.role === "user" ? "[User]" : "[Assistant]";
      parts.push(`${prefix}: ${msg.content}`);
    }
    parts.push("[Assistant]:");
    const fullPrompt = parts.join("\n\n");

    // Call the chatday endpoint
    const url = `https://api-faa.my.id/faa/chatdayai?prompt=${encodeURIComponent(fullPrompt)}&model=${encodeURIComponent(selectedModel)}`;

    const res = await fetch(url);

    if (!res.ok) {
      const err = await res.text();
      console.error("Chatday API error:", err);
      return NextResponse.json(
        { error: `AI error: ${err.slice(0, 300)}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.status || !data.response) {
      return NextResponse.json(
        { error: data.response || "Tidak ada respons dari AI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ content: data.response, model: selectedModel });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal memproses pesan: ${msg}` },
      { status: 500 }
    );
  }
}
