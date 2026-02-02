"use client";

import React from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

export default function TestI18nPage() {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">翻译测试页面</h1>
          <LanguageSwitcher />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <strong>当前语言：</strong> {lang}
          </div>
          
          <div>
            <strong>测试翻译：</strong>
            <div className="mt-2 space-y-2">
              <div>welcome.title: {t("welcome.title")}</div>
              <div>home.title: {t("home.title")}</div>
              <div>pretest.title: {t("pretest.title")}</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">{t("welcome.title")}</h2>
            <p>{t("welcome.description")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
