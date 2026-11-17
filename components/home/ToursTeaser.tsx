"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TourCard } from "@/components/tours/TourCard";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { tours } from "@/lib/data/tours";
import { href } from "@/lib/i18n/config";
import type { ThemeId } from "@/lib/types";
import { easeOutExpo } from "@/lib/utils";

const tabs: ("all" | ThemeId)[] = ["all", "culture", "nature", "wildlife", "beach", "family", "food"];

/** Home-page slice of the catalog: category tabs + 6 tours, linking to the full searchable catalog. */
export function ToursTeaser() {
  const { lang, dict } = useI18n();
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const shown = tours.filter((t) => tab === "all" || t.themes.includes(tab)).slice(0, 6);

  return (
    <section aria-labelledby="catalog-title" className="section">
      <div className="container-site">
        <SectionHeading
          id="catalog-title"
          eyebrow={dict.catalog.eyebrow}
          title={dict.catalog.title}
          subtitle={dict.catalog.subtitle}
        />
        
        <div role="tablist" aria-label={dict.catalog.filters} className="chip-row mb-8 md:justify-center">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              aria-controls="catalog-panel"
              onClick={() => setTab(t)}
              className="chip chip-slide relative"
            >
              {tab === t && (
                <motion.span layoutId="teaser-pill" aria-hidden className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ duration: 0.28, ease: easeOutExpo }} />
              )}
              {t !== "all" && <ThemeIcon theme={t} className="h-4 w-4" />}
              {t === "all" ? dict.catalog.all : dict.themes[t]}
            </button>
          ))}
        </div>

        <div id="catalog-panel" role="tabpanel">
          <motion.ul layout className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {shown.map((tour) => (
                <motion.li
                  key={tour.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: easeOutExpo }}
                >
                  <TourCard tour={tour} variant="list" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={href(lang, tab === "all" ? "/tours" : `/tours?theme=${tab}`)} className="btn btn-primary">
            {dict.popular.viewAll} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
          </section>
  );
}
