"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, PenLine } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { testimonials } from "@/lib/data/testimonials";
import { intlLocale, l } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { cn, easeOutExpo } from "@/lib/utils";

const sourceName = { google: "Google", letter: "" };
const countryName: Record<string, { en: string; it: string }> = { Italy: { en: "Italy", it: "Italia" } };

/** "2026-08" → "August 2026" / "agosto 2026" */
const monthYear = (ym: string, locale: string) => new Date(`${ym}-01T12:00:00`).toLocaleDateString(locale, { month: "long", year: "numeric" });

/** Manually controlled review carousel: arrows, dots and swipe. No autoplay. */
export function TestimonialsSlider() {
  const { lang, dict } = useI18n();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = testimonials.length;

  const go = (next: number, dir = next > index ? 1 : -1) => {
    setDirection(dir);
    setIndex((next + count) % count);
  };

  const r = testimonials[index];

  return (
    <section aria-labelledby="reviews-title" className="section overflow-hidden">
      <div className="container-site">
        <SectionHeading id="reviews-title" eyebrow={dict.testimonials.eyebrow} title={dict.testimonials.title} />

        <div className="grid items-center gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div role="region" aria-roledescription="carousel" aria-label={dict.testimonials.title}>
            <div className="relative min-h-[460px] sm:min-h-[380px]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.figure
                  key={r.id}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.28, ease: easeOutExpo }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(index + 1, 1);
                    else if (info.offset.x > 60) go(index - 1, -1);
                  }}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} / ${count}`}
                  className="flex cursor-grab touch-pan-y flex-col gap-5 active:cursor-grabbing"
                >
                  <span aria-hidden className="font-heading text-7xl leading-[0.6] text-accent">
                    &ldquo;
                  </span>
                  <blockquote
                    lang={lang === "en" ? "en" : "it"}
                    className={cn(
                      "tagline leading-snug text-primary",
                      l(r.quote, lang).length > 220 ? "text-lg md:text-xl" : "text-2xl md:text-[1.75rem]"
                    )}
                  >
                    {l(r.quote, lang)}
                  </blockquote>
                  {lang === "en" && <p className="-mt-2 text-xs text-muted">{dict.testimonials.translated}</p>}
                  <Stars rating={r.rating} label={dict.common.stars} size={18} />
                  <figcaption className="flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <span className="text-3xl" role="img" aria-label={r.country}>
                        {r.flag}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink">{r.name}</span>
                        <span className="text-sm text-muted">
                          {countryName[r.country]?.[lang] ?? r.country}
                          {r.date && ` · ${monthYear(r.date, intlLocale[lang])}`}
                        </span>
                      </span>
                    </span>
                    {r.link && (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        {dict.testimonials.readOn} {sourceName[r.source]} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(index - 1, -1)}
                aria-label={dict.testimonials.prev}
                className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-primary text-primary transition-colors hover:bg-primary-50"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <div className="flex">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${dict.testimonials.goTo} ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="grid h-11 w-6 place-items-center"
                  >
                    <span className={cn("block h-2 rounded-full transition-all duration-300", i === index ? "w-6 bg-primary" : "w-2 bg-line")} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(index + 1, 1)}
                aria-label={dict.testimonials.next}
                className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-primary text-primary transition-colors hover:bg-primary-50"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>

          <aside className="flex flex-col gap-5 rounded-panel bg-white p-8 shadow-card ring-1 ring-line/60">
            <Stars rating={5} label={dict.common.stars} size={22} />
            <p className="font-heading text-2xl leading-snug font-semibold text-primary">{dict.testimonials.reviewPrompt}</p>
            <a href={site.googleReview} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm self-start">
              <PenLine className="h-4 w-4" aria-hidden /> {dict.testimonials.write} · Google
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
