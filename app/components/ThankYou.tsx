"use client";

import React from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export const ThankYou: React.FC = () => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t("thankyou.title")}</h2>
      <p className="text-sm text-gray-700 leading-relaxed">
        {t("thankyou.message1")}
      </p>
      <p className="text-sm text-gray-700">
        {t("thankyou.message2")}
      </p>
      <p className="text-sm text-gray-500">{t("thankyou.message3")}</p>
    </div>
  );
};
