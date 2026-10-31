// Business details used across the site (header, footer, contact page, JSON-LD).
// TODO: replace every placeholder below with the agency's real details before launch.

export const site = {
  name: "SriLanka Expo Tours",
  shortName: "SriLanka Expo",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.srilankaexpotours.com").replace(/\/$/, ""),
  phone: "+94 77 706 6217",
  phoneHref: "tel:+94777066217",
  whatsapp: "94777066217", // international format, digits only
  email: "info@srilankaexpotours.com", // TODO
  address: {
    street: "578 B/1 Madiwela Road",
    city: "Thalawatugoda",
    region: "Colombo",
    country: "Sri Lanka",
    countryCode: "LK",
  },
  /** Office / meeting point shown on the contact map (Madiwela Road, Thalawatugoda). */
  meetingPoint: [6.8775, 79.9285] as [number, number],
  licenseNumber: "SLTDA Reg. No. — TBC", // TODO: Sri Lanka Tourism Development Authority licence
  founder: "Nishan Silva",
  founderPhoto: "/media/pages/nishan-silva.jpg",
  rating: { value: 4.9, count: 2300 },
  social: {
    facebook: "https://facebook.com/", // TODO
    instagram: "https://instagram.com/", // TODO
    google: "https://g.page/", // TODO: Google Business profile
  },
  /** Downloadable licence / insurance documents. Put PDFs in /public/documents and list them here. */
  documents: [] as { label: string; href: string }[],
  /** Optional hero background video in /public (e.g. "/media/hero-loop.mp4"). Falls back to the image carousel. */
  heroVideo: null as string | null,
  /** Approximate conversion rates from USD, used by the currency switcher. */
  currencyRates: { USD: 1, EUR: 0.92 } as const,
};

export type Currency = keyof typeof site.currencyRates;
