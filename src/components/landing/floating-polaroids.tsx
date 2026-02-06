"use client";

import { memo } from "react";

interface Polaroid {
  id: number;
  gradient: string;
  accentColor: string;
  position: string;
  rotation: string;
  opacity: number;
  delay: string;
  hideOnMobile?: boolean;
}

// Each polaroid has a unique gradient to suggest different memories
const POLAROIDS: Polaroid[] = [
  {
    id: 1,
    gradient: "from-amber-200 via-orange-100 to-yellow-50",
    accentColor: "#C2410C",
    position: "top-[15%] left-[5%] sm:left-[8%]",
    rotation: "-rotate-6",
    opacity: 0.75,
    delay: "0s",
  },
  {
    id: 2,
    gradient: "from-rose-100 via-amber-50 to-orange-100",
    accentColor: "#9A3412",
    position: "top-[18%] right-[5%] sm:right-[10%]",
    rotation: "rotate-6",
    opacity: 0.55,
    delay: "1s",
  },
  {
    id: 3,
    gradient: "from-yellow-100 via-amber-100 to-orange-50",
    accentColor: "#78350F",
    position: "bottom-[28%] left-[8%] sm:left-[12%]",
    rotation: "rotate-3",
    opacity: 0.45,
    delay: "2s",
    hideOnMobile: true,
  },
  {
    id: 4,
    gradient: "from-orange-100 via-rose-50 to-amber-100",
    accentColor: "#CA8A04",
    position: "bottom-[32%] right-[8%] sm:right-[15%]",
    rotation: "-rotate-3",
    opacity: 0.6,
    delay: "1.5s",
    hideOnMobile: true,
  },
];

// 4-point sparkle SVG for anime effect
function Sparkle({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z"
        fill={color}
      />
    </svg>
  );
}

// Abstract "memory" shape - silhouettes suggesting scenes
function MemoryScene({ gradient, accentColor }: { gradient: string; accentColor: string }) {
  return (
    <div className={`relative w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br ${gradient} overflow-hidden`}>
      {/* Abstract shapes suggesting a scene */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full opacity-30"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Horizon line */}
        <rect x="0" y="60" width="100" height="40" fill={accentColor} opacity="0.2" />
        {/* Sun/moon */}
        <circle cx="75" cy="25" r="12" fill={accentColor} opacity="0.25" />
        {/* Abstract figure silhouette */}
        <ellipse cx="35" cy="55" rx="8" ry="15" fill={accentColor} opacity="0.2" />
        <circle cx="35" cy="38" r="5" fill={accentColor} opacity="0.2" />
      </svg>
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20" />
      {/* Anime sparkle overlay */}
      <div className="absolute top-1 right-1 animate-sparkle-pulse">
        <Sparkle size={8} color={accentColor} />
      </div>
      <div className="absolute bottom-2 left-2 animate-sparkle-pulse" style={{ animationDelay: "0.5s" }}>
        <Sparkle size={6} color={accentColor} className="opacity-70" />
      </div>
      {/* Film grain texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

function PolaroidFrame({ polaroid }: { polaroid: Polaroid }) {
  return (
    <div
      className={`absolute ${polaroid.position} ${polaroid.rotation} ${polaroid.hideOnMobile ? "hidden md:block" : ""} animate-float-slow pointer-events-none select-none`}
      style={{
        opacity: polaroid.opacity,
        animationDelay: polaroid.delay,
      }}
    >
      <div className="bg-[#FAF6F1] p-1.5 sm:p-2 shadow-lg shadow-[#3C2415]/10 rounded-sm">
        <MemoryScene gradient={polaroid.gradient} accentColor={polaroid.accentColor} />
        {/* Polaroid bottom strip */}
        <div className="h-3 sm:h-4" />
      </div>
    </div>
  );
}

export const FloatingPolaroids = memo(function FloatingPolaroids() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {POLAROIDS.map((polaroid) => (
        <PolaroidFrame key={polaroid.id} polaroid={polaroid} />
      ))}
    </div>
  );
});
