"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MemoryStepComponent } from "./memory-step";
import { MEMORY_STEPS, type MemoryFormData } from "@/types/memory";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface MemoryFormProps {
  onSubmit: (data: MemoryFormData) => void;
}

const INITIAL_DATA: MemoryFormData = {
  who: "",
  where: "",
  what: "",
  atmosphere: "",
  details: "",
  feeling: "",
};

export function MemoryForm({ onSubmit }: MemoryFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<MemoryFormData>(INITIAL_DATA);

  const step = MEMORY_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === MEMORY_STEPS.length - 1;
  const currentValue = formData[step.field];
  const progress = ((currentStep + 1) / MEMORY_STEPS.length) * 100;

  function handleChange(value: string) {
    setFormData((prev) => ({ ...prev, [step.field]: value }));
  }

  function handleNext() {
    if (isLast) {
      onSubmit(formData);
    } else {
      setCurrentStep((s) => s + 1);
    }
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
            Step {currentStep + 1} of {MEMORY_STEPS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step content */}
      <div key={currentStep} className="mb-8">
        <MemoryStepComponent
          step={step}
          value={currentValue}
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

        {isLast ? (
          <Button
            onClick={handleNext}
            disabled={!currentValue.trim()}
            className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg gap-2 px-6"
          >
            <Sparkles className="w-4 h-4" />
            Bring This Memory to Life
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!currentValue.trim()}
            className="gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
