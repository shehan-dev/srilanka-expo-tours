"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, PenLine, Quote } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { testimonials } from "@/lib/data/testimonials";
import { intlLocale, l } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { cn, formatDate } from "@/lib/utils";

const sourceName = { google: "Google" };

/** Auto-advancing review carousel. Pauses on hover/focus; fully keyboard operable. */
export function TestimonialsSlider() {
  const { lang, dict } = useI18n();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = (next: number, dir = next > index ? 1 : -1) => {
    setDirection(dir);
    setIndex((next + count) % count);
  };

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(index + 1, 1), 7000);
    return () => clearTimeout(t);
  }, [index, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  const r = testimonials[index];

  return (
    <section aria-labelledby="reviews-title" className="section overflow-hidden bg-linear-to-b from-sky/60 to-white">
      <div className="container-site">
        <SectionHeading id="reviews-title" eyebrow={dict.testimonials.eyebrow} title={dict.testimonials.title} />

        <div
          className="relative mx-auto max-w-3xl"
          role="region"
          aria-roledescription="carousel"
          aria-label={dict.testimonials.title}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative min-h-[300px] sm:min-h-[260px]" aria-live={paused ? "polite" : "off"}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={r.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${count}`}
                className="card relative flex flex-col gap-5 p-8 md:p-10"
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 text-sky-200" aria-hidden />
                <Stars rating={r.rating} label={dict.common.stars} size={18} />
                <blockquote className="font-heading text-xl leading-relaxed text-ink md:text-2xl">“{l(r.quote, lang)}”</blockquote>
                <figcaption className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="text-3xl" role="img" aria-label={r.country}>
                      {r.flag}
                    </span>
                    <span>
                      <span className="block font-semibold">{r.name}</span>
                      <span className="text-sm text-muted">
                        {r.country} · {formatDate(r.date, intlLocale[lang])}
                      </span>
                    </span>
                  </span>
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline"
                  >
                    {dict.testimonials.readOn} {sourceName[r.source]} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              aria-label={dict.testimonials.prev}
              className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card ring-1 ring-line hover:bg-sky"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${dict.testimonials.goTo} ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn("h-2.5 rounded-full transition-all", i === index ? "w-8 bg-primary" : "w-2.5 bg-line hover:bg-primary/40")}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              aria-label={dict.testimonials.next}
              className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card ring-1 ring-line hover:bg-sky"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center">
          {[
            { value: "450+", label: dict.testimonials.toursRun },
            { value: `${site.rating.count.toLocaleString(intlLocale[lang])}+`, label: dict.testimonials.travellers },
            { value: `${site.rating.value}★`, label: dict.testimonials.avgRating },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-primary-600">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <a href={site.social.google} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <PenLine className="h-4 w-4" aria-hidden /> {dict.testimonials.write} · Google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
