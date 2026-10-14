"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Media } from "@/components/ui/Media";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";
import { getTour } from "@/lib/data/tours";
import { href, l } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import type { Scene } from "@/lib/types";
import { easeOutExpo } from "@/lib/utils";

// Progressive hero carousel (used when no hero video is configured in lib/site.ts).
// Photos: Unsplash (see /public/media/CREDITS.md).
const slides: { scene: Scene; image?: string }[] = [
  { scene: "hills", image: "/media/hero/tea-country.jpg" },
  { scene: "rock", image: "/media/hero/sigiriya.jpg" },
  { scene: "coast", image: "/media/hero/mirissa.jpg" },
];

const pins = [
  { label: "Sigiriya", top: "30%", left: "62%", depth: 60 },
  { label: "Ella", top: "52%", left: "78%", depth: 110 },
  { label: "Galle", top: "68%", left: "56%", depth: 160 },
];

/** Splits text into letters that slide up in sequence (700ms, brand easing). */
function SplitHeadline({ text }: { text: string }) {
  let index = 0;
  return (
    <h1 aria-label={text} className="h1 max-w-4xl text-white drop-shadow-[0_2px_18px_rgb(15_23_36/0.35)]">
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden className="inline-block overflow-hidden pb-1 align-bottom whitespace-nowrap">
          {Array.from(word).map((char) => {
            const delay = 0.2 + index++ * 0.018;
            return (
              <motion.span
                key={`${w}-${index}`}
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: easeOutExpo, delay }}
              >
                {char}
              </motion.span>
            );
          })}
          {" "}
        </span>
      ))}
    </h1>
  );
}

export function HeroVideo() {
  const { lang, dict } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const featured = getTour("classic-sri-lanka-7-days");

  // Parallax layers move at different speeds as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (site.heroVideo || reduce) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink h-[100svh]">
      {/* Background: video or crossfading carousel */}
      <motion.div style={{ y: reduce ? 0 : bgY }} className="absolute inset-0 -z-20 scale-110">
        {site.heroVideo ? (
          <video
            className="h-full w-full object-cover"
            src={site.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : (
          <AnimatePresence initial={false}>
            <motion.div
              key={slide}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: "linear" } }}
            >
              <Media src={slides[slide].image} scene={slides[slide].scene} alt="" sizes="100vw" priority={slide === 0} />
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Readability overlay */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-ink/70 via-ink/35 to-ink/70" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-ink/60 via-transparent to-transparent" />

      {/* Floating location pins (parallax) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        {pins.map((pin, i) => (
          <ParallaxPin key={pin.label} {...pin} progress={scrollYProgress} delay={1.2 + i * 0.15} />
        ))}
      </div>

      <motion.div style={{ y: reduce ? 0 : contentY, opacity: fade }} className="container-site relative pt-24 pb-28 md:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
        >
          <span aria-hidden>🇮🇹</span> {dict.hero.badge}
        </motion.p>

        <SplitHeadline text={dict.hero.title} />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: easeOutExpo }}
          className="mt-5 max-w-2xl text-lg text-white/90 sm:text-xl"
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05, ease: easeOutExpo }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a href="#search" className="btn btn-primary text-base">
            {dict.hero.ctaPrimary} <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <Link href={href(lang, "/contact")} className="btn btn-ghost-light text-base">
            <Sparkles className="h-4 w-4" aria-hidden /> {dict.hero.ctaSecondary}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.25 }}
          className="mt-8 flex items-center gap-3 text-sm text-white/90"
        >
          <Stars rating={5} size={16} label={dict.common.stars} />
          <span>
            <strong className="font-semibold text-white">{site.rating.value}</strong> ·{" "}
            {site.rating.count.toLocaleString(lang === "it" ? "it-IT" : "en-GB")} {dict.hero.travellers}
          </span>
        </motion.div>
      </motion.div>

      {/* Translucent overlay card — featured tour */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4, ease: easeOutExpo }}
          className="absolute right-8 bottom-24 hidden w-72 rounded-3xl border border-white/25 bg-white/15 p-4 text-white shadow-2xl backdrop-blur-xl xl:block"
        >
          <p className="text-xs font-semibold tracking-widest text-white/80 uppercase">{dict.tour.bestSeller}</p>
          <p className="mt-1 font-heading text-lg font-semibold">{l(featured.title, lang)}</p>
          <p className="mt-1 text-sm text-white/85">
            {dict.tour.from} <Price usd={featured.prices.standard} className="font-semibold text-white" /> / {dict.tour.perPerson}
          </p>
          <Link
            href={href(lang, `/tours/${featured.slug}`)}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            {dict.tour.details} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      )}

      {/* Carousel indicators + scroll cue (kept above the overlapping booking bar) */}
      <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-24">
        {!site.heroVideo && (
          <div className="flex gap-2" aria-hidden>
            {slides.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-8 bg-white" : "w-3 bg-white/50"}`} />
            ))}
          </div>
        )}
        <a href="#search" className="hidden items-center gap-1 text-xs text-white/80 hover:text-white md:flex">
          {dict.hero.scroll}
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
        </a>
      </div>
    </section>
  );
}

function ParallaxPin({
  label,
  top,
  left,
  depth,
  delay,
  progress,
}: {
  label: string;
  top: string;
  left: string;
  depth: number;
  delay: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [0, -depth]);
  return (
    <motion.div style={{ top, left, y }} className="absolute">
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: "spring", stiffness: 260, damping: 16 }}
        className="flex animate-float flex-col items-center"
      >
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-lg">{label}</span>
        <MapPin className="h-8 w-8 fill-accent text-white drop-shadow-lg" />
      </motion.div>
    </motion.div>
  );
}
