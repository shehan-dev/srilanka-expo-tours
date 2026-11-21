// Business details used across the site (header, footer, contact page, JSON-LD).

export const site = {
  name: "Lankavé Tours",
  shortName: "Lankavé",
  tagline: "Feel Sri Lanka. Live the Journey.",
  /** Logo files in /public/brand. Reversed logo and monogram are not supplied yet (text fallbacks are used). */
  logo: { src: "/brand/logo-primary-notagline.png", width: 1209, height: 709 },
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.srilankaexpotours.com").replace(/\/$/, ""),
  phone: "+94 77 252 1903",
  phoneHref: "tel:+94772521903",
  whatsapp: "94772521903", // international format, digits only
  address: {
    street: "578 B/1 Madiwela Road",
    city: "Thalawatugoda",
    region: "Colombo",
    country: "Sri Lanka",
    countryCode: "LK",
  },
  /** Office / meeting point shown on the contact map (Madiwela Road, Thalawatugoda). */
  meetingPoint: [6.8775, 79.9285] as [number, number],
  founder: "Nishan Silva",
  founderPhoto: "/media/pages/nishan-silva.jpg",
  /** Opening hours (Sri Lanka time), also published in the JSON-LD. */
  openingHours: "Mo-Su 08:00-20:00",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61596901640910",
    instagram: "https://www.instagram.com/lankavetours/",
  },
  /** "Write a review" link for the Google Business profile. */
  googleReview: "https://g.page/r/CaBjhYWbtGoEECE/review",
  /** Downloadable licence / insurance documents. Put PDFs in /public/documents and list them here. */
  documents: [] as { label: string; href: string }[],
  /** Optional hero background video in /public (e.g. "/media/hero-loop.mp4"). Falls back to the image carousel. */
  heroVideo: null as string | null,
  /** Approximate conversion rates from USD, used by the currency switcher. */
  currencyRates: { USD: 1, EUR: 0.92 } as const,
};

export type Currency = keyof typeof site.currencyRates;
