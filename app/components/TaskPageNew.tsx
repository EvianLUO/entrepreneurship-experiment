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
  interaction_order: "human_first" | "ai_first";
  ai_reasoner: "on" | "off";
  scenarioType: ScenarioType;
  onComplete: (result: TaskResult) => void;
};

export const TaskPageNew: React.FC<Props> = ({
  interaction_order,
  ai_reasoner,
  scenarioType,
  onComplete,
}) => {
  const { lang } = useLanguage();
  const t = (key: string) => {
    const value = getTranslation(lang, key);
    return value ?? key;
  };

  // Human First: 阶段1 = 独立填写，阶段2 = 看AI建议后修改
  // AI First: 阶段1 = 直接显示AI，阶段2 = 填写方案（实际上可以合并）
  const [phase, setPhase] = useState<1 | 2 | 3>(
    interaction_order === "ai_first" ? 2 : 1
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
    if (interaction_order === "human_first") {
      phase1Start.current = now;
    } else {
      phase2Start.current = now;
    }
  }, [interaction_order]);

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
    const phase2Dur =
      phase2Start.current != null
        ? Math.round((Date.now() - phase2Start.current) / 1000)
        : undefined;
    if (phase2Start.current != null) {
      setPhase2Duration(phase2Dur);
    }
    onComplete({
      preliminary_plan: interaction_order === "human_first" ? preliminary : undefined,
      final_plan: finalPlan,
      chat_log: chatLog,
      phase1_duration: phase1Duration,
      phase2_duration: phase2Dur,
    });
    setPhase(3);
  };

  const getItems = () => {
    const items = t("task.aiFirst.items");
    if (Array.isArray(items)) {
      return items;
    }
    // 默认值
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
    if (interaction_order === "ai_first") {
      // AI First: 直接显示AI助手和方案编辑框
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

    // Human First
    if (phase === 1) {
      // 阶段1：独立填写
      return (
        <div className="space-y-2 text-sm text-gray-800">
          <p>{t("task.aiFirst.instruction")}</p>
          <p>
            {lang === "zh"
              ? "请您先独立思考这个决策问题，在下方文本框中撰写您的初步方案，包括："
              : "Please first think independently about this decision problem and write your preliminary plan in the text box below, including:"}
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            {getItems().map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
          <p>
            {lang === "zh"
              ? "没有时间限制，完成后点击提交，进入下一阶段。"
              : "There is no time limit. Click submit when finished to proceed to the next phase."}
          </p>
        </div>
      );
    }

    // 阶段2：看AI建议后修改
    return (
      <div className="space-y-2 text-sm text-gray-800">
        <p>
          {lang === "zh"
            ? "您的初步方案已显示在右侧。"
            : "Your preliminary plan is shown on the right."}
        </p>
        <p>
          {lang === "zh"
            ? "现在您可以使用左侧的 AI 助手来获取更多信息和建议。您可以根据 AI 的反馈修改您的方案，也可以保持原方案不变。"
            : "Now you can use the AI assistant on the left to get more information and suggestions. You can modify your plan based on AI feedback or keep your original plan unchanged."}
        </p>
        <p>
          {lang === "zh"
            ? "修改完成后，请提交您的最终方案。"
            : "After making modifications, please submit your final plan."}
        </p>
      </div>
    );
  };

  if (phase === 3) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {lang === "zh" ? "任务已提交" : "Task Submitted"}
        </h2>
        <p className="text-sm text-gray-700">
          {lang === "zh"
            ? "感谢您的认真作答，请点击页面下方按钮继续完成后测问卷。"
            : "Thank you for your careful responses. Please click the button below to continue with the post-test questionnaire."}
        </p>
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

      {interaction_order === "ai_first" || phase === 2 ? (
        // AI First 或 Human First 的阶段2：显示AI助手和方案编辑
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
          <AIChat
            onChatLogChange={setChatLog}
            useReasoner={ai_reasoner === "on"}
          />
          <div className="flex flex-col h-full">
            <div className="font-semibold mb-2">{t("task.planEditor")}</div>
            {interaction_order === "human_first" && phase === 2 && (
              <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                {lang === "zh"
                  ? "您的初步方案："
                  : "Your preliminary plan:"}
                <div className="mt-1 text-gray-800 whitespace-pre-wrap">
                  {preliminary}
                </div>
              </div>
            )}
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
        // Human First 的阶段1：只显示方案编辑
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
