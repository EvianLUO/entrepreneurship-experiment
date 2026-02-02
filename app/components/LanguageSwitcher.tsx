"use client";

import React from "react";
import { useLanguage } from "@/app/hooks/useLanguage";

export const LanguageSwitcher: React.FC = () => {
  const { lang, toggleLanguage } = useLanguage();

  const handleClick = () => {
    console.log("Language toggle clicked, current lang:", lang);
    toggleLanguage();
    // 注意：这里 lang 还是旧值，因为 setState 是异步的
    // 实际的新值会在组件重新渲染后更新
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors"
      title={lang === "zh" ? "Switch to English" : "切换到中文"}
    >
      {lang === "zh" ? "EN" : "中文"}
    </button>
  );
};
