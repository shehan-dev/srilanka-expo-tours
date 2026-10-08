"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarHeart, List, Map as MapIcon, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { MapView } from "@/components/map/MapView";
import { Media } from "@/components/ui/Media";
import { destinations } from "@/lib/data/destinations";
import { href, l } from "@/lib/i18n/config";
import type { Destination, RegionId } from "@/lib/types";
import { cn } from "@/lib/utils";

const regionOrder: RegionId[] = ["hill-country", "cultural-triangle", "south-coast", "east-coast", "national-parks", "city"];

function DestinationCard({ d, active, onFocus }: { d: Destination; active: boolean; onFocus: () => void }) {
  const { lang, dict } = useI18n();
  return (
    <article
      onMouseEnter={onFocus}
      onFocus={onFocus}
      className={cn(
        "card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lift",
        active && "ring-2 ring-accent"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Media src={d.image} scene={d.scene} alt={d.name} className="transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-600">
          {dict.regions[d.region]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-semibold">{d.name}</h3>
        <p className="text-sm text-muted">{l(d.blurb, lang)}</p>
        <p className="flex items-center gap-2 text-sm">
          <CalendarHeart className="h-4 w-4 text-accent-700" aria-hidden />
          <span className="font-medium">{dict.discover.bestMonths}:</span> {l(d.bestMonths, lang)}
        </p>
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">{dict.discover.topThings}</p>
          <ul className="flex flex-wrap gap-1.5">
            {l(d.highlights, lang).map((h) => (
              <li key={h} className="tag">
                <Sparkles className="h-3 w-3" aria-hidden /> {h}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`${href(lang, "/tours")}?region=${d.region}`}
          className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary-600 hover:underline"
        >
          {dict.discover.seeTours} {d.name} →
        </Link>
      </div>
    </article>
  );
}

/** Region chips, destination cards and a map/list toggle. Hovering a card highlights its pin. */
export function DestinationExplorer({ limit, showViewAll }: { limit?: number; showViewAll?: boolean }) {
  const { lang, dict } = useI18n();
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [view, setView] = useState<"list" | "map">("list");
  const [activeId, setActiveId] = useState<string>();

  const filtered = destinations.filter((d) => region === "all" || d.region === region);
  const shown = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="group" aria-label={dict.catalog.region}>
          <button type="button" className="chip shrink-0" aria-pressed={region === "all"} onClick={() => setRegion("all")}>
            {dict.catalog.all}
          </button>
          {regionOrder.map((r) => (
            <button key={r} type="button" className="chip shrink-0" aria-pressed={region === r} onClick={() => setRegion(r)}>
              {dict.regions[r]}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 rounded-full bg-sky p-1" role="group" aria-label={`${dict.discover.listView} / ${dict.discover.mapView}`}>
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition",
                view === v ? "bg-white text-primary-600 shadow-sm" : "text-ink"
              )}
            >
              {v === "list" ? <List className="h-4 w-4" aria-hidden /> : <MapIcon className="h-4 w-4" aria-hidden />}
              {v === "list" ? dict.discover.listView : dict.discover.mapView}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("grid gap-6", view === "map" && "lg:grid-cols-[1fr_1.1fr]")}>
        {view === "map" && (
          <MapView
            className="h-[360px] lg:sticky lg:top-24 lg:order-2 lg:h-[620px]"
            points={filtered.map((d) => ({
              id: d.id,
              coords: d.coords,
              title: d.name,
              subtitle: dict.regions[d.region],
              href: `${href(lang, "/tours")}?region=${d.region}`,
            }))}
            activeId={activeId}
            onSelect={setActiveId}
            linkLabel={dict.discover.seeTours}
            label={dict.discover.mapView}
          />
        )}
        <motion.ul layout className={cn("grid gap-6 sm:grid-cols-2", view === "list" && "lg:grid-cols-3")}>
          <AnimatePresence mode="popLayout">
            {shown.map((d) => (
              <motion.li
                key={d.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <DestinationCard d={d} active={view === "map" && activeId === d.id} onFocus={() => setActiveId(d.id)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {showViewAll && (
        <div className="mt-10 flex justify-center">
          <Link href={href(lang, "/discover")} className="btn btn-outline">
            {dict.discover.viewAll} →
          </Link>
        </div>
      )}
    </div>
  );
}
