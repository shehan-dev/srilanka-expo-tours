"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TourCard } from "@/components/tours/TourCard";
import { TourPreviewModal } from "@/components/tours/TourPreviewModal";
import { popularTours } from "@/lib/data/tours";
import { href } from "@/lib/i18n/config";
import type { Tour } from "@/lib/types";

/** Horizontal, snap-scrolling carousel (native touch inertia) with keyboard-accessible controls. */
export function CarouselPopularTours() {
  const { lang, dict } = useI18n();
  const track = useRef<HTMLUListElement>(null);
  const [preview, setPreview] = useState<Tour | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20), behavior: "smooth" });
  };

  return (
    <section id="popular" aria-labelledby="popular-title" className="section scroll-mt-40">
      <div className="container-site">
        <SectionHeading
          id="popular-title"
          eyebrow={dict.popular.eyebrow}
          title={dict.popular.title}
          subtitle={dict.popular.subtitle}
          align="left"
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                disabled={edges.start}
                aria-label={dict.popular.prev}
                aria-controls="popular-track"
                className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card ring-1 ring-line transition hover:bg-sky disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                disabled={edges.end}
                aria-label={dict.popular.next}
                aria-controls="popular-track"
                className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card ring-1 ring-line transition hover:bg-sky disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          }
        />
      </div>

      <ul
        id="popular-track"
        ref={track}
        onScroll={update}
        aria-roledescription="carousel"
        aria-label={dict.popular.title}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pt-2 pb-8 sm:px-6 xl:px-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))]"
      >
        {popularTours.map((tour, i) => (
          <li
            key={tour.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${popularTours.length}`}
            className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[360px]"
          >
            <TourCard tour={tour} onPreview={setPreview} />
          </li>
        ))}
      </ul>

      <div className="container-site flex justify-center">
        <Link href={href(lang, "/tours")} className="btn btn-outline">
          {dict.popular.viewAll} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <TourPreviewModal tour={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
