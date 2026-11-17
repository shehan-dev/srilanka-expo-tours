"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarHeart, List, Map as MapIcon } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { MapView } from "@/components/map/MapView";
import { Media } from "@/components/ui/Media";
import { destinations } from "@/lib/data/destinations";
import { href, l } from "@/lib/i18n/config";
import type { Destination, RegionId } from "@/lib/types";
import { cn, easeOutExpo } from "@/lib/utils";

const regionOrder: RegionId[] = ["hill-country", "cultural-triangle", "south-coast", "east-coast", "national-parks", "city"];

/**
 * Editorial destination card: place name over a green bottom gradient on the photo. The gradient
 * deepens and the description fades up on hover/focus (always visible on touch). The whole card
 * links to the tours for that region.
 */
function DestinationCard({ d, tall, bento, active, onFocus }: { d: Destination; tall?: boolean; bento?: boolean; active: boolean; onFocus: () => void }) {
  const { lang, dict } = useI18n();
  return (
    <article
      onMouseEnter={onFocus}
      onFocus={onFocus}
      className={cn(
        "card-lift group relative isolate flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-card bg-primary-600 shadow-card",
        bento && "lg:min-h-0",
        active && "ring-2 ring-accent ring-offset-2 ring-offset-ivory"
      )}
    >
      <Media src={d.image} scene={d.scene} alt="" className="card-img -z-20" sizes={tall ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_74_60/0.92),rgb(15_74_60/0.35)_55%,transparent)]" />
      <div aria-hidden className="card-shade absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_74_60/0.96),rgb(15_74_60/0.6)_70%,rgb(15_74_60/0.2))] opacity-0" />

      <span className="absolute top-3 left-3 rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-primary">{dict.regions[d.region]}</span>

      <div className="on-green flex flex-col gap-2 p-5 text-ivory">
        <h3 className={cn("text-ivory", tall ? "text-3xl" : "text-2xl")}>
          <Link
            href={`${href(lang, "/tours")}?region=${d.region}`}
            className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
            aria-label={`${d.name}: ${dict.discover.seeTours} ${d.name}`}
          >
            {d.name}
          </Link>
        </h3>
        <p className="flex items-start gap-2 text-sm text-ivory/90">
          <CalendarHeart className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <span>
            <span className="font-semibold">{dict.discover.bestMonths}:</span> {l(d.bestMonths, lang)}
          </span>
        </p>
        <div className="hover-reveal flex flex-col gap-2">
          <p className="text-sm text-ivory/90">{l(d.blurb, lang)}</p>
          <p className="text-xs text-ivory/85">
            <span className="font-semibold tracking-[0.15em] text-accent-300 uppercase">{dict.discover.topThings}: </span>
            {l(d.highlights, lang).join(" · ")}
          </p>
          <span aria-hidden className="inline-flex items-center gap-1 text-sm font-semibold text-accent-300">
            {dict.discover.seeTours} {d.name} <ArrowRight className="card-arrow h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Region chips, editorial "bento" destination grid and a List/Map toggle. Hovering a card highlights its pin. */
export function DestinationExplorer({ limit, showViewAll }: { limit?: number; showViewAll?: boolean }) {
  const { lang, dict } = useI18n();
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [view, setView] = useState<"list" | "map">("list");
  const [activeId, setActiveId] = useState<string>();

  const filtered = destinations.filter((d) => region === "all" || d.region === region);
  const shown = limit ? filtered.slice(0, limit) : filtered;
  // Editorial bento (home page, 5 cards): one tall feature card + four smaller cards.
  const bento = view === "list" && shown.length === 5;

  const chip = (value: RegionId | "all", label: string) => (
    <button key={value} type="button" className="chip chip-slide relative" aria-pressed={region === value} onClick={() => setRegion(value)}>
      {region === value && (
        <motion.span layoutId="region-pill" aria-hidden className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ duration: 0.28, ease: easeOutExpo }} />
      )}
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="chip-row" role="group" aria-label={dict.catalog.region}>
          {chip("all", dict.catalog.all)}
          {regionOrder.map((r) => chip(r, dict.regions[r]))}
        </div>
        <div className="flex shrink-0 rounded-full border border-line bg-white p-1" role="group" aria-label={`${dict.discover.listView} / ${dict.discover.mapView}`}>
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "relative isolate inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors duration-150",
                view === v ? "text-ivory" : "text-ink hover:text-primary"
              )}
            >
              {view === v && (
                <motion.span layoutId="view-thumb" aria-hidden className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ duration: 0.28, ease: easeOutExpo }} />
              )}
              {v === "list" ? <List className="h-4 w-4" aria-hidden /> : <MapIcon className="h-4 w-4" aria-hidden />}
              {v === "list" ? dict.discover.listView : dict.discover.mapView}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("grid gap-6", view === "map" && "lg:grid-cols-[1fr_1.1fr]")}
        >
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
          <motion.ul layout className={cn("grid gap-5 sm:grid-cols-2", view === "list" && "lg:grid-cols-3", bento && "lg:auto-rows-[290px] lg:grid-cols-4")}>
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((d, i) => {
                const tall = bento && i === 0;
                return (
                  <motion.li
                    key={d.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.28, ease: easeOutExpo }}
                    className={cn(tall && "sm:col-span-2 lg:row-span-2")}
                  >
                    <DestinationCard d={d} tall={tall} bento={bento} active={view === "map" && activeId === d.id} onFocus={() => setActiveId(d.id)} />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      </AnimatePresence>

      {showViewAll && (
        <div className="mt-10 flex justify-center">
          <Link href={href(lang, "/discover")} className="btn btn-outline">
            {dict.discover.viewAll} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
