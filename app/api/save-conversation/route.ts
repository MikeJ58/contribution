import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const conversationId = BigInt(Date.now());  // Use BigInt to match schema

    // Save each message in the conversation to the database
    const savedMessages = await Promise.all(
      messages.map((message) => {
        return prisma.conversation.create({
          data: {
            conversationId: conversationId,  // Store as BigInt
            role: message.role,
            content: message.content,
          },
        });
      })
    );

    // Avoid including BigInt in JSON response, or convert it safely
    const sanitizedSavedMessages = savedMessages.map(message => ({
      ...message,
      conversationId: String(message.conversationId),  // Convert to string for JSON
    }));

    return NextResponse.json({ message: 'Conversation saved successfully', savedMessages: sanitizedSavedMessages });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
