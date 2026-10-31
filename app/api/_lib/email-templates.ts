import "server-only";
import { site } from "@/lib/site";
import type { Enquiry } from "./booking";

// Email templates: an internal notification for the team and a confirmation for the guest (EN / IT).
// Inline styles + table layout so they render consistently in Gmail, Outlook and Apple Mail.

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const usd = (n: number) => `USD ${n.toLocaleString("en-US")}`;

const languageNames: Record<string, { en: string; it: string }> = {
  it: { en: "Italian", it: "Italiano" },
  en: { en: "English", it: "Inglese" },
  de: { en: "German", it: "Tedesco" },
  fr: { en: "French", it: "Francese" },
};

const optionNames = {
  standard: { en: "Standard — 3★ hotels", it: "Standard — hotel 3★" },
  premium: { en: "Premium — 4★ & 5★ hotels", it: "Premium — hotel 4★ e 5★" },
};

function layout(title: string, body: string, footer: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#e8f6ff;font-family:Arial,Helvetica,sans-serif;color:#0f1724">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8f6ff;padding:24px 12px">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
    <tr><td style="background:#0a6eff;background-image:linear-gradient(135deg,#0a6eff,#00a3c4);padding:24px 28px;color:#ffffff">
      <div style="font-size:20px;font-weight:bold">SriLanka <span style="color:#cdeaff">Expo</span> Tours</div>
      <div style="font-size:14px;opacity:.9;margin-top:4px">${esc(title)}</div>
    </td></tr>
    <tr><td style="padding:28px;font-size:15px;line-height:1.6">${body}</td></tr>
    <tr><td style="padding:18px 28px;background:#f6fbff;font-size:12px;color:#475569;line-height:1.5">${footer}</td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

function rows(items: [string, string | undefined][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 20px">
${items
  .filter(([, v]) => v)
  .map(
    ([k, v]) =>
      `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #d8e6f2;color:#475569;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #d8e6f2;font-weight:bold">${v}</td></tr>`
  )
  .join("\n")}
</table>`;
}

const plain = (items: [string, string | undefined][]) =>
  items
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${String(v).replace(/<[^>]+>/g, "")}`)
    .join("\n");

const travellers = (e: Enquiry, lang: "en" | "it") =>
  lang === "it"
    ? `${e.adults} adult${e.adults === 1 ? "o" : "i"}${e.kids ? `, ${e.kids} bambin${e.kids === 1 ? "o" : "i"}` : ""}`
    : `${e.adults} adult${e.adults === 1 ? "" : "s"}${e.kids ? `, ${e.kids} child${e.kids === 1 ? "" : "ren"}` : ""}`;

const dates = (e: Enquiry, lang: "en" | "it") =>
  e.startDate ? `${e.startDate}${e.endDate ? ` → ${e.endDate}` : ""}` : lang === "it" ? "Da definire" : "Flexible / not set";

/** Notification for the SriLanka Expo team (always in English). Reply-To is the guest. */
export function adminNotification(e: Enquiry) {
  const tourLine = e.tour
    ? `${esc(e.tour.title.en)} (${e.tour.durationDays} days)${e.option ? ` — ${esc(optionNames[e.option].en)}, from ${usd(e.tour.prices[e.option])} pp` : ""}`
    : undefined;
  const wa = e.phone ? `https://wa.me/${e.phone.replace(/[^\d]/g, "")}` : undefined;

  const items: [string, string | undefined][] = [
    ["Reference", esc(e.reference)],
    ["Type", e.type === "itinerary" ? "Custom itinerary quote" : "Booking request"],
    ["Name", esc(e.name)],
    ["Email", `<a href="mailto:${esc(e.email)}">${esc(e.email)}</a>`],
    ["Phone", e.phone ? `${esc(e.phone)}${wa ? ` · <a href="${esc(wa)}">WhatsApp</a>` : ""}` : undefined],
    ["Contact on WhatsApp", e.whatsappOptIn ? "Yes" : "No"],
    ["Tour", tourLine],
    ["Package option", e.option && !e.tour ? esc(optionNames[e.option].en) : undefined],
    ["Travel dates", esc(dates(e, "en"))],
    ["Travellers", esc(travellers(e, "en"))],
    ["Preferred language", e.language ? languageNames[e.language]?.en : undefined],
    ["Site language", e.locale.toUpperCase()],
    ["Received", new Date(e.receivedAt).toUTCString()],
  ];

  const message = e.message ? `<p style="margin:0 0 6px;color:#475569">Message</p><div style="white-space:pre-wrap;background:#f6fbff;border-radius:10px;padding:14px">${esc(e.message)}</div>` : "";
  const itinerary = e.itinerary
    ? `<p style="margin:20px 0 6px;color:#475569">Itinerary builder details</p><pre style="white-space:pre-wrap;font-size:12px;background:#f6fbff;border-radius:10px;padding:14px">${esc(JSON.stringify(e.itinerary, null, 2))}</pre>`
    : "";

  const subject = `New ${e.type === "itinerary" ? "itinerary quote" : "booking"} request ${e.reference} — ${e.name}${e.tour ? ` · ${e.tour.title.en}` : ""}`;
  return {
    subject,
    html: layout(
      "New booking request",
      `<p style="margin:0 0 16px">A new request has arrived from the website. Reply to this email to answer the guest directly.</p>${rows(items)}${message}${itinerary}`,
      `Sent automatically by ${esc(site.url)}`
    ),
    text: `${subject}\n\n${plain(items)}${e.message ? `\n\nMessage:\n${e.message}` : ""}${e.itinerary ? `\n\nItinerary:\n${JSON.stringify(e.itinerary, null, 2)}` : ""}`,
  };
}

const copy = {
  en: {
    subject: (ref: string) => `We've received your request — ${ref}`,
    title: "Thank you for your request",
    hello: (name: string) => `Dear ${name},`,
    intro:
      "Thank you for contacting SriLanka Expo Tours! We've received your request and our team will get back to you with a personalised quote within 24 hours.",
    ref: "Your reference",
    summary: "Your request",
    tour: "Tour",
    option: "Package option",
    dates: "Travel dates",
    travellers: "Travellers",
    note: "Prices on our website are indicative and not fixed — slight variations may occur depending on vehicle type, hotel rate updates and season. Your quote will confirm the final price.",
    questions: "Questions in the meantime? Call or WhatsApp us on",
    signoff: "Warm regards,",
    team: "The SriLanka Expo Tours team",
    footer: "You are receiving this email because you sent a request on our website.",
  },
  it: {
    subject: (ref: string) => `Abbiamo ricevuto la tua richiesta — ${ref}`,
    title: "Grazie per la tua richiesta",
    hello: (name: string) => `Gentile ${name},`,
    intro:
      "Grazie per aver contattato SriLanka Expo Tours! Abbiamo ricevuto la tua richiesta e il nostro team ti invierà un preventivo personalizzato entro 24 ore.",
    ref: "Il tuo codice di riferimento",
    summary: "La tua richiesta",
    tour: "Tour",
    option: "Opzione del pacchetto",
    dates: "Date del viaggio",
    travellers: "Viaggiatori",
    note: "I prezzi sul nostro sito sono indicativi e non fissi — possono variare leggermente in base al tipo di veicolo, agli aggiornamenti delle tariffe alberghiere e alla stagione. Il preventivo confermerà il prezzo finale.",
    questions: "Domande nel frattempo? Chiamaci o scrivici su WhatsApp al",
    signoff: "Un caro saluto,",
    team: "Il team di SriLanka Expo Tours",
    footer: "Ricevi questa email perché hai inviato una richiesta dal nostro sito.",
  },
};

/** Confirmation for the guest, in the language they were browsing. Reply-To is the team inbox. */
export function customerConfirmation(e: Enquiry, replyTo: string) {
  const lang = e.locale;
  const t = copy[lang];
  const items: [string, string | undefined][] = [
    [t.tour, e.tour ? `${esc(e.tour.title[lang])}` : undefined],
    [t.option, e.option ? esc(optionNames[e.option][lang]) : undefined],
    [t.dates, esc(dates(e, lang))],
    [t.travellers, esc(travellers(e, lang))],
  ];
  const wa = `https://wa.me/${site.whatsapp}`;

  const html = layout(
    t.title,
    `<p style="margin:0 0 12px">${esc(t.hello(e.name))}</p>
<p style="margin:0 0 20px">${esc(t.intro)}</p>
<div style="background:#e8f6ff;border-radius:12px;padding:14px 18px;margin:0 0 20px">
  <div style="font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:.05em">${esc(t.ref)}</div>
  <div style="font-size:22px;font-weight:bold;color:#0759d1;letter-spacing:.06em;font-family:Consolas,monospace">${esc(e.reference)}</div>
</div>
<p style="margin:0;font-weight:bold">${esc(t.summary)}</p>
${rows(items)}
<p style="margin:0 0 16px;font-size:13px;color:#475569">${esc(t.note)}</p>
<p style="margin:0 0 20px">${esc(t.questions)} <a href="${site.phoneHref}" style="color:#0759d1">${esc(site.phone)}</a> · <a href="${wa}" style="color:#0759d1">WhatsApp</a></p>
<p style="margin:0">${esc(t.signoff)}<br><strong>${esc(t.team)}</strong></p>`,
    `${esc(site.name)} · ${esc(site.address.street)}, ${esc(site.address.city)}, ${esc(site.address.region)}, ${esc(site.address.country)}<br>${esc(t.footer)}`
  );

  const text = [
    t.hello(e.name),
    "",
    t.intro,
    "",
    `${t.ref}: ${e.reference}`,
    "",
    plain(items),
    "",
    t.note,
    "",
    `${t.questions} ${site.phone} (WhatsApp: ${wa})`,
    "",
    t.signoff,
    t.team,
  ].join("\n");

  return { subject: t.subject(e.reference), html, text, replyTo };
}
