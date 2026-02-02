"use client";

import React from "react";
import { LanguageProvider } from "@/app/contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
