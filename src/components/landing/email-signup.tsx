"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabase } from "@/lib/supabase";
import { Mail, Check, AlertCircle } from "lucide-react";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    let error: { code?: string } | null = null;
    try {
      const supabase = getSupabase();
      const result = await supabase
        .from("email_signups")
        .insert({ email: email.trim().toLowerCase() });
      error = result.error;
    } catch {
      setStatus("error");
      setErrorMsg("Email signup is not configured yet.");
      return;
    }

    if (error) {
      if (error.code === "23505") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    } else {
      setStatus("success");
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 mb-4">
          <Mail className="w-5 h-5 text-rose-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Get notified about new features and updates. No spam, ever.
        </p>

        {status === "success" ? (
          <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 rounded-lg p-4">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">You&apos;re on the list!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </Button>
          </form>
        )}

        {status === "error" && (
          <div className="flex items-center justify-center gap-2 text-red-600 mt-3 text-sm">
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </div>
        )}
      </div>
    </section>
  );
}
