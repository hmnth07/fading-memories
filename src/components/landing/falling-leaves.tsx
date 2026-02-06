"use client";

import { memo } from "react";

const LEAVES = [
  { left: "10%", delay: "0s", duration: "10s", size: 12 },
  { left: "20%", delay: "2s", duration: "12s", size: 10 },
  { left: "35%", delay: "4s", duration: "11s", size: 14 },
  { left: "50%", delay: "1s", duration: "13s", size: 11 },
  { left: "65%", delay: "3s", duration: "10s", size: 13 },
  { left: "80%", delay: "5s", duration: "12s", size: 10 },
  { left: "90%", delay: "2.5s", duration: "11s", size: 12 },
  // Extra leaves hidden on mobile
  { left: "5%", delay: "6s", duration: "14s", size: 9, hideOnMobile: true },
  { left: "45%", delay: "7s", duration: "10s", size: 11, hideOnMobile: true },
  { left: "75%", delay: "4.5s", duration: "13s", size: 10, hideOnMobile: true },
];

export const FallingLeaves = memo(function FallingLeaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <div
          key={i}
          className={`absolute -top-4 animate-fall ${leaf.hideOnMobile ? "hidden sm:block" : ""}`}
          style={{
            left: leaf.left,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
          }}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#C2410C]/40 animate-sway"
            style={{
              animationDelay: leaf.delay,
              animationDuration: `${parseFloat(leaf.duration) * 0.4}s`,
            }}
          >
            <path
              d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z"
              fill="currentColor"
            />
            <path
              d="M12 22V8"
              stroke="#78350F"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          </svg>
        </div>
      ))}
    </div>
  );
});
