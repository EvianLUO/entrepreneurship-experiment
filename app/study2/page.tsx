"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ProgressBar } from "@/app/components/ProgressBar";
import { WelcomeConsent } from "@/app/components/WelcomeConsent";
import { PretestForm, PretestData } from "@/app/components/PretestForm";
import { TaskPageNew, TaskResult } from "@/app/components/TaskPageNew";
import { PosttestForm, PosttestData } from "@/app/components/PosttestForm";
import { ThankYou } from "@/app/components/ThankYou";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

const TOTAL_STEPS = 6;

const STORAGE_KEY = "entre-exp-study2";

type LocalState = {
  participant_id: string;
  step: number;
  interaction_order: "human_first" | "ai_first";
  ai_reasoner: "on" | "off";
};

export default function Study2Page() {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  
  const [localState, setLocalState] = useState<LocalState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setShowResumePrompt(true);
          setLocalState(parsed);
          setLoading(false);
        } catch (e) {
          console.error("Failed to parse stored state", e);
          await initNewParticipant();
        }
      } else {
        await initNewParticipant();
      }
    };
    
    initialize();
  }, []);

  const initNewParticipant = async () => {
    setLoading(true);
    try {
      console.log("Initializing new participant...");
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ study_version: "study2" }),
      });
      
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error response:", errorText);
        const currentLang = typeof window !== "undefined" ? (localStorage.getItem("language") || "zh") : "zh";
        alert(currentLang === "zh" ? "创建参与者失败，请刷新页面重试" : "Failed to create participant, please refresh and retry");
        setLoading(false);
        return;
      }
      
      const json = await res.json();
      console.log("API response:", json);
      
      if (json.error) {
        console.error("Failed to create participant:", json.error);
        const currentLang = typeof window !== "undefined" ? (localStorage.getItem("language") || "zh") : "zh";
        alert(currentLang === "zh" ? "创建参与者失败，请刷新页面重试" : "Failed to create participant, please refresh and retry");
        setLoading(false);
        return;
      }
      const participant = json.participant;
      if (!participant) {
        console.error("No participant data returned");
        setLoading(false);
        return;
      }
      console.log("Participant created:", participant);
      const state: LocalState = {
        participant_id: participant.participant_id ?? uuidv4(),
        step: 1,
        interaction_order: participant.interaction_order || "human_first",
        ai_reasoner: participant.ai_reasoner || "off",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      console.log("Setting local state:", state);
      setLocalState(state);
      setLoading(false);
    } catch (e) {
      console.error("Error initializing participant:", e);
        alert(t("common.error") + ": " + (lang === "zh" ? "初始化失败，请刷新页面重试" : "Initialization failed, please refresh and retry"));
      setLoading(false);
    }
  };

  const handleResumeChoice = (resume: boolean) => {
    setShowResumePrompt(false);
    if (!resume) {
      localStorage.removeItem(STORAGE_KEY);
      initNewParticipant();
    }
  };

  const updateStep = (step: number) => {
    setLocalState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, step };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handlePretestSubmit = async (data: PretestData) => {
    if (!localState) return;
    try {
      const res = await fetch("/api/pretest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: localState.participant_id,
          data,
        }),
      });
      if (!res.ok) {
        console.error("Failed to save pretest data");
        alert(t("common.error") + ": " + (lang === "zh" ? "保存数据失败，请重试" : "Failed to save data, please retry"));
        return;
      }
      updateStep(3);
    } catch (e) {
      console.error("Error saving pretest:", e);
      alert(lang === "zh" ? "保存数据失败，请重试" : "Failed to save data, please retry");
    }
  };

  const handleTaskComplete = async (result: TaskResult) => {
    if (!localState) return;
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: localState.participant_id,
          result,
        }),
      });
      if (!res.ok) {
        console.error("Failed to save task data");
        alert(t("common.error") + ": " + (lang === "zh" ? "保存数据失败，请重试" : "Failed to save data, please retry"));
        return;
      }
      updateStep(5);
    } catch (e) {
      console.error("Error saving task:", e);
      alert(lang === "zh" ? "保存数据失败，请重试" : "Failed to save data, please retry");
    }
  };

  const handlePosttestSubmit = async (data: PosttestData) => {
    if (!localState) return;
    try {
      const res = await fetch("/api/posttest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: localState.participant_id,
          data,
        }),
      });
      if (!res.ok) {
        console.error("Failed to save posttest data");
        alert(t("common.error") + ": " + (lang === "zh" ? "保存数据失败，请重试" : "Failed to save data, please retry"));
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      updateStep(6);
    } catch (e) {
      console.error("Error saving posttest:", e);
      alert(lang === "zh" ? "保存数据失败，请重试" : "Failed to save data, please retry");
    }
  };

  if (loading || !localState) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-sm">{t("study.loading")}</div>
      </main>
    );
  }

  if (showResumePrompt) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full border rounded-lg p-6 bg-white space-y-4 text-sm">
          <div className="font-semibold text-base">{t("study.unfinished")}</div>
          <p>{t("study.unfinishedMessage")}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleResumeChoice(false)}
              className="px-4 py-2 rounded-md border text-gray-700 text-sm hover:bg-gray-50 transition-colors"
            >
              {t("study.startOver")}
            </button>
            <button
              onClick={() => handleResumeChoice(true)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
            >
              {t("study.continue")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { step, interaction_order, ai_reasoner } = localState;

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-semibold">{t("study.study2")}</div>
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              <div>
                {t("study.interactionOrder")}
                {interaction_order === "ai_first" ? t("study.aiFirst") : t("study.humanFirst")}
              </div>
              <div>
                {t("study.aiReasoning")}
                {ai_reasoner === "on" ? t("study.on") : t("study.off")}
              </div>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <WelcomeConsent
            onNext={() => {
              updateStep(2);
            }}
          />
        )}

        {step === 2 && <PretestForm onSubmit={handlePretestSubmit} />}

        {step === 3 && (
          <TaskPageNew
            interaction_order={interaction_order}
            ai_reasoner={ai_reasoner}
            scenarioType="study2-high"
            onComplete={handleTaskComplete}
          />
        )}

        {step === 5 && <PosttestForm onSubmit={handlePosttestSubmit} />}

        {step === 6 && <ThankYou />}
      </div>
    </main>
  );
}
