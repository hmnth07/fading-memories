"use client";

import { Textarea } from "@/components/ui/textarea";
import type { MemoryFormStep, MemoryFormData } from "@/types/memory";

interface MemoryStepProps {
  step: MemoryFormStep;
  formData: MemoryFormData;
  onChange: (field: keyof MemoryFormData, value: string) => void;
}

export function MemoryStepComponent({ step, formData, onChange }: MemoryStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">{step.title}</h2>
      <p className="text-muted-foreground mb-6">{step.subtitle}</p>
      <div className="space-y-6">
        {step.fields.map((field) => (
          <div key={field.field}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <p className="text-sm text-muted-foreground mb-2">{field.hint}</p>
            <Textarea
              value={formData[field.field]}
              onChange={(e) => onChange(field.field, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="resize-none text-base leading-relaxed bg-white/60 backdrop-blur-sm border-[#E5D9C8] focus:border-[#C2410C] focus:ring-[#C2410C]/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
