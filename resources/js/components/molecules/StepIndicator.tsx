import React from "react";

export interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, current }) => (
  <nav className="flex justify-center gap-2 mb-4">
    {steps.map((step, idx) => (
      <div
        key={step}
        className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm transition-all
          ${idx === current ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-[#222] text-gray-400 border-[#333]"}`}
      >
        {step}
      </div>
    ))}
  </nav>
);
