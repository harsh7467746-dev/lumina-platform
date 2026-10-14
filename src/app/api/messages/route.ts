import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory fallback cache so real-time chat works even before Prisma channels are seeded in DB
const memoryMessages: Record<string, any[]> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId") || "chan_1";

    // Try DB first if channel exists
    try {
      const dbMessages = await prisma.message.findMany({
        where: {
          OR: [{ channelId: roomId }, { conversationId: roomId }],
        },
        include: {
          sender: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
          reactions: true,
        },
        orderBy: { createdAt: "asc" },
        take: 50,
      });

      if (dbMessages && dbMessages.length > 0) {
        return NextResponse.json({
          success: true,
          data: {
            messages: dbMessages.map((m) => ({
              id: m.id,
              senderName: m.sender.displayName || m.sender.username,
              senderAvatar: (m.sender.displayName || m.sender.username).slice(0, 2).toUpperCase(),
              content: m.content,
              timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isSelf: false,
              reactions: m.reactions.map((r) => ({ emoji: r.emoji, count: 1, hasReacted: false })),
            })),
          },
        });
      }
    } catch {
      // Fallback to memory
    }

    return NextResponse.json({
      success: true,
      data: {
        messages: memoryMessages[roomId] || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch messages" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, content, senderName, senderAvatar, isSelf, attachment } = body;

    if (!content?.trim() || !roomId) {
      return NextResponse.json(
        { success: false, error: { message: "Content and roomId are required." } },
        { status: 400 }
      );
    }

    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      senderName: senderName || "Guest",
      senderAvatar: senderAvatar || "GU",
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: isSelf ?? false,
      attachment: attachment || null,
      reactions: [],
      createdAt: new Date().toISOString(),
    };

    if (!memoryMessages[roomId]) {
      memoryMessages[roomId] = [];
    }
    memoryMessages[roomId].push(newMsg);

    // Keep last 100 messages per room
    if (memoryMessages[roomId].length > 100) {
      memoryMessages[roomId].shift();
    }

    return NextResponse.json({
      success: true,
      data: { message: newMsg },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: "Failed to post message" } },
      { status: 500 }
    );
  }
}
