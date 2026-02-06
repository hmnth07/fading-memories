"use client";

import { useState } from "react";
import { MemoryForm } from "@/components/create/memory-form";
import { GeneratingState } from "@/components/create/generating-state";
import { ResultView } from "@/components/create/result-view";
import { canGenerate, recordGeneration, getRemainingGenerations } from "@/lib/rate-limit";
import type { MemoryFormData, GenerationResult, CreatePageState } from "@/types/memory";
import { AlertCircle } from "lucide-react";

export default function CreatePage() {
  const [state, setState] = useState<CreatePageState>("form");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: MemoryFormData) {
    if (!canGenerate()) {
      setError(
        "You've reached your daily limit of 5 generations. Come back tomorrow!"
      );
      return;
    }

    setState("generating");
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate image");
      }

      const generationResult: GenerationResult = await response.json();
      recordGeneration();
      setResult(generationResult);
      setState("result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setState("form");
    }
  }

  function handleCreateAnother() {
    setResult(null);
    setError(null);
    setState("form");
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Rate limit info */}
        {state === "form" && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              {getRemainingGenerations()} generation{getRemainingGenerations() !== 1 ? "s" : ""}{" "}
              remaining today
            </p>
          </div>
        )}

        {state === "form" && <MemoryForm onSubmit={handleSubmit} />}
        {state === "generating" && <GeneratingState />}
        {state === "result" && result && (
          <ResultView result={result} onCreateAnother={handleCreateAnother} />
        )}
      </div>
    </div>
  );
}
