import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#3C2415] text-[#F0E6D8]/70 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold bg-gradient-to-r from-[#CA8A04] via-[#C2410C] to-[#9A3412] bg-clip-text text-transparent">
              Fading Memories
            </p>
            <p className="text-sm mt-1 text-[#F0E6D8]/50">
              Before they fade completely, bring your memories back to life.
            </p>
          </div>

          <div className="flex items-center gap-1 text-sm text-[#F0E6D8]/50">
            Made with <Heart className="w-3.5 h-3.5 text-[#C2410C] fill-[#C2410C] mx-1" /> for
            memories that matter
          </div>
        </div>

        <div className="border-t border-[#F0E6D8]/10 mt-8 pt-6 text-center text-xs text-[#F0E6D8]/40">
          &copy; {new Date().getFullYear()} Fading Memories. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
