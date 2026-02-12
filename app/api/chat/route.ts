import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const API_KEY = process.env.DEEPSEEK_API_KEY || "sk-e363c4fc6e5848a8b5e1b82c39fdd32a";
const BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

function getClient() {
  if (!API_KEY || API_KEY.length < 10) {
    throw new Error("DEEPSEEK_API_KEY is not set or invalid");
  }
  return new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = body?.messages ?? [];
    const useReasoner = !!body?.useReasoner;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid messages" },
        { status: 400 }
      );
    }

    const client = getClient();
    const model = useReasoner ? "deepseek-reasoner" : "deepseek-chat";

    const stream = await client.chat.completions.create({
      model,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    // 创建 ReadableStream 来流式传输响应
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let reasoningContent = "";
          let finalContent = "";

          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;

            if (!delta) continue;

            // 处理思考过程（deepseek-reasoner 模型）
            const deltaAny = delta as any;
            if (deltaAny.reasoning_content) {
              reasoningContent += deltaAny.reasoning_content;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "reasoning", content: reasoningContent })}\n\n`
                )
              );
            }

            // 处理最终回答
            if (delta.content) {
              finalContent += delta.content;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "content", content: finalContent })}\n\n`
                )
              );
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; error?: { message?: string } };
    const message = err?.error?.message ?? err?.message ?? String(error);
    console.error("Chat API error:", message, error);
    return NextResponse.json(
      { error: "Failed to process chat request", details: message },
      { status: 500 }
    );
  }
}
