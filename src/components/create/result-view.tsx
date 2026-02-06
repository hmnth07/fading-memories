"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GenerationResult } from "@/types/memory";
import { Download, RefreshCw, Film, Loader2 } from "lucide-react";
import { encodeGif, type ParticleType } from "@/lib/gif-encoder";

interface ResultViewProps {
  result: GenerationResult;
  onCreateAnother: () => void;
}

const PARTICLE_OPTIONS: { label: string; value: ParticleType }[] = [
  { label: "Sakura Petals", value: "sakura" },
  { label: "Dust Motes", value: "dust" },
  { label: "Rain", value: "rain" },
  { label: "Snow", value: "snow" },
  { label: "Fireflies", value: "firefly" },
];

export function ResultView({ result, onCreateAnother }: ResultViewProps) {
  const [gifState, setGifState] = useState<"idle" | "selecting" | "encoding" | "done">("idle");
  const [selectedParticle, setSelectedParticle] = useState<ParticleType>("sakura");
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleDownloadImage = useCallback(async () => {
    const response = await fetch(result.imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fading-memory.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result.imageUrl]);

  const handleMakeGif = useCallback(() => {
    setGifState("selecting");
  }, []);

  const handleEncodeGif = useCallback(async () => {
    setGifState("encoding");

    try {
      const blob = await encodeGif(result.imageUrl, selectedParticle);
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      setGifState("done");
    } catch (error) {
      console.error("GIF encoding failed:", error);
      setGifState("idle");
    }
  }, [result.imageUrl, selectedParticle]);

  const handleDownloadGif = useCallback(() => {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = "fading-memory-living.gif";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [gifUrl]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Your Memory, Restored
        </h2>
        <p className="text-muted-foreground">
          A moment preserved before it fades away
        </p>
      </div>

      {/* Image */}
      <Card className="overflow-hidden border-0 shadow-xl mb-8">
        <div className="relative aspect-square">
          <Image
            ref={imgRef}
            src={result.imageUrl}
            alt="Your generated memory"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={handleDownloadImage}
          className="flex-1 bg-gradient-to-r from-[#C2410C] to-[#9A3412] hover:from-[#9A3412] hover:to-[#78350F] text-white gap-2"
        >
          <Download className="w-4 h-4" />
          Download Image
        </Button>

        <Button
          onClick={handleMakeGif}
          variant="outline"
          className="flex-1 gap-2"
          disabled={gifState === "encoding"}
        >
          <Film className="w-4 h-4" />
          Make it a Living Photo
        </Button>

        <Button
          onClick={onCreateAnother}
          variant="ghost"
          className="flex-1 gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Create Another
        </Button>
      </div>

      {/* Particle selection */}
      {gifState === "selecting" && (
        <Card className="p-6 border-[#E5D9C8] animate-fade-in">
          <h3 className="font-semibold mb-3">Choose a particle effect</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {PARTICLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedParticle(opt.value)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedParticle === opt.value
                    ? "bg-[#C2410C] text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button
            onClick={handleEncodeGif}
            className="bg-gradient-to-r from-[#C2410C] to-[#9A3412] hover:from-[#9A3412] hover:to-[#78350F] text-white gap-2"
          >
            <Film className="w-4 h-4" />
            Generate Living Photo
          </Button>
        </Card>
      )}

      {/* Encoding state */}
      {gifState === "encoding" && (
        <Card className="p-6 border-[#E5D9C8] animate-fade-in">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating your living photo...</span>
          </div>
        </Card>
      )}

      {/* GIF result */}
      {gifState === "done" && gifUrl && (
        <Card className="overflow-hidden border-0 shadow-xl animate-fade-in">
          <div className="relative aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifUrl}
              alt="Your living memory"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <Button
              onClick={handleDownloadGif}
              className="w-full bg-gradient-to-r from-[#C2410C] to-[#9A3412] hover:from-[#9A3412] hover:to-[#78350F] text-white gap-2"
            >
              <Download className="w-4 h-4" />
              Download Living Photo
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
