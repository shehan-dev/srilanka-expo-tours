"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Modal } from "@/components/ui/Modal";
import { tours } from "@/lib/data/tours";
import { l } from "@/lib/i18n/config";
import type { GuideLanguage, PackageOption } from "@/lib/types";

type Errors = Partial<Record<"name" | "email", string>>;

/** Booking form → POST /api/booking → success modal with booking reference. */
export function ContactForm({
  defaultTour = "",
  defaultOption = "",
  defaultMessage = "",
}: {
  defaultTour?: string;
  defaultOption?: "" | PackageOption;
  defaultMessage?: string;
}) {
  const { lang, dict } = useI18n();
  const t = dict.contact;
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Errors = {};
    if (!data.name?.trim()) next.name = t.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) next.email = t.invalidEmail;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "booking", locale: lang, whatsappOptIn: data.whatsappOptIn === "on" }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error();
      setReference(json.reference);
      setStatus("idle");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const err = (field: keyof Errors) =>
    errors[field] ? (
      <p id={`cf-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    ) : null;

  return (
    <>
      <form onSubmit={onSubmit} noValidate data-hide-actionbar className="card flex flex-col gap-8 p-6 md:p-8">
        {/* Honeypot for bots: hidden from people and assistive tech */}
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Website <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="eyebrow mb-4">{t.groupDetails}</legend>
        <div className="sm:col-span-2">
          <label htmlFor="cf-name" className="field-label">
            {t.name} <span className="text-danger" aria-hidden>*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            required
            className="input"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="cf-email" className="field-label">
            {t.email} <span className="text-danger" aria-hidden>*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
          />
          {err("email")}
        </div>
        <div>
          <label htmlFor="cf-phone" className="field-label">
            {t.phone}
          </label>
          <input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="input" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-language" className="field-label">
            {t.language}
          </label>
          <select id="cf-language" name="language" className="input" defaultValue={lang}>
            {(Object.keys(dict.languages) as GuideLanguage[]).map((code) => (
              <option key={code} value={code}>
                {dict.languages[code]}
              </option>
            ))}
          </select>
        </div>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="eyebrow mb-4">{t.groupTrip}</legend>
        <div className="grid grid-cols-2 gap-3 sm:col-span-2">
          <div>
            <label htmlFor="cf-adults" className="field-label">
              {dict.booking.adults}
            </label>
            <input id="cf-adults" name="adults" type="number" inputMode="numeric" min={1} max={60} defaultValue={2} className="input" />
          </div>
          <div>
            <label htmlFor="cf-kids" className="field-label">
              {dict.booking.kids}
            </label>
            <input id="cf-kids" name="kids" type="number" inputMode="numeric" min={0} max={30} defaultValue={0} className="input" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:col-span-2" role="group" aria-labelledby="cf-dates">
          <span id="cf-dates" className="field-label col-span-2 mb-0">{t.dates}</span>
          <div>
            <label htmlFor="cf-start" className="text-xs text-muted">
              {t.from}
            </label>
            <input id="cf-start" name="startDate" type="date" min={today} className="input" />
          </div>
          <div>
            <label htmlFor="cf-end" className="text-xs text-muted">
              {t.to}
            </label>
            <input id="cf-end" name="endDate" type="date" min={today} className="input" />
          </div>
        </div>
        <div>
          <label htmlFor="cf-tour" className="field-label">
            {t.tour}
          </label>
          <select id="cf-tour" name="tour" className="input" defaultValue={defaultTour}>
            <option value="">{t.tourNone}</option>
            {tours.map((tour) => (
              <option key={tour.slug} value={tour.slug}>
                {l(tour.title, lang)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-option" className="field-label">
            {t.option}
          </label>
          <select id="cf-option" name="option" className="input" defaultValue={defaultOption}>
            <option value="">{t.tourNone}</option>
            <option value="standard">
              {dict.tour.standard} ({dict.tour.standardHotels})
            </option>
            <option value="premium">
              {dict.tour.premium} ({dict.tour.premiumHotels})
            </option>
          </select>
        </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
        <legend className="eyebrow mb-4">{t.groupMessage}</legend>
        <div>
          <label htmlFor="cf-message" className="field-label">
            {t.message}
          </label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            className="input resize-y"
            placeholder={t.messagePlaceholder}
            defaultValue={defaultMessage}
          />
        </div>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" name="whatsappOptIn" className="h-5 w-5 accent-primary" />
          {t.consent}
        </label>
        </fieldset>

        {status === "error" && (
          <p role="alert" className="field-error rounded-control bg-red-50 px-4 py-3">
            {t.error}
          </p>
        )}

        <button type="submit" disabled={status === "sending"} className="btn btn-primary self-start">
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          {status === "sending" ? t.sending : t.submit}
        </button>
      </form>

      <Modal open={!!reference} onClose={() => setReference(null)} title={t.successTitle} closeLabel={t.close} className="max-w-md">
        <div className="flex flex-col items-center gap-4 p-6 pt-2 text-center">
          <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden>
            <circle cx="26" cy="26" r="24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" />
            <path d="M15 27 l7 7 l15 -16" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="draw-check" />
          </svg>
          <p className="text-ink/85">{t.successText}</p>
          <p className="rounded-control bg-ivory px-5 py-3 font-mono text-xl font-bold tracking-wider text-primary">{reference}</p>
          <button type="button" onClick={() => setReference(null)} className="btn btn-primary">
            {t.close}
          </button>
        </div>
      </Modal>
    </>
  );
}
