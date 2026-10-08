"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";

export function NewsletterForm() {
  const { lang, dict } = useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email, language: lang }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm">
        <Check className="h-4 w-4 text-accent" aria-hidden /> {dict.footer.subscribed}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        {dict.footer.emailPlaceholder}
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={dict.footer.emailPlaceholder}
        className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
      />
      <button type="submit" disabled={status === "sending"} className="btn btn-accent btn-sm">
        <Send className="h-4 w-4" aria-hidden />
        <span className="sr-only sm:not-sr-only">{dict.footer.subscribe}</span>
      </button>
      {status === "error" && (
        <p role="alert" className="sr-only">
          {dict.contact.error}
        </p>
      )}
    </form>
  );
}
