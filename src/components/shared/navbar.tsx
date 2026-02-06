"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF6F1]/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-[#C2410C] via-[#9A3412] to-[#78350F] bg-clip-text text-transparent">
              Fading Memories
            </span>
          </Link>

          <Link href="/create">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#C2410C] to-[#9A3412] hover:from-[#9A3412] hover:to-[#78350F] text-white shadow-md"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Create
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
