"use client";

import React, { useEffect, useRef, useState } from "react";
import { AIChat, ChatTurn } from "./AIChat";
import { ScenarioSection, ScenarioType } from "./ScenarioSection";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export type TaskResult = {
  preliminary_plan?: string;
  final_plan: string;
  chat_log: ChatTurn[];
  phase1_duration?: number;
  phase2_duration?: number;
};

type Props = {
  condition: "ai_first" | "human_first";
  scenarioType: ScenarioType;
  onComplete: (result: TaskResult) => void;
};

export const TaskPage: React.FC<Props> = ({
  condition,
  scenarioType,
  onComplete,
}) => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  
  const [phase, setPhase] = useState<1 | 2 | 3>(
    condition === "ai_first" ? 2 : 1
  );
  const [preliminary, setPreliminary] = useState("");
  const [finalPlan, setFinalPlan] = useState("");
  const [chatLog, setChatLog] = useState<ChatTurn[]>([]);

  const phase1Start = useRef<number | null>(null);
  const phase2Start = useRef<number | null>(null);
  const [phase1Duration, setPhase1Duration] = useState<number | undefined>();
  const [phase2Duration, setPhase2Duration] = useState<number | undefined>();

  useEffect(() => {
    const now = Date.now();
    if (condition === "human_first") {
      phase1Start.current = now;
    } else {
      phase2Start.current = now;
    }
  }, [condition]);

  const handlePhase1Submit = () => {
    if (!preliminary.trim()) return;
    if (phase1Start.current) {
      setPhase1Duration(Math.round((Date.now() - phase1Start.current) / 1000));
    }
    setFinalPlan(preliminary);
    setPhase(2);
    phase2Start.current = Date.now();
  };

  const handleFinalSubmit = () => {
    if (!finalPlan.trim()) return;
    if (phase2Start.current) {
      setPhase2Duration(Math.round((Date.now() - phase2Start.current) / 1000));
    }
    onComplete({
      preliminary_plan: condition === "human_first" ? preliminary : undefined,
      final_plan: finalPlan,
      chat_log: chatLog,
      phase1_duration: phase1Duration,
      phase2_duration: phase2Duration,
    });
    setPhase(3);
  };

  const getItems = () => {
    const items = t("task.aiFirst.items");
    if (Array.isArray(items)) {
      return items;
    }
    return lang === "zh"
      ? [
          "是否推出这个功能，为什么？",
          "如果推出，您的具体计划是什么（包括定价、推广策略、时间安排等）？",
          "您如何应对可能的风险？",
        ]
      : [
          "Whether to launch this feature, and why?",
          "If launching, what is your specific plan (including pricing, promotion strategy, timeline, etc.)?",
          "How will you address potential risks?",
        ];
  };

  const renderInstruction = () => {
    if (condition === "ai_first") {
      return (
        <div className="space-y-2 text-sm text-gray-800">
          <p>{t("task.aiFirst.instruction")}</p>
          <p>{t("task.aiFirst.aiHelp")}</p>
          <p>{t("task.aiFirst.writePlan")}</p>
          <ol className="list-decimal pl-5 space-y-1">
            {getItems().map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
          <p>{t("task.aiFirst.noTimeLimit")}</p>
        </div>
      );
    }

    if (phase === 1) {
      return (
        <div className="space-y-2 text-sm text-gray-800">
          <p>{t("task.aiFirst.instruction")}</p>
          <p>{t("task.humanFirst.phase1.thinkFirst")}</p>
          <ol className="list-decimal pl-5 space-y-1">
            {getItems().map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
          <p>{t("task.humanFirst.phase1.noTimeLimit")}</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 text-sm text-gray-800">
        <p>{t("task.humanFirst.phase2.preliminaryShown")}</p>
        <p>{t("task.humanFirst.phase2.aiHelp")}</p>
        <p>{t("task.humanFirst.phase2.submit")}</p>
      </div>
    );
  };

  if (phase === 3) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("task.taskSubmitted")}</h2>
        <p className="text-sm text-gray-700">{t("task.continuePosttest")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScenarioSection type={scenarioType} />

      <div className="border rounded-md p-4 bg-white space-y-3">
        <div className="font-semibold">{t("task.title")}</div>
        {renderInstruction()}
      </div>

      {condition === "ai_first" || phase === 2 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
          <AIChat onChatLogChange={setChatLog} useReasoner={false} />
          <div className="flex flex-col h-full">
            <div className="font-semibold mb-2">{t("task.planEditor")}</div>
            <textarea
              className="flex-1 border rounded-md px-3 py-2 text-sm min-h-[300px] resize-vertical"
              placeholder={
                lang === "zh"
                  ? "请在此撰写您的决策方案..."
                  : "Please write your decision plan here..."
              }
              value={finalPlan}
              onChange={(e) => setFinalPlan(e.target.value)}
            />
            <button
              onClick={handleFinalSubmit}
              disabled={!finalPlan.trim()}
              className="mt-3 self-end px-6 py-2 rounded-md bg-blue-600 text-white text-sm disabled:bg-gray-300 disabled:text-gray-600 hover:bg-blue-700 transition-colors"
            >
              {t("task.submitFinal")}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="font-semibold">{t("task.preliminaryEditor")}</div>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[300px] resize-vertical"
            placeholder={
              lang === "zh"
                ? "请在此撰写您的初步方案..."
                : "Please write your preliminary plan here..."
            }
            value={preliminary}
            onChange={(e) => setPreliminary(e.target.value)}
          />
          <button
            onClick={handlePhase1Submit}
            disabled={!preliminary.trim()}
            className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm disabled:bg-gray-300 disabled:text-gray-600 hover:bg-blue-700 transition-colors"
          >
            {t("task.submitPreliminary")}
          </button>
        </div>
      )}
    </div>
  );
};
