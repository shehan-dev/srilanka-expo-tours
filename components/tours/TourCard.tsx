"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Clock, Eye, MapPin, Tag } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Media } from "@/components/ui/Media";
import { Price } from "@/components/ui/Price";
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
            "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase shadow-sm",
            t === "best-seller" ? "bg-star text-ink" : t === "honeymoon" ? "bg-white text-primary-600" : "bg-accent text-ink"
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
        <div key={o.key} className={cn("rounded-xl px-3 py-2", o.key === "premium" ? "bg-primary-50" : "bg-sky")}>
          <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">
            {o.label} <span className="font-normal normal-case">· {o.hotels}</span>
          </dt>
          <dd>
            <Price usd={tour.prices[o.key]} className={cn("font-heading font-bold text-ink", size === "lg" ? "text-2xl" : "text-lg")} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Tour card with hover tilt + elevation and a CTA that slides in on hover. */
export function TourCard({
  tour,
  onPreview,
  variant = "grid",
  priority,
}: {
  tour: Tour;
  onPreview?: (tour: Tour) => void;
  variant?: "grid" | "list";
  priority?: boolean;
}) {
  const { lang, dict } = useI18n();
  const title = l(tour.title, lang);
  const detailHref = href(lang, `/tours/${tour.slug}`);

  // Tilt: map pointer position to small rotations, smoothed with a spring.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  if (variant === "list") {
    return (
      <article className="card group relative flex gap-4 p-3 transition-shadow hover:shadow-lift">
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-xl sm:w-44">
          <Media src={tour.image} scene={tour.scene} alt={title} sizes="176px" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
          <h3 className="text-base font-semibold sm:text-lg">
            <Link href={detailHref} className="after:absolute after:inset-0 hover:text-primary">
              {title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm text-muted">{l(tour.tagline, lang)}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock className="h-4 w-4" aria-hidden /> {tour.durationDays} {dict.tour.days}
            </span>
            <span className="ml-auto text-muted">
              {dict.tour.standard} <Price usd={tour.prices.standard} className="font-semibold text-ink" />
              <span aria-hidden> · </span>
              {dict.tour.premium} <Price usd={tour.prices.premium} className="font-semibold text-primary-600" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <motion.article
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
      className="card group relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Media
          src={tour.image}
          scene={tour.scene}
          alt={title}
          priority={priority}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-transparent" />
        <TourTags tour={tour} className="absolute top-3 left-3" />
        {onPreview && (
          <button
            type="button"
            onClick={() => onPreview(tour)}
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow transition hover:bg-white"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {dict.popular.preview}
            <span className="sr-only">: {title}</span>
          </button>
        )}
        <p className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-ink/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {tour.durationDays} {dict.tour.days}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold">
          <Link href={detailHref} className="hover:text-primary focus-visible:outline-offset-4">
            {title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{l(tour.tagline, lang)}</p>

        <ul className="flex flex-wrap gap-2 text-xs">
          <li className="tag">
            <Tag className="h-3.5 w-3.5" aria-hidden /> {dict.themes[tour.themes[0]]}
          </li>
          <li className="tag">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> {dict.regions[tour.regions[0]]}
            {tour.regions.length > 1 && ` +${tour.regions.length - 1}`}
          </li>
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <TourPrices tour={tour} />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted">/ {dict.tour.perPerson}</span>
            <Link href={detailHref} className="btn btn-primary btn-sm group/view">
              {dict.tour.view}
              <span className="sr-only">: {title}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/view:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
