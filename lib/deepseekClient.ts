"use client";

// 客户端不再直接调用 OpenAI，而是通过 API 路由

export type DeepSeekMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type DeepSeekClientOptions = {
  onMessage: (content: string) => void;
  onReasoning?: (reasoning: string) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
  useReasoner?: boolean;
};

export async function sendDeepSeekChat(
  messages: DeepSeekMessage[],
  { onMessage, onReasoning, onClose, onError, useReasoner = false }: DeepSeekClientOptions
) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        useReasoner,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "reasoning" && data.content) {
              onReasoning?.(data.content);
            } else if (data.type === "content" && data.content) {
              onMessage(data.content);
            } else if (data.type === "done") {
              onClose?.();
              return;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    onClose?.();
  } catch (error) {
    console.error("DeepSeek chat error:", error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}
