"use client";

import React, { useState, useRef, useEffect } from "react";
import { sendDeepSeekChat, DeepSeekMessage } from "@/lib/deepseekClient";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  reasoning?: string; // 思考过程（仅深度思考模式）
  timestamp: string;
};

type Props = {
  onChatLogChange?: (log: ChatTurn[]) => void;
  useReasoner?: boolean; // 是否使用深度思考模式
};

export const AIChat: React.FC<Props> = ({ onChatLogChange, useReasoner = false }) => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentReasoning, setCurrentReasoning] = useState<string>("");
  const [showReasoning, setShowReasoning] = useState<Record<number, boolean>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, currentReasoning]);

  useEffect(() => {
    onChatLogChange?.(chatLog);
  }, [chatLog, onChatLogChange]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userTurn: ChatTurn = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newLog = [...chatLog, userTurn];
    setChatLog(newLog);
    setInput("");
    setLoading(true);
    setCurrentReasoning("");

    let assistantContent = "";
    let assistantTurn: ChatTurn | null = null;
    const turnIndex = newLog.length; // 当前assistant turn的索引

    abortControllerRef.current = new AbortController();

    await sendDeepSeekChat(
      newLog.map((t) => ({ role: t.role, content: t.content } as DeepSeekMessage)),
      {
        useReasoner,
        onMessage: (content) => {
          assistantContent = content;
          assistantTurn = {
            role: "assistant",
            content: assistantContent,
            reasoning: useReasoner && currentReasoning ? currentReasoning : undefined,
            timestamp: new Date().toISOString(),
          };
          const updated: ChatTurn[] = [...newLog, assistantTurn];
          setChatLog(updated);
        },
        onReasoning: (reasoning) => {
          if (useReasoner) {
            setCurrentReasoning(reasoning);
            if (assistantTurn) {
              assistantTurn.reasoning = reasoning;
              const updated: ChatTurn[] = [...newLog, assistantTurn];
              setChatLog(updated);
            }
          }
        },
        onClose: () => {
          setLoading(false);
          setCurrentReasoning("");
          abortControllerRef.current = null;
        },
        onError: () => {
          setLoading(false);
          setCurrentReasoning("");
          abortControllerRef.current = null;
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleReasoning = (index: number) => {
    setShowReasoning((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-white">
      <div className="font-semibold mb-2">
        {useReasoner ? t("task.aiAssistantReasoner") : t("task.aiAssistant")}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 text-sm min-h-[200px]">
        {chatLog.length === 0 && (
          <div className="text-gray-400 text-center mt-4">
            {t("task.aiPlaceholder")}
          </div>
        )}
        {chatLog.map((turn, idx) => (
          <div
            key={idx}
            className={`flex ${
              turn.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-[80%]">
              {turn.role === "assistant" && turn.reasoning && (
                <div className="mb-2">
                  <button
                    onClick={() => toggleReasoning(idx)}
                    className="text-xs text-blue-600 hover:text-blue-800 mb-1"
                  >
                    {showReasoning[idx] ? t("task.hideReasoning") : t("task.showReasoning")}
                  </button>
                  {showReasoning[idx] && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-gray-700 whitespace-pre-wrap mb-2">
                      <div className="font-semibold mb-1">{t("task.reasoning")}</div>
                      {turn.reasoning}
                    </div>
                  )}
                </div>
              )}
              <div
                className={`rounded-md px-3 py-2 whitespace-pre-wrap ${
                  turn.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {turn.content}
              </div>
            </div>
          </div>
        ))}
        {loading && currentReasoning && useReasoner && (
          <div className="mb-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-gray-700 whitespace-pre-wrap">
              <div className="font-semibold mb-1">{t("task.thinking")}</div>
              {currentReasoning}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <textarea
          className="flex-1 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] max-h-[100px] resize-none"
          placeholder={t("task.inputPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="h-[60px] px-4 rounded-md bg-blue-600 text-white text-sm disabled:bg-gray-300 disabled:text-gray-600 hover:bg-blue-700 transition-colors"
        >
          {loading ? t("task.generating") : t("task.send")}
        </button>
      </div>
    </div>
  );
};
