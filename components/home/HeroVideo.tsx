"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Price } from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { getTour } from "@/lib/data/tours";
import { href, intlLocale, l } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Hero photos (Unsplash, see /public/media/CREDITS.md). The first one is the LCP image and is
// visible immediately; the others load only when the visitor picks them. No autoplay.
const slides = [
  { label: "Tea country", image: "/media/hero/tea-country.jpg" },
  { label: "Sigiriya", image: "/media/hero/sigiriya.jpg" },
  { label: "Mirissa", image: "/media/hero/mirissa.jpg" },
];

const places = ["Sigiriya", "Ella", "Galle"];

export function HeroVideo() {
  const { lang, dict } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [loaded, setLoaded] = useState([0]);
  const featured = getTour("classic-sri-lanka-7-days");

  // Gentle parallax on the photo only (max 8%), desktop only via the md: class below.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const pick = (i: number) => {
    setLoaded((prev) => (prev.includes(i) ? prev : [...prev, i]));
    setSlide(i);
  };

  // "Discover Sri Lanka: tailor-made tours…" is one H1, set on two lines.
  const [lead, ...restParts] = dict.hero.title.split(": ");
  const rest = restParts.join(": ");

  return (
    <section
      ref={ref}
      className="on-green relative isolate mt-16 flex min-h-[88svh] items-end overflow-hidden bg-primary-600 md:mt-28 md:h-[88svh] md:max-h-[920px] md:min-h-[600px]"
    >
      {/* Photo (or video) layer */}
      <motion.div style={{ y: reduce ? 0 : bgY }} className="absolute inset-0 -z-20 max-md:!transform-none">
        {site.heroVideo ? (
          <video className="h-full w-full object-cover" src={site.heroVideo} autoPlay muted loop playsInline preload="metadata" aria-hidden />
        ) : (
          slides.map(
            (s, i) =>
              loaded.includes(i) && (
                <Image
                  key={s.image}
                  src={s.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className={cn(
                    "object-cover transition-opacity duration-700",
                    i === 0 && "hero-zoom",
                    i === slide ? "opacity-100" : "opacity-0"
                  )}
                />
              )
          )
        )}
      </motion.div>

      {/* Tea Green gradient keeps ivory text legible */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_74_60/0.92),rgb(15_74_60/0.55)_45%,rgb(15_74_60/0.15))]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(15_74_60/0.55),transparent_70%)]" />

      <div className="container-site grid gap-8 pt-16 pb-28 md:pt-0 md:pb-32 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <Reveal as="p" className="tagline mb-4 flex items-center gap-3 text-lg text-ivory sm:text-xl">
            <span aria-hidden className="h-px w-8 bg-accent" />
            {site.tagline}
          </Reveal>

          <h1 className="text-ivory">
            <Reveal as="span" variant="rise" delay={0.1} className="h1 block">
              {lead}
              {rest && <span className="sr-only">: </span>}
            </Reveal>
            {rest && (
              <Reveal as="span" variant="rise" delay={0.2} className="mt-2 block font-heading text-[clamp(1.375rem,3.2vw,2.25rem)] leading-tight font-medium">
                {rest.charAt(0).toUpperCase() + rest.slice(1)}
              </Reveal>
            )}
          </h1>

          <Reveal as="p" delay={0.3} className="mt-4 max-w-2xl text-base text-ivory/90 sm:text-lg">
            {dict.hero.subtitle}
          </Reveal>

          <Reveal delay={0.4} className="mt-7 flex flex-wrap gap-3">
            <a href="#search" className="btn btn-accent">
              {dict.hero.ctaPrimary} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
            </a>
            <Link href={href(lang, "/contact")} className="btn btn-ghost-light">
              {dict.hero.ctaSecondary}
            </Link>
          </Reveal>

          <Reveal delay={0.5} className="mt-6 flex items-center gap-3 text-sm text-ivory/90">
            <Stars rating={5} size={16} label={dict.common.stars} />
            <span>
              <strong className="font-semibold text-ivory">{site.rating.value}</strong> · {site.rating.count.toLocaleString(intlLocale[lang])}{" "}
              {dict.hero.travellers}
            </span>
          </Reveal>
        </div>

        {/* Best-seller card: bottom-right on desktop, below the CTAs on mobile */}
        <Reveal delay={0.6} className="flex flex-col gap-3 lg:w-72">
          <ul aria-hidden className="hidden flex-wrap gap-2 lg:flex">
            {places.map((p) => (
              <li key={p} className="inline-flex items-center gap-1 rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-primary">
                <MapPin className="h-3.5 w-3.5 text-accent-700" /> {p}
              </li>
            ))}
          </ul>
          {featured && (
            <Link
              href={href(lang, `/tours/${featured.slug}`)}
              className="card-lift group block rounded-card bg-ivory p-4 text-ink shadow-lift"
            >
              <span className="inline-block rounded-full bg-cinnamon-dark px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                {dict.tour.bestSeller}
              </span>
              <span className="mt-2 block font-heading text-lg font-semibold text-primary">{l(featured.title, lang)}</span>
              <span className="mt-1 block text-sm text-muted">
                {dict.tour.from} <Price usd={featured.prices.standard} className="font-semibold text-primary" /> / {dict.tour.perPerson}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {dict.tour.details} <ArrowRight className="card-arrow h-4 w-4" aria-hidden />
              </span>
            </Link>
          )}
        </Reveal>
      </div>

      {/* Photo picker (manual, no autoplay) */}
      {!site.heroVideo && (
        <div className="absolute top-4 right-4 flex gap-1 md:top-6 md:right-6" role="group" aria-label={dict.gallery.title}>
          {slides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              onClick={() => pick(i)}
              aria-label={s.label}
              aria-pressed={i === slide}
              className="grid h-11 w-8 place-items-center"
            >
              <span className={cn("block h-1.5 rounded-full transition-all duration-300", i === slide ? "w-7 bg-accent" : "w-3 bg-ivory/70")} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
