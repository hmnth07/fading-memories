import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/70 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 bg-clip-text text-transparent">
              Fading Memories
            </p>
            <p className="text-sm mt-1 text-background/50">
              Before they fade completely, bring your memories back to life.
            </p>
          </div>

          <div className="flex items-center gap-1 text-sm text-background/50">
            Made with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 mx-1" /> for
            memories that matter
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 text-center text-xs text-background/40">
          &copy; {new Date().getFullYear()} Fading Memories. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
