"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MemoryStepComponent } from "./memory-step";
import { MEMORY_FORM_STEPS, type MemoryFormData } from "@/types/memory";
import { ArrowLeft, ArrowRight, Sparkles, SkipForward } from "lucide-react";

interface MemoryFormProps {
  onSubmit: (data: MemoryFormData) => void;
  initialData?: MemoryFormData;
}

const EMPTY_DATA: MemoryFormData = {
  who: "",
  where: "",
  what: "",
  atmosphere: "",
  details: "",
  feeling: "",
};

export function MemoryForm({ onSubmit, initialData }: MemoryFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<MemoryFormData>(initialData ?? EMPTY_DATA);

  const step = MEMORY_FORM_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === MEMORY_FORM_STEPS.length - 1;
  const progress = ((currentStep + 1) / MEMORY_FORM_STEPS.length) * 100;

  const canProceed = step.required
    ? step.fields.every((f) => formData[f.field].trim().length > 0)
    : true;

  function handleChange(field: keyof MemoryFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (isLast) {
      onSubmit(formData);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleSkip() {
    onSubmit(formData);
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            Step {currentStep + 1} of {MEMORY_FORM_STEPS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step content */}
      <div key={currentStep} className="mb-8">
        <MemoryStepComponent
          step={step}
          formData={formData}
          onChange={handleChange}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isFirst}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          {step.skippable && (
            <Button
              variant="outline"
              onClick={handleSkip}
              className="gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip & Generate
            </Button>
          )}

          {isLast ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#C2410C] to-[#9A3412] hover:from-[#9A3412] hover:to-[#78350F] text-white shadow-lg shadow-orange-900/20 gap-2 px-6"
            >
              <Sparkles className="w-4 h-4" />
              Bring This Memory to Life
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
