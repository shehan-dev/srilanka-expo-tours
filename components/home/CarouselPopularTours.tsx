"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TourCard } from "@/components/tours/TourCard";
import { TourPreviewModal } from "@/components/tours/TourPreviewModal";
import { popularTours } from "@/lib/data/tours";
import { href } from "@/lib/i18n/config";
import type { Tour } from "@/lib/types";

/**
 * Popular tours as large feature cards: 3-up grid on desktop, 2-up on tablet,
 * a horizontal scroll-snap carousel on mobile (partial next card visible, no autoplay).
 */
export function CarouselPopularTours() {
  const { lang, dict } = useI18n();
  const [preview, setPreview] = useState<Tour | null>(null);

  return (
    <section id="popular" aria-labelledby="popular-title" className="section bg-white">
      <div className="container-site">
        <SectionHeading
          id="popular-title"
          eyebrow={dict.popular.eyebrow}
          title={dict.popular.title}
          subtitle={dict.popular.subtitle}
          align="left"
          action={
            <Link href={href(lang, "/tours")} className="inline-flex min-h-11 items-center gap-1 font-semibold text-primary hover:underline">
              {dict.popular.viewAll} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />

        <ul
          aria-label={dict.popular.title}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-7"
        >
          {popularTours.slice(0, 6).map((tour, i) => (
            <Reveal as="li" key={tour.id} delay={(i % 3) * 0.075} className="w-[82%] shrink-0 snap-start sm:w-auto">
              <TourCard tour={tour} onPreview={setPreview} feature />
            </Reveal>
          ))}
        </ul>
      </div>

      <TourPreviewModal tour={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
