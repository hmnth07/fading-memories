"use client";

import { Textarea } from "@/components/ui/textarea";
import type { MemoryStep } from "@/types/memory";

interface MemoryStepProps {
  step: MemoryStep;
  value: string;
  onChange: (value: string) => void;
}

export function MemoryStepComponent({ step, value, onChange }: MemoryStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">{step.question}</h2>
      <p className="text-muted-foreground mb-6">{step.hint}</p>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={step.placeholder}
        rows={4}
        className="resize-none text-base leading-relaxed bg-white/60 backdrop-blur-sm border-[#E5D9C8] focus:border-[#C2410C] focus:ring-[#C2410C]/20"
      />
    </div>
  );
}
