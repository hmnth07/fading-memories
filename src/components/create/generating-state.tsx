"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "Gathering the fragments...",
  "Piecing together the light...",
  "Remembering the colors...",
  "Feeling the warmth...",
  "Bringing it back to life...",
];

export function GeneratingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
      {/* Pulsing orb */}
      <div className="relative mb-12">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C2410C] via-[#CA8A04] to-[#78350F] animate-pulse" />
        <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#C2410C] via-[#CA8A04] to-[#78350F] blur-xl opacity-50 animate-pulse" />
      </div>

      {/* Message */}
      <p
        key={messageIndex}
        className="text-xl text-muted-foreground animate-fade-in text-center"
      >
        {MESSAGES[messageIndex]}
      </p>

      <p className="text-sm text-muted-foreground/60 mt-4">
        This may take a moment
      </p>
    </div>
  );
}
