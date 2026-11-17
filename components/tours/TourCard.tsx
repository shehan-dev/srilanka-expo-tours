"use client";

import Link from "next/link";
import { ArrowRight, Clock, Eye, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Media } from "@/components/ui/Media";
import { Price } from "@/components/ui/Price";
import { ThemeIcon, themeChipClass } from "@/components/ui/ThemeIcon";
import { href, l } from "@/lib/i18n/config";
import type { Tour } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TourTags({ tour, className }: { tour: Tour; className?: string }) {
  const { dict } = useI18n();
  const labels: Record<Tour["tags"][number], string> = {
    "best-seller": dict.tour.bestSeller,
    family: dict.tour.family,
    new: dict.tour.new,
    honeymoon: dict.tour.honeymoon,
  };
  if (!tour.tags.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {tour.tags.map((t) => (
        <li
          key={t}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
            t === "best-seller" ? "bg-cinnamon-dark text-white" : "bg-ivory text-primary"
          )}
        >
          {labels[t]}
        </li>
      ))}
    </ul>
  );
}

/** Standard (3★) and Premium (4★ & 5★) prices side by side. */
export function TourPrices({ tour, size = "md", className }: { tour: Tour; size?: "md" | "lg"; className?: string }) {
  const { dict } = useI18n();
  const options = [
    { key: "standard" as const, label: dict.tour.standard, hotels: dict.tour.standardHotels },
    { key: "premium" as const, label: dict.tour.premium, hotels: dict.tour.premiumHotels },
  ];
  return (
    <dl className={cn("grid grid-cols-2 gap-2", className)}>
      {options.map((o) => (
        <div key={o.key} className={cn("rounded-control px-3 py-2", o.key === "premium" ? "bg-primary-50" : "bg-ivory")}>
          <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            {o.label} <span className="font-normal normal-case">· {o.hotels}</span>
          </dt>
          <dd>
            <span className="text-xs text-muted">{dict.tour.from} </span>
            <Price usd={tour.prices[o.key]} className={cn("font-heading font-semibold text-primary", size === "lg" ? "text-2xl" : "text-lg")} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Tour card. The whole card is clickable through one link (the title's stretched ::after);
 * the optional "Quick view" button is a sibling layered above it, never nested inside the link.
 * Hover/focus: lift 4px, image scales to 1.05, the "View tour →" arrow nudges right.
 */
export function TourCard({
  tour,
  onPreview,
  variant = "grid",
  priority,
  feature,
}: {
  tour: Tour;
  onPreview?: (tour: Tour) => void;
  variant?: "grid" | "list";
  priority?: boolean;
  /** Larger "feature" styling used for the Popular tours section. */
  feature?: boolean;
}) {
  const { lang, dict } = useI18n();
  const title = l(tour.title, lang);
  const detailHref = href(lang, `/tours/${tour.slug}`);
  const theme = tour.themes[0];

  if (variant === "list") {
    return (
      <article className="card card-lift relative flex gap-4 p-3">
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-control sm:w-44">
          <Media src={tour.image} scene={tour.scene} alt="" sizes="176px" className="card-img" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
          <h3 className="text-base font-semibold sm:text-lg">
            <Link href={detailHref} className="after:absolute after:inset-0 after:rounded-card hover:underline">
              {title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm text-muted">{l(tour.tagline, lang)}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock className="h-4 w-4" aria-hidden /> {tour.durationDays} {dict.tour.days}
            </span>
            <span className="ml-auto text-muted">
              {dict.tour.standard} <Price usd={tour.prices.standard} className="font-semibold text-primary" />
              <span aria-hidden> · </span>
              {dict.tour.premium} <Price usd={tour.prices.premium} className="font-semibold text-primary" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card card-lift relative flex h-full flex-col overflow-hidden">
      <div className={cn("relative overflow-hidden", feature ? "aspect-[4/3] md:aspect-[5/4]" : "aspect-[4/3]")}>
        <Media src={tour.image} scene={tour.scene} alt="" priority={priority} className="card-img" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(15_74_60/0.55),transparent_45%)]" />
        <TourTags tour={tour} className="absolute top-3 left-3" />
        {/* Duration and category chips on the image */}
        <ul className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 text-xs font-semibold">
          <li className="inline-flex items-center gap-1 rounded-full bg-ivory px-2.5 py-1 text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {tour.durationDays} {dict.tour.days}
          </li>
          <li className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1", themeChipClass(theme))}>
            <ThemeIcon theme={theme} className="h-3.5 w-3.5" />
            {dict.themes[theme]}
          </li>
        </ul>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className={cn("font-semibold", feature ? "text-xl md:text-2xl" : "text-lg")}>
          <Link href={detailHref} className="after:absolute after:inset-0 after:z-[1] after:rounded-card focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{l(tour.tagline, lang)}</p>
        <p className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3.5 w-3.5 text-accent-700" aria-hidden /> {dict.regions[tour.regions[0]]}
          {tour.regions.length > 1 && ` +${tour.regions.length - 1}`}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <TourPrices tour={tour} />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted">{dict.tour.perPerson}</span>
            <span aria-hidden className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              {dict.tour.view} <ArrowRight className="card-arrow h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {onPreview && (
        <button
          type="button"
          onClick={() => onPreview(tour)}
          className="absolute top-3 right-3 z-[2] inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ivory px-3 py-1.5 text-xs font-semibold text-primary shadow-card transition-colors hover:bg-white"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {dict.popular.preview}
          <span className="sr-only">: {title}</span>
        </button>
      )}
    </article>
  );
}
