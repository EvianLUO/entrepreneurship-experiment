"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export type PosttestData = Record<string, string>;

type Props = {
  onSubmit: (data: PosttestData) => void;
};

export const PosttestForm: React.FC<Props> = ({ onSubmit }) => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  const [form, setForm] = useState<PosttestData>({});
  const [error, setError] = useState<string | null>(null);

  const items = t("posttest.questions");

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const itemsArray = Array.isArray(items) ? items : [];
    for (let i = 1; i <= itemsArray.length; i++) {
      const key = `B${i}`;
      if (!form[key]) {
        setError(t("posttest.error"));
        return;
      }
    }
    setError(null);
    onSubmit(form);
  };

  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <h2 className="text-xl font-semibold">{t("posttest.title")}</h2>
      <p className="text-sm text-gray-700">{t("posttest.description")}</p>

      <div className="space-y-4">
        {itemsArray.map((label, idx) => {
          const key = `B${idx + 1}`;
          return (
            <div key={key} className="border rounded-md p-3 text-sm space-y-2">
              <div className="whitespace-pre-wrap">{label}</div>
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
