// Content shapes. These mirror the documents you'd model in a headless CMS
// (Sanity / Strapi / Contentful) so the data files in lib/data can be swapped
// for CMS queries without touching components.

export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];

/** A string translated into every supported locale. */
export type L10n = Record<Locale, string>;
/** A list of strings translated into every supported locale. */
export type L10nList = Record<Locale, string[]>;

/** Illustrated fallback used whenever a real photo hasn't been supplied yet. */
export type Scene = "hills" | "coast" | "temple" | "rock" | "safari" | "city";

export type RegionId =
  | "hill-country"
  | "cultural-triangle"
  | "south-coast"
  | "east-coast"
  | "national-parks"
  | "city";

export type ThemeId = "culture" | "nature" | "wildlife" | "beach" | "adventure" | "family" | "food";
export type GuideLanguage = "it" | "en" | "de" | "fr";

export type PackageOption = "standard" | "premium";

export interface Tour {
  id: string;
  slug: string;
  title: L10n;
  tagline: L10n;
  description: L10n;
  durationDays: number;
  /**
   * Indicative price per person in USD (2 sharing).
   * standard = 3★ hotels, premium = 4★ & 5★ hotels.
   */
  prices: Record<PackageOption, number>;
  regions: RegionId[];
  themes: ThemeId[];
  scene: Scene;
  image?: string;
  /** Photographer credit for `image` (Unsplash License). */
  imageCredit?: { name: string; url: string };
  tags: ("best-seller" | "family" | "new" | "honeymoon")[];
  popular?: boolean;
  highlights: L10nList;
  /** Each stop covers `days` days (default 1); the sum must equal durationDays. */
  itinerary: { title: L10n; description: L10n; days?: number }[];
  includes: L10nList;
  /** Main location of the tour, used for map pins. */
  coords: [number, number];
}

export interface Destination {
  id: string;
  name: string;
  region: RegionId;
  blurb: L10n;
  bestMonths: L10n;
  highlights: L10nList;
  scene: Scene;
  image?: string;
  coords: [number, number];
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  flag: string;
  rating: number;
  quote: L10n;
  source: "google";
  link: string;
  date: string;
}

export type BlogCategory = "for-italians" | "food-drink" | "practical" | "nature";

export interface BlogPost {
  slug: string;
  title: L10n;
  excerpt: L10n;
  category: BlogCategory;
  date: string;
  readMinutes: number;
  author: string;
  scene: Scene;
  image?: string;
  /** Lightweight markup: "## " = heading, "- " = bullet, blank line = new paragraph. */
  body: L10n;
}

export type VehicleFeature = "ac" | "wifi" | "seatbelts" | "usb" | "cooler" | "recliner";

export interface Vehicle {
  id: string;
  name: L10n;
  model: string;
  capacity: number;
  luggage: number;
  features: VehicleFeature[];
  /** USD per day including driver, fuel and highway tolls. */
  pricePerDay: number;
  icon: "car" | "van" | "bus";
  image?: string;
}

export type FaqCategory = "booking" | "visas" | "health" | "cancellations" | "tips";

export interface Faq {
  id: string;
  category: FaqCategory;
  question: L10n;
  answer: L10n;
}

export type GalleryCategory = "food" | "nature" | "culture" | "vehicles";

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  caption: L10n;
  scene: Scene;
  image?: string;
  video?: string;
  aspect: "tall" | "wide" | "square";
}

export interface Attraction {
  id: string;
  name: string;
  region: RegionId;
  /** Indicative foreign-visitor entrance fee in USD per person. */
  fee: number;
  coords: [number, number];
}
