"use client";

import React from "react";
import { useLanguage } from "@/app/hooks/useLanguage";

type Props = {
  currentStep: number;
  totalSteps: number;
};

export const ProgressBar: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const { lang } = useLanguage();
  const percent = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{lang === "zh" ? "进度" : "Progress"}</span>
        <span>
          {lang === "zh"
            ? `第 ${currentStep} 步 / 共 ${totalSteps} 步`
            : `Step ${currentStep} / ${totalSteps}`}
        </span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
