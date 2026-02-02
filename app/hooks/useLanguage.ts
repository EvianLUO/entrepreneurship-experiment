"use client";

import { useLanguage as useLanguageContext } from "@/app/contexts/LanguageContext";

// 重新导出，保持向后兼容
export function useLanguage() {
  return useLanguageContext();
}
