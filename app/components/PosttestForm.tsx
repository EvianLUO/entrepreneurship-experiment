"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export type PosttestData = Record<string, string>;

type Props = {
  onSubmit: (data: PosttestData) => void;
  studyVersion?: "study1" | "study2";
  aiReasoner?: "on" | "off";
};

export const PosttestForm: React.FC<Props> = ({ onSubmit, studyVersion = "study1", aiReasoner = "off" }) => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  const [form, setForm] = useState<PosttestData>({});
  const [error, setError] = useState<string | null>(null);

  const items = t("posttest.questions");
  const taskInvolvementItems = t("posttest.taskInvolvement");
  const manipCheckItems = t("posttest.manipCheck");

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // 检查任务投入度
    for (let i = 1; i <= 4; i++) {
      if (!form[`task_involvement_${i}`]) {
        setError(t("posttest.error"));
        return;
      }
    }
    // 检查操纵检验
    for (let i = 1; i <= 2; i++) {
      if (!form[`manip_check_${i}`]) {
        setError(t("posttest.error"));
        return;
      }
    }
    // Study 2 需要检查可解释性操纵检验
    if (studyVersion === "study2") {
      for (let i = 3; i <= 4; i++) {
        if (!form[`manip_check_${i}`]) {
          setError(t("posttest.error"));
          return;
        }
      }
    }
    // 检查效果逻辑量表
    const itemsArray = Array.isArray(items) ? items : [];
    for (let i = 1; i <= itemsArray.length; i++) {
      const key = `B${i}`;
      if (!form[key]) {
        setError(t("posttest.error"));
        return;
      }
    }
    // 检查基本信息（B9、B10、B11）
    if (!form["B9"] || !form["B10"] || !form["B11"]) {
      setError(t("posttest.error"));
      return;
    }
    setError(null);
    onSubmit(form);
  };

  const itemsArray = Array.isArray(items) ? items : [];
  const taskInvolvementArray = Array.isArray(taskInvolvementItems) ? taskInvolvementItems : [];
  const manipCheckArray = Array.isArray(manipCheckItems) ? manipCheckItems : [];

  const renderLikert = (items: string[], prefix: string, showLabels: boolean = true) => {
    return (
      <div className="space-y-4">
        {items.map((label, idx) => {
          const key = `${prefix}${idx + 1}`;
          return (
            <div key={key} className="border rounded-md p-3 text-sm space-y-2">
              <div className="whitespace-pre-wrap">{label}</div>
              {showLabels && (
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{t("posttest.likert.stronglyDisagree")}</span>
                  <span>{t("posttest.likert.stronglyAgree")}</span>
                </div>
              )}
              <div className="flex gap-2 justify-between mt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <label
                    key={i}
                    className="flex flex-col items-center flex-1 cursor-pointer text-xs"
                  >
                    <input
                      type="radio"
                      name={key}
                      className="mb-1"
                      checked={form[key] === String(i + 1)}
                      onChange={() => handleChange(key, String(i + 1))}
                    />
                    <span>{i + 1}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <h2 className="text-xl font-semibold">{t("posttest.title")}</h2>

      {/* 任务投入度 */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("posttest.sectionTaskInvolvement")}</h3>
        <p className="text-sm text-gray-700">{t("posttest.taskInvolvementIntro")}</p>
        {renderLikert(taskInvolvementArray, "task_involvement_")}
      </section>

      {/* 操纵检验 */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("posttest.sectionManipCheck")}</h3>
        
        {/* 人机交互顺序操纵检验 */}
        <div className="border rounded-md p-3 text-sm space-y-2">
          <div className="font-medium mb-2">{t("posttest.manipCheckOrderTitle")}</div>
          <div className="mb-2">{manipCheckArray[0]}</div>
          <div className="grid grid-cols-2 gap-2">
            {(Array.isArray(t("posttest.manipCheckOrderOptions")) ? t("posttest.manipCheckOrderOptions") : []).map((opt: string) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="manip_check_1"
                  checked={form["manip_check_1"] === opt}
                  onChange={() => handleChange("manip_check_1", opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div className="whitespace-pre-wrap">{manipCheckArray[1]}</div>
          <div className="flex gap-2 justify-between mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <label
                key={i}
                className="flex flex-col items-center flex-1 cursor-pointer text-xs"
              >
                <input
                  type="radio"
                  name="manip_check_2"
                  className="mb-1"
                  checked={form["manip_check_2"] === String(i + 1)}
                  onChange={() => handleChange("manip_check_2", String(i + 1))}
                />
                <span>{i + 1}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{t("posttest.manipCheck2Min")}</span>
            <span>{t("posttest.manipCheck2Max")}</span>
          </div>
        </div>

        {/* AI可解释性操纵检验（仅Study 2） */}
        {studyVersion === "study2" && (
          <>
            <div className="border rounded-md p-3 text-sm space-y-2">
              <div className="font-medium mb-2">{t("posttest.manipCheckExplainTitle")}</div>
              <div className="whitespace-pre-wrap">{manipCheckArray[2]}</div>
              <div className="flex gap-2 justify-between mt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <label
                    key={i}
                    className="flex flex-col items-center flex-1 cursor-pointer text-xs"
                  >
                    <input
                      type="radio"
                      name="manip_check_3"
                      className="mb-1"
                      checked={form["manip_check_3"] === String(i + 1)}
                      onChange={() => handleChange("manip_check_3", String(i + 1))}
                    />
                    <span>{i + 1}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{t("posttest.manipCheck3Min")}</span>
                <span>{t("posttest.manipCheck3Max")}</span>
              </div>
            </div>

            <div className="border rounded-md p-3 text-sm space-y-2">
              <div className="whitespace-pre-wrap">{manipCheckArray[3]}</div>
              <div className="flex gap-2 justify-between mt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <label
                    key={i}
                    className="flex flex-col items-center flex-1 cursor-pointer text-xs"
                  >
                    <input
                      type="radio"
                      name="manip_check_4"
                      className="mb-1"
                      checked={form["manip_check_4"] === String(i + 1)}
                      onChange={() => handleChange("manip_check_4", String(i + 1))}
                    />
                    <span>{i + 1}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{t("posttest.manipCheck4Min")}</span>
                <span>{t("posttest.manipCheck4Max")}</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 效果逻辑量表 */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("posttest.sectionEffectuation")}</h3>
        <p className="text-sm text-gray-700">{t("posttest.description")}</p>
        <div className="space-y-4">
          {itemsArray.map((label, idx) => {
            const key = `B${idx + 1}`;
            // 解析题目，提取左右两端
            const parts = label.split(" —— ");
            const leftPart = parts[0]?.replace(/^\d+\.\s*/, "") || "";
            const rightPart = parts[1] || "";
            return (
              <div key={key} className="border rounded-md p-3 text-sm space-y-2">
                <div className="mb-2">
                  {parts.length > 1 ? (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">左侧：{leftPart}</div>
                      <div className="text-xs text-gray-600">右侧：{rightPart}</div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{label}</div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">1: {leftPart}</span>
                  <span className="font-medium">7: {rightPart}</span>
                </div>
                <div className="flex gap-2 justify-between mt-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <label
                      key={i}
                      className="flex flex-col items-center flex-1 cursor-pointer text-xs"
                    >
                      <input
                        type="radio"
                        name={key}
                        className="mb-1"
                        checked={form[key] === String(i + 1)}
                        onChange={() => handleChange(key, String(i + 1))}
                      />
                      <span>{i + 1}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 基本信息（从前测移到最后） */}
      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("posttest.sectionBasicInfo")}</h3>
        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>B9. {t("posttest.questionsBasic.B9")}</div>
          {(Array.isArray(t("posttest.options.gender")) ? t("posttest.options.gender") : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="B9"
                checked={form["B9"] === opt}
                onChange={() => handleChange("B9", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>B10. {t("posttest.questionsBasic.B10")}</div>
          {(Array.isArray(t("posttest.options.age")) ? t("posttest.options.age") : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="B10"
                checked={form["B10"] === opt}
                onChange={() => handleChange("B10", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>B11. {t("posttest.questionsBasic.B11")}</div>
          {(Array.isArray(t("posttest.options.education")) ? t("posttest.options.education") : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="B11"
                checked={form["B11"] === opt}
                onChange={() => handleChange("B11", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </section>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        onClick={handleSubmit}
        className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
      >
        {t("posttest.submit")}
      </button>
    </div>
  );
};
