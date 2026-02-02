"use client";

import React from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export default function Home() {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);
  
  // 调试：监听语言变化
  React.useEffect(() => {
    console.log("Home page: Language changed to", lang);
    console.log("Test translation:", getTranslation(lang, "home.title"));
  }, [lang]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-2">{t("home.title")}</h1>
            <p className="text-sm text-gray-700 leading-relaxed">
              {t("home.description")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
        <div className="space-y-3">
          <Link
            href="/study1"
            className="block w-full text-center px-6 py-3 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            {t("home.study1")}
          </Link>
          <Link
            href="/study2"
            className="block w-full text-center px-6 py-3 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors"
          >
            {t("home.study2")}
          </Link>
        </div>
        <p className="text-xs text-gray-400">
          {t("home.tip")}
        </p>
      </div>
    </main>
  );
}
