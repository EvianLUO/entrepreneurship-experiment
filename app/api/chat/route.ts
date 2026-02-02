import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const API_KEY = "sk-a4f7b39761b84aee8bfff2bd5897ae7c";
const BASE_URL = "https://api.deepseek.com";

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, useReasoner } = await req.json();

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
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
