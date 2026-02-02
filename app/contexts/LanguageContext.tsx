"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/lib/i18n";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "zh";
    }
    return "zh";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLanguage = () => {
    setLangState((prev) => (prev === "zh" ? "en" : "zh"));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
