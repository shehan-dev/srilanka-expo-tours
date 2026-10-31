import "server-only";
import { getTour } from "@/lib/data/tours";
import type { Locale, PackageOption, Tour } from "@/lib/types";

// Validation + normalisation of booking / quote requests posted by the website forms.

export type EnquiryType = "booking" | "itinerary";

export interface Enquiry {
  reference: string;
  type: EnquiryType;
  receivedAt: string;
  /** Language the visitor was browsing in — used for the confirmation email. */
  locale: Locale;
  name: string;
  email: string;
  phone?: string;
  /** Preferred language for the trip / guide. */
  language?: string;
  adults: number;
  kids: number;
  startDate?: string;
  endDate?: string;
  tour?: Tour;
  option?: PackageOption;
  message?: string;
  whatsappOptIn: boolean;
  /** Itinerary-builder payload (plain JSON from the client). */
  itinerary?: Record<string, unknown>;
}

export type ValidationResult =
  | { ok: true; enquiry: Enquiry }
  | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LANGUAGES = ["it", "en", "de", "fr"];

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const int = (value: unknown, min: number, max: number, fallback: number) => {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** Booking reference shown to the guest, e.g. SLE-261031-7F3A. */
export function createReference(date = new Date()) {
  const ymd = `${date.getFullYear() % 100}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `SLE-${ymd}-${crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase()}`;
}

export function validateEnquiry(body: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  const name = text(body.name, 120);
  const email = text(body.email, 200).toLowerCase();
  if (!name) errors.name = "required";
  if (!EMAIL.test(email)) errors.email = "invalid";

  const startDate = DATE.test(text(body.startDate, 10)) ? text(body.startDate, 10) : undefined;
  const endDate = DATE.test(text(body.endDate, 10)) ? text(body.endDate, 10) : undefined;
  if (startDate && endDate && endDate < startDate) errors.endDate = "before-start";

  if (Object.keys(errors).length) return { ok: false, errors };

  const type: EnquiryType = body.type === "itinerary" ? "itinerary" : "booking";
  const language = text(body.language, 5);

  return {
    ok: true,
    enquiry: {
      reference: createReference(),
      type,
      receivedAt: new Date().toISOString(),
      locale: body.locale === "it" ? "it" : "en",
      name,
      email,
      phone: text(body.phone, 40) || undefined,
      language: LANGUAGES.includes(language) ? language : undefined,
      adults: int(body.adults, 1, 60, 2),
      kids: int(body.kids, 0, 30, 0),
      startDate,
      endDate,
      tour: getTour(text(body.tour, 120)),
      option: body.option === "premium" || body.option === "standard" ? body.option : undefined,
      message: text(body.message, 4000) || undefined,
      whatsappOptIn: body.whatsappOptIn === true || body.whatsappOptIn === "on",
      itinerary:
        type === "itinerary" && body.itinerary && typeof body.itinerary === "object"
          ? (body.itinerary as Record<string, unknown>)
          : undefined,
    },
  };
}

/** Flat JSON for webhooks / CRMs (Zapier, Make, HubSpot, Airtable…). */
export const toWebhookPayload = (e: Enquiry) => ({
  ...e,
  tour: e.tour ? { slug: e.tour.slug, title: e.tour.title.en, days: e.tour.durationDays } : undefined,
  priceFromUSD: e.tour && e.option ? e.tour.prices[e.option] : undefined,
});
