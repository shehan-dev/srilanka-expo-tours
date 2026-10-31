import type { Metadata } from "next";
import { locales, type Locale, l } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import type { BlogPost, Faq, Tour } from "@/lib/types";

const ogLocale: Record<Locale, string> = { en: "en_GB", it: "it_IT" };

/** Per-page metadata with canonical URL and hreflang alternates for every locale. */
export function pageMetadata({
  lang,
  path = "",
  title,
  description,
  type = "website",
}: {
  lang: Locale;
  path?: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const languages = Object.fromEntries(locales.map((loc) => [loc, `/${loc}${path}`]));
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { ...languages, "x-default": `/en${path}` },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}${path}`,
      siteName: site.name,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((loc) => loc !== lang).map((loc) => ogLocale[loc]),
      type,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const abs = (path: string) => `${site.url}${path}`;

export const organizationLd = (lang: Locale, description: string) => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: site.name,
  url: abs(`/${lang}`),
  logo: abs("/icon.svg"),
  description,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.countryCode,
  },
  founder: { "@type": "Person", name: site.founder, jobTitle: "Founder & Chauffeur Tourist Guide", image: abs(site.founderPhoto) },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating.value,
    reviewCount: site.rating.count,
  },
  knowsLanguage: ["it", "en"],
  sameAs: Object.values(site.social),
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

export const tourLd = (tour: Tour, lang: Locale) => ({
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: l(tour.title, lang),
  description: l(tour.description, lang),
  url: abs(`/${lang}/tours/${tour.slug}`),
  touristType: tour.themes,
  itinerary: {
    "@type": "ItemList",
    numberOfItems: tour.itinerary.length,
    itemListElement: tour.itinerary.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l(d.title, lang),
      description: l(d.description, lang),
    })),
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: tour.prices.standard,
    highPrice: tour.prices.premium,
    offerCount: 2,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: abs(`/${lang}/tours/${tour.slug}`),
  },
  provider: { "@type": "TravelAgency", name: site.name, url: site.url },
});

export const faqLd = (items: Faq[], lang: Locale) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: l(f.question, lang),
    acceptedAnswer: { "@type": "Answer", text: l(f.answer, lang) },
  })),
});

export const articleLd = (post: BlogPost, lang: Locale) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: l(post.title, lang),
  description: l(post.excerpt, lang),
  datePublished: post.date,
  inLanguage: lang,
  author: { "@type": "Person", name: post.author },
  publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: abs("/icon.svg") } },
  mainEntityOfPage: abs(`/${lang}/blog/${post.slug}`),
  ...(post.image ? { image: abs(post.image) } : {}),
});
