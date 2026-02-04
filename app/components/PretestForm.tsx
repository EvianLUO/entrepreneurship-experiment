"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export type PretestData = Record<string, string | number>;

type Props = {
  onSubmit: (data: PretestData) => void;
};

export const PretestForm: React.FC<Props> = ({ onSubmit }) => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  const [form, setForm] = useState<PretestData>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const requiredKeys = [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "industry", // 行业
      "A6",
      "A7",
      "A8",
      "A12",
    ];
    // 如果选择了"其他"，需要填写具体行业
    if (form["industry"] === "其他（请注明）" && !form["industry_other"]) {
      setError("请注明具体行业");
      return;
    }
    // 检查GenAI依赖量表（G1-G12）
    for (let i = 1; i <= 12; i++) {
      requiredKeys.push(`G${i}`);
    }
    // 检查ESE量表（ese_1到ese_19）
    for (let i = 1; i <= 19; i++) {
      requiredKeys.push(`ese_${i}`);
    }
    // 检查AI素养量表（ai_literacy_1到ai_literacy_12）
    for (let i = 1; i <= 12; i++) {
      requiredKeys.push(`ai_literacy_${i}`);
    }
    for (const k of requiredKeys) {
      if (!form[k]) {
        setError(t("pretest.error"));
        return;
      }
    }
    setError(null);
    onSubmit(form);
  };

  const renderLikert = (prefix: string, items: string[], showLabels: boolean = true) => {
    const itemsArray = Array.isArray(items) ? items : [];
    return (
      <div className="space-y-4">
        {itemsArray.map((label, idx) => {
          const qKey = `${prefix}${idx + 1}`;
          return (
            <div key={qKey} className="border rounded-md p-3">
              <div className="mb-2 text-sm">{label}</div>
              {showLabels && (
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{t("pretest.likert.stronglyDisagree")}</span>
                <span>{t("pretest.likert.stronglyAgree")}</span>
              </div>
              )}
              <div className="flex gap-2 justify-between">
                {Array.from({ length: 7 }).map((_, i) => (
                  <label
                    key={i}
                    className="flex flex-col items-center flex-1 cursor-pointer text-xs"
                  >
                    <input
                      type="radio"
                      name={qKey}
                      className="mb-1"
                      checked={form[qKey] === String(i + 1)}
                      onChange={() => handleChange(qKey, String(i + 1))}
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

  const options = t("pretest.options");

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <h2 className="text-xl font-semibold">{t("pretest.title")}</h2>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("pretest.section1")}</h3>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A1. {t("pretest.questions.A1")}</div>
          <div className="grid grid-cols-2 gap-2">
            {(Array.isArray(options.ventureCount) ? options.ventureCount : []).map(
              (opt: string) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="A1"
                    checked={form["A1"] === opt}
                    onChange={() => handleChange("A1", opt)}
                  />
                  <span>{opt}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A2. {t("pretest.questions.A2")}</div>
          <input
            type="number"
            min={0}
            className="border rounded-md px-2 py-1 w-32"
            value={form["A2"] ?? ""}
            onChange={(e) => handleChange("A2", e.target.value)}
          />
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A3. {t("pretest.questions.A3")}</div>
          {(Array.isArray(options.stage) ? options.stage : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="A3"
                checked={form["A3"] === opt}
                onChange={() => handleChange("A3", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A4. {t("pretest.questions.A4")}</div>
          {(Array.isArray(options.companyAge) ? options.companyAge : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="A4"
                checked={form["A4"] === opt}
                onChange={() => handleChange("A4", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A5. {t("pretest.questions.A5")}</div>
          {(Array.isArray(options.employees) ? options.employees : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="A5"
                checked={form["A5"] === opt}
                onChange={() => handleChange("A5", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>{t("pretest.questions.industry")}</div>
          {(Array.isArray(options.industry) ? options.industry : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="industry"
                checked={form["industry"] === opt}
                onChange={() => handleChange("industry", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
          {form["industry"] === "其他（请注明）" && (
            <input
              type="text"
              placeholder="请注明具体行业"
              className="border rounded-md px-2 py-1 w-full mt-2"
              value={form["industry_other"] ?? ""}
              onChange={(e) => handleChange("industry_other", e.target.value)}
            />
          )}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A6. {t("pretest.questions.A6")}</div>
          {(Array.isArray(options.genaiYear) ? options.genaiYear : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="A6"
                checked={form["A6"] === opt}
                onChange={() => handleChange("A6", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A7. {t("pretest.questions.A7")}</div>
          {(Array.isArray(options.frequency) ? options.frequency : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="A7"
                checked={form["A7"] === opt}
                onChange={() => handleChange("A7", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A8. {t("pretest.questions.A8")}</div>
          {(Array.isArray(options.duration) ? options.duration : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="A8"
                checked={form["A8"] === opt}
                onChange={() => handleChange("A8", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="border rounded-md p-3 text-sm space-y-2">
          <div>A12. {t("pretest.questions.A12")}</div>
          {(Array.isArray(options.attention) ? options.attention : []).map((opt: string) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="A12"
                checked={form["A12"] === opt}
                onChange={() => handleChange("A12", opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("pretest.section2")}</h3>
        {renderLikert("G", t("pretest.genaiDependence"))}
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("pretest.section4")}</h3>
        <p className="text-sm text-gray-700 mb-4">{t("pretest.eseIntro")}</p>
        {renderLikert("ese_", t("pretest.ese"), false)}
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-gray-800">{t("pretest.section5")}</h3>
        <p className="text-sm text-gray-700 mb-4">{t("pretest.aiLiteracyIntro")}</p>
        {renderLikert("ai_literacy_", t("pretest.aiLiteracy"))}
      </section>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        onClick={handleSubmit}
        className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
      >
        {t("pretest.submit")}
      </button>
    </div>
  );
};
