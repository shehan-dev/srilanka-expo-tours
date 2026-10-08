// Business details used across the site (header, footer, contact page, JSON-LD).
// TODO: replace every placeholder below with the agency's real details before launch.

export const site = {
  name: "SriLanka Expo Tours",
  shortName: "SriLanka Expo",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.srilankaexpotours.com").replace(/\/$/, ""),
  phone: "+94 77 000 0000", // TODO
  phoneHref: "tel:+94770000000", // TODO
  whatsapp: "94770000000", // TODO: international format, digits only
  telegram: "srilankaexpo", // TODO: Telegram username
  email: "info@srilankaexpotours.com", // TODO
  address: {
    street: "123 Galle Road", // TODO
    city: "Colombo",
    country: "Sri Lanka",
    countryCode: "LK",
  },
  /** Meeting point shown on the contact map (default: Colombo Fort). */
  meetingPoint: [6.9344, 79.8428] as [number, number],
  licenseNumber: "SLTDA Reg. No. — TBC", // TODO: Sri Lanka Tourism Development Authority licence
  founder: "Nishan Silva",
  rating: { value: 4.9, count: 2300 },
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tripadvisor: "https://www.tripadvisor.com/",
    google: "https://g.page/",
    youtube: "https://youtube.com/",
  },
  /** Downloadable licence / insurance documents. Put PDFs in /public/documents and list them here. */
  documents: [] as { label: string; href: string }[],
  /** Optional hero background video in /public (e.g. "/media/hero-loop.mp4"). Falls back to the image carousel. */
  heroVideo: null as string | null,
  /** Approximate conversion rates from USD, used by the currency switcher. */
  currencyRates: { USD: 1, EUR: 0.92 } as const,
};

export type Currency = keyof typeof site.currencyRates;
