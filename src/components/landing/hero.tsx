"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float [animation-delay:2s]" />
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-sky-200/20 rounded-full blur-3xl animate-float [animation-delay:4s]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-rose-200/50 text-sm text-rose-600 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Before they fade completely
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
          <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 bg-clip-text text-transparent">
            Fading Memories
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 animate-slide-up [animation-delay:0.2s] opacity-0">
          Describe the memories slipping away — the ones you can feel but can&apos;t
          quite see anymore. We&apos;ll bring them back as beautiful anime-style art.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:0.4s] opacity-0">
          <Link href="/create">
            <Button
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg shadow-rose-500/25 text-lg px-8 py-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Bring a Memory to Life
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Free — 5 creations per day
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
