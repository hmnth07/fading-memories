"use client";

import { memo } from "react";

interface Sparkle {
  id: number;
  size: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
  color: string;
}

const SPARKLES: Sparkle[] = [
  { id: 1, size: 12, top: "15%", left: "10%", delay: "0s", duration: "2.5s", color: "#CA8A04" },
  { id: 2, size: 8, top: "25%", left: "85%", delay: "0.5s", duration: "2s", color: "#C2410C" },
  { id: 3, size: 10, top: "60%", left: "5%", delay: "1s", duration: "2.8s", color: "#CA8A04" },
  { id: 4, size: 6, top: "70%", left: "90%", delay: "1.5s", duration: "2.2s", color: "#9A3412" },
  { id: 5, size: 14, top: "40%", left: "92%", delay: "0.3s", duration: "3s", color: "#CA8A04" },
  { id: 6, size: 8, top: "80%", left: "15%", delay: "2s", duration: "2.5s", color: "#C2410C" },
  { id: 7, size: 10, top: "10%", left: "75%", delay: "0.8s", duration: "2.3s", color: "#CA8A04" },
  { id: 8, size: 6, top: "55%", left: "95%", delay: "1.2s", duration: "2.7s", color: "#9A3412" },
];

function FourPointStar({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z"
        fill={color}
      />
    </svg>
  );
}

function SparkleElement({ sparkle }: { sparkle: Sparkle }) {
  return (
    <div
      className="absolute animate-sparkle pointer-events-none"
      style={{
        top: sparkle.top,
        left: sparkle.left,
        animationDelay: sparkle.delay,
        animationDuration: sparkle.duration,
      }}
    >
      <FourPointStar size={sparkle.size} color={sparkle.color} />
    </div>
  );
}

export const AnimeSparkles = memo(function AnimeSparkles() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block"
      aria-hidden="true"
    >
      {SPARKLES.map((sparkle) => (
        <SparkleElement key={sparkle.id} sparkle={sparkle} />
      ))}
    </div>
  );
});
