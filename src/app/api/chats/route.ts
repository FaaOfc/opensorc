import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/chats?userId=xxx — list all chats for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const chats = await db.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  });

  return NextResponse.json({ chats });
}

// DELETE /api/chats?chatId=xxx
export async function DELETE(request: NextRequest) {
  const chatId = request.nextUrl.searchParams.get("chatId");
  const userId = request.nextUrl.searchParams.get("userId");

  if (!chatId || !userId) {
    return NextResponse.json(
      { error: "chatId and userId are required" },
      { status: 400 }
    );
  }

  const chat = await db.chat.findUnique({ where: { id: chatId } });
  if (!chat || chat.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.chat.delete({ where: { id: chatId } });

  return NextResponse.json({ success: true });
}
