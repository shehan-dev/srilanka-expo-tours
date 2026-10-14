"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Info, LayoutGrid, List,Map as MapIcon, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { MapView } from "@/components/map/MapView";
import { Price } from "@/components/ui/Price";
import { lengthOf, maxTourPrice, tours, type LengthId } from "@/lib/data/tours";
import { href, l } from "@/lib/i18n/config";
import type { RegionId, ThemeId, Tour } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TourCard } from "./TourCard";
import { TourPreviewModal } from "./TourPreviewModal";

export type { LengthId };

export interface CatalogFilters {
  theme: ThemeId | "all";
  regions: RegionId[];
  lengths: LengthId[];
  maxPrice: number;
  sort: "popular" | "price-asc" | "price-desc" | "duration";
}

const themes: (ThemeId | "all")[] = ["all", "culture", "nature", "wildlife", "beach", "adventure", "family", "food"];
const regionIds: RegionId[] = ["cultural-triangle", "hill-country", "south-coast", "east-coast", "national-parks", "city"];
const lengthIds: LengthId[] = ["short", "medium", "long"];
const PAGE_SIZE = 9;


/** Filter + sort. Runs during SSR with the URL's filters, so filtered views are pre-rendered for SEO. */
export function filterTours(f: CatalogFilters): Tour[] {
  const list = tours.filter(
    (t) =>
      (f.theme === "all" || t.themes.includes(f.theme)) &&
      (!f.regions.length || t.regions.some((r) => f.regions.includes(r))) &&
      (!f.lengths.length || f.lengths.includes(lengthOf(t.durationDays))) &&
      t.prices.standard <= f.maxPrice
  );
  const sorters: Record<CatalogFilters["sort"], (a: Tour, b: Tour) => number> = {
    popular: (a, b) => Number(!!b.popular) - Number(!!a.popular) || a.durationDays - b.durationDays,
    "price-asc": (a, b) => a.prices.standard - b.prices.standard,
    "price-desc": (a, b) => b.prices.standard - a.prices.standard,
    duration: (a, b) => a.durationDays - b.durationDays,
  };
  return list.sort(sorters[f.sort]);
}

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  render,
}: {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (v: T) => void;
  render: (v: T) => string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={selected.includes(o)} onClick={() => onToggle(o)}>
            {render(o)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ToursCatalog({ initial }: { initial: CatalogFilters }) {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const [filters, setFilters] = useState<CatalogFilters>(initial);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [preview, setPreview] = useState<Tour | null>(null);
  const [activeId, setActiveId] = useState<string>();

  const results = useMemo(() => filterTours(filters), [filters]);
  const set = (patch: Partial<CatalogFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE_SIZE);
  };

  // Keep the URL in sync so filtered views are shareable (no server round-trip needed).
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.theme !== "all") p.set("theme", filters.theme);
    if (filters.regions.length) p.set("region", filters.regions.join(","));
    if (filters.lengths.length) p.set("length", filters.lengths.join(","));
    if (filters.maxPrice < maxTourPrice) p.set("max", String(filters.maxPrice));
    if (filters.sort !== "popular") p.set("sort", filters.sort);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }, [filters, pathname]);

  const activeCount =
    filters.regions.length + filters.lengths.length + (filters.maxPrice < maxTourPrice ? 1 : 0);

  const reset = () =>
    set({ theme: "all", regions: [], lengths: [], maxPrice: maxTourPrice });

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <ChipGroup label={dict.catalog.region} options={regionIds} selected={filters.regions} onToggle={(r) => set({ regions: toggle(filters.regions, r) })} render={(r) => dict.regions[r]} />
      <ChipGroup label={dict.catalog.length} options={lengthIds} selected={filters.lengths} onToggle={(x) => set({ lengths: toggle(filters.lengths, x) })} render={(x) => dict.catalog.lengths[x]} />
      <div>
        <label htmlFor="max-price" className="mb-2 flex items-center justify-between text-sm font-semibold">
          {dict.catalog.price}
          <Price usd={filters.maxPrice} className="font-bold text-primary-600" />
        </label>
        <input
          id="max-price"
          type="range"
          min={500}
          max={maxTourPrice}
          step={20}
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="w-full accent-primary"
        />
      </div>
      <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary-600 hover:underline">
        <RotateCcw className="h-4 w-4" aria-hidden /> {dict.catalog.reset}
      </button>
    </div>
  );

  const shown = results.slice(0, visible);

  return (
    <div>
      {/* Category tabs */}
      <div role="tablist" aria-label={dict.catalog.filters} className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {themes.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={filters.theme === t} onClick={() => set({ theme: t })} className="chip shrink-0">
            {t === "all" ? dict.catalog.all : dict.themes[t]}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls="filters-mobile"
          className="btn btn-outline btn-sm lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden /> {dict.catalog.filters}
          {activeCount > 0 && <span className="rounded-full bg-primary px-2 text-xs text-white">{activeCount}</span>}
        </button>
        <p className="text-sm text-muted" aria-live="polite">
          <strong className="text-ink">{results.length}</strong> {dict.catalog.results}
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">{dict.catalog.sort}</span>
            <select
              className="input w-auto py-1.5 text-sm"
              value={filters.sort}
              onChange={(e) => set({ sort: e.target.value as CatalogFilters["sort"] })}
            >
              <option value="popular">{dict.catalog.sortPopular}</option>
              <option value="price-asc">{dict.catalog.sortPriceAsc}</option>
              <option value="price-desc">{dict.catalog.sortPriceDesc}</option>
              <option value="duration">{dict.catalog.sortDuration}</option>
            </select>
          </label>
          <div className="flex rounded-full bg-sky p-1">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                aria-label={v === "grid" ? dict.catalog.grid : dict.catalog.list}
                onClick={() => setView(v)}
                className={cn("grid h-8 w-8 place-items-center rounded-full transition", view === v && "bg-white text-primary-600 shadow-sm")}
              >
                {v === "grid" ? <LayoutGrid className="h-4 w-4" aria-hidden /> : <List className="h-4 w-4" aria-hidden />}
              </button>
            ))}
          </div>
          <button type="button" aria-pressed={showMap} onClick={() => setShowMap((v) => !v)} className="btn btn-outline btn-sm">
            <MapIcon className="h-4 w-4" aria-hidden /> {showMap ? dict.catalog.hideMap : dict.catalog.showMap}
          </button>
        </div>
      </div>

      <p className="mb-6 flex items-start gap-2 rounded-2xl bg-sky px-4 py-3 text-sm text-ink/80">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" aria-hidden />
        <span>
          {dict.tour.standard} = {dict.tour.standardHotels} · {dict.tour.premium} = {dict.tour.premiumHotels}. {dict.tour.priceDisclaimer}{" "}
          {dict.tour.anyGuide}
        </span>
      </p>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            id="filters-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden lg:hidden"
          >
            <div className="card p-5">{filterPanel}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside aria-label={dict.catalog.filters} className="hidden lg:block">
          <div className="card sticky top-24 p-5">{filterPanel}</div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          {showMap && (
            <MapView
              className="h-[380px]"
              points={results.map((t) => ({
                id: t.id,
                coords: t.coords,
                title: l(t.title, lang),
                subtitle: `${t.durationDays} ${dict.tour.days}`,
                href: href(lang, `/tours/${t.slug}`),
              }))}
              activeId={activeId}
              onSelect={setActiveId}
              linkLabel={dict.tour.details}
            />
          )}

          {results.length === 0 ? (
            <div className="card flex flex-col items-center gap-4 p-10 text-center">
              <p className="text-muted">{dict.catalog.noResults}</p>
              <div className="flex gap-2">
                <button type="button" onClick={reset} className="btn btn-outline btn-sm">
                  {dict.catalog.reset}
                </button>
                <Link href={href(lang, "/itinerary")} className="btn btn-primary btn-sm">
                  {dict.hero.ctaSecondary}
                </Link>
              </div>
            </div>
          ) : (
            <motion.ul layout className={cn("grid gap-6", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              <AnimatePresence mode="popLayout">
                {shown.map((tour, i) => (
                  <motion.li
                    key={tour.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
                    onMouseEnter={() => setActiveId(tour.id)}
                  >
                    <TourCard tour={tour} onPreview={setPreview} variant={view} priority={i < 3} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}

          {visible < results.length && (
            <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn btn-outline self-center">
              {dict.catalog.loadMore}
            </button>
          )}
        </div>
      </div>

      <TourPreviewModal tour={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
