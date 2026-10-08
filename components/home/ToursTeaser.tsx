"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TourCard } from "@/components/tours/TourCard";
import { TourPreviewModal } from "@/components/tours/TourPreviewModal";
import { tours } from "@/lib/data/tours";
import { href } from "@/lib/i18n/config";
import type { ThemeId, Tour } from "@/lib/types";

const tabs: ("all" | ThemeId)[] = ["all", "culture", "nature", "wildlife", "beach", "family", "food"];

/** Home-page slice of the catalog: category tabs + 6 tours, linking to the full searchable catalog. */
export function ToursTeaser() {
  const { lang, dict } = useI18n();
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [preview, setPreview] = useState<Tour | null>(null);
  const shown = tours.filter((t) => tab === "all" || t.themes.includes(tab)).slice(0, 6);

  return (
    <section aria-labelledby="catalog-title" className="section bg-sky/60">
      <div className="container-site">
        <SectionHeading
          id="catalog-title"
          eyebrow={dict.catalog.eyebrow}
          title={dict.catalog.title}
          subtitle={dict.catalog.subtitle}
        />

        <div role="tablist" aria-label={dict.catalog.filters} className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1 md:justify-center">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              aria-controls="catalog-panel"
              onClick={() => setTab(t)}
              className="chip shrink-0"
            >
              {t === "all" ? dict.catalog.all : dict.themes[t]}
            </button>
          ))}
        </div>

        <div id="catalog-panel" role="tabpanel">
          <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((tour) => (
                <motion.li
                  key={tour.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
                >
                  <TourCard tour={tour} onPreview={setPreview} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={href(lang, tab === "all" ? "/tours" : `/tours?theme=${tab}`)} className="btn btn-primary">
            {dict.popular.viewAll} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
      <TourPreviewModal tour={preview} onClose={() => setPreview(null)} />
    </section>
  );
}
