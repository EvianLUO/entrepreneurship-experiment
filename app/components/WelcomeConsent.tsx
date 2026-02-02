"use client";

import React from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

type Props = {
  onNext: () => void;
};

export const WelcomeConsent: React.FC<Props> = ({ onNext }) => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  const [checked, setChecked] = React.useState(false);

  // 调试：监听语言变化
  React.useEffect(() => {
    console.log("WelcomeConsent: Language changed to", lang);
  }, [lang]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("welcome.title")}</h2>
      <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
        <p>{t("welcome.description")}</p>
        <p>{t("welcome.privacy")}</p>
        <p>{t("welcome.voluntary")}</p>
        <p className="font-semibold">{t("welcome.consent")}</p>
        <ul className="list-disc pl-5 space-y-1">
          {t("welcome.consentItems").map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <label className="flex items-center gap-2 text-sm mt-4">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span>{t("welcome.agree")}</span>
      </label>

      <button
        onClick={onNext}
        disabled={!checked}
        className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm disabled:bg-gray-300 disabled:text-gray-600 hover:bg-blue-700 transition-colors"
      >
        {t("welcome.continue")}
      </button>
    </div>
  );
};
