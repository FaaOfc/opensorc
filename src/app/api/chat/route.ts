import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Read env vars inside handler (Vercel serverless compatible)
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
    const AI_MODEL = process.env.AI_MODEL || "google/gemini-2.0-flash-exp:free";

    const { userId, chatId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: "userId and message are required." },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create chat
    let chat;
    if (chatId) {
      chat = await db.chat.findUnique({
        where: { id: chatId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
      if (!chat || chat.userId !== userId) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    } else {
      chat = await db.chat.create({
        data: { userId, title: message.slice(0, 50) },
        include: { messages: true },
      });
    }

    // Save user message
    await db.message.create({
      data: { chatId: chat.id, role: "user", content: message },
    });

    // Get all messages for context
    const allMessages = await db.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "asc" },
    });

    // Call AI API
    let aiResponse: string;

    if (OPENROUTER_API_KEY) {
      const apiMessages = allMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nefusite.app",
            "X-Title": "NefuSite AI Chat",
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful AI assistant inside NefuSite. Be concise, friendly, and helpful. Use markdown formatting when appropriate.",
              },
              ...apiMessages,
            ],
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("OpenRouter error:", err);
        aiResponse = "Maaf, AI sedang tidak tersedia. Coba lagi nanti.";
      } else {
        const data = await res.json();
        aiResponse =
          data.choices?.[0]?.message?.content ||
          "Maaf, tidak ada respons dari AI.";
      }
    } else {
      aiResponse = `**Demo Mode** — Set OPENROUTER_API_KEY di .env untuk mengaktifkan AI.\n\nPesan kamu: "${message}"\n\nUntuk setup:\n1. Daftar di openrouter.ai\n2. Dapatkan API key\n3. Tambahkan OPENROUTER_API_KEY ke .env`;
    }

    // Save AI response
    await db.message.create({
      data: { chatId: chat.id, role: "assistant", content: aiResponse },
    });

    return NextResponse.json({
      chatId: chat.id,
      role: "assistant",
      content: aiResponse,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesan." },
      { status: 500 }
    );
  }
}
