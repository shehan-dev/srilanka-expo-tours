"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calculator, CalendarDays, ChevronDown, Languages, MapPin, Search, Users, X } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Price } from "@/components/ui/Price";
import { searchPlaces } from "@/lib/data/destinations";
import { href } from "@/lib/i18n/config";
import { estimateTrip } from "@/lib/pricing";
import type { GuideLanguage, RegionId } from "@/lib/types";
import { cn, easeOutExpo } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
  hint: string;
  region: RegionId;
}

/** Accessible destination autocomplete (ARIA 1.2 combobox pattern). */
function DestinationCombobox({ value, onChange }: { value: Option | null; onChange: (o: Option | null) => void }) {
  const { dict } = useI18n();
  const id = useId();
  const [query, setQuery] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const options = useMemo<Option[]>(() => {
    const regions = (Object.keys(dict.regions) as RegionId[]).map((r) => ({
      id: `region-${r}`,
      label: dict.regions[r],
      hint: "",
      region: r,
    }));
    const places = searchPlaces.map((p) => ({ id: p.id, label: p.label, hint: dict.regions[p.region], region: p.region }));
    const all = [...regions, ...places];
    const q = query.trim().toLowerCase();
    return (q ? all.filter((o) => o.label.toLowerCase().includes(q) || o.hint.toLowerCase().includes(q)) : all).slice(0, 8);
  }, [query, dict]);

  const select = (o: Option) => {
    onChange(o);
    setQuery(o.label);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && options[active]) {
      e.preventDefault();
      select(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const listId = `${id}-list`;

  return (
    <div className="relative">
      <label htmlFor={`${id}-input`} className="field-label flex items-center gap-1.5">
        <MapPin className="h-4 w-4 text-accent-700" aria-hidden /> {dict.booking.destination}
      </label>
      <input
        id={`${id}-input`}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && options[active] ? `${id}-${options[active].id}` : undefined}
        autoComplete="off"
        className="input"
        placeholder={dict.booking.destinationPlaceholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
          if (!e.target.value) onChange(null);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
      />
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={dict.booking.destination}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full right-0 left-0 z-40 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-lift ring-1 ring-line"
          >
            {options.length === 0 && <li className="px-3 py-2 text-sm text-muted">{dict.booking.noResults}</li>}
            {options.map((o, i) => (
              <li
                key={o.id}
                id={`${id}-${o.id}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(o)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm",
                  i === active && "bg-sky"
                )}
              >
                <span className="font-medium">{o.label}</span>
                {o.hint && <span className="text-xs text-muted">{o.hint}</span>}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const daysBetween = (a: string, b: string) => {
  if (!a || !b) return 7;
  const d = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000) + 1;
  return d > 0 && d < 60 ? d : 7;
};

/** Quick search / booking bar. Sticks under the header while scrolling the home page. */
export function BookingBar() {
  const { lang, dict } = useI18n();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [destination, setDestination] = useState<Option | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [guideLang, setGuideLang] = useState<GuideLanguage>(lang === "it" ? "it" : "en");
  const [showEstimate, setShowEstimate] = useState(false);
  const [stuck, setStuck] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Once the bar is pinned under the header, hide field labels on desktop to keep it slim.
  useEffect(() => {
    const onScroll = () => {
      const top = barRef.current?.getBoundingClientRect().top ?? 999;
      setStuck(top <= 65);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const days = daysBetween(start, end);
  const estimate = estimateTrip({
    days,
    adults,
    kids,
    guide: guideLang === "it" ? "italian" : "driver",
    meals: "breakfast",
    accommodation: "essential",
  });

  const search = () => {
    const params = new URLSearchParams();
    if (destination) params.set("region", destination.region);
    if (start && end) params.set("days", String(days));
    params.set("language", guideLang);
    router.push(`${href(lang, "/tours")}?${params}`);
  };

  const builderHref = `${href(lang, "/itinerary")}?${new URLSearchParams({
    days: String(days),
    adults: String(adults),
    kids: String(kids),
    guide: guideLang === "it" ? "italian" : "driver",
    ...(start ? { start } : {}),
  })}`;

  return (
    <div id="search" ref={barRef} className="sticky top-16 z-30 -mt-14 scroll-mt-24 md:-mt-16">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: easeOutExpo }}
          className={cn(
            "rounded-3xl bg-white/95 p-3 shadow-lift ring-1 ring-line backdrop-blur-xl transition-[padding] duration-300",
            stuck ? "md:p-2.5" : "md:p-4"
          )}
        >
          <h2 className="sr-only">{dict.booking.title}</h2>

          {/* Mobile: collapsed icon row */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="booking-fields"
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-sky px-4 py-3 text-left md:hidden"
          >
            <span className="flex items-center gap-2 font-semibold">
              <Search className="h-5 w-5 text-primary" aria-hidden />
              {expanded ? dict.booking.collapse : dict.booking.expand}
            </span>
            <span className="flex items-center gap-2 text-muted" aria-hidden>
              <MapPin className="h-4 w-4" />
              <CalendarDays className="h-4 w-4" />
              <Users className="h-4 w-4" />
              <ChevronDown className={cn("h-5 w-5 transition-transform", expanded && "rotate-180")} />
            </span>
          </button>

          <form
            id="booking-fields"
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className={cn(
              "mt-3 gap-3 md:mt-0 md:grid md:grid-cols-6 md:items-end lg:grid-cols-[1.5fr_1fr_1fr_0.6fr_0.6fr_1fr_auto]",
              expanded ? "grid" : "hidden",
              stuck && "md:[&_.field-label]:sr-only"
            )}
          >
            <div className="md:col-span-2 lg:col-span-1">
              <DestinationCombobox value={destination} onChange={setDestination} />
            </div>
            <div>
              <label htmlFor="bb-start" className="field-label flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-accent-700" aria-hidden /> {dict.booking.start}
              </label>
              <input id="bb-start" type="date" min={today} className="input" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <label htmlFor="bb-end" className="field-label">
                {dict.booking.end}
              </label>
              <input id="bb-end" type="date" min={start || today} className="input" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3 md:contents">
              <div>
                <label htmlFor="bb-adults" className="field-label flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-accent-700" aria-hidden /> {dict.booking.adults}
                </label>
                <select id="bb-adults" className="input" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="bb-kids" className="field-label">
                  {dict.booking.kids}
                </label>
                <select id="bb-kids" className="input" value={kids} onChange={(e) => setKids(Number(e.target.value))}>
                  {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <label htmlFor="bb-lang" className="field-label flex items-center gap-1.5">
                <Languages className="h-4 w-4 text-accent-700" aria-hidden /> {dict.booking.language}
              </label>
              <select id="bb-lang" className="input" value={guideLang} onChange={(e) => setGuideLang(e.target.value as GuideLanguage)}>
                {(Object.keys(dict.languages) as GuideLanguage[]).map((code) => (
                  <option key={code} value={code}>
                    {code === "it" ? "🇮🇹 " : ""}
                    {dict.languages[code]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 md:col-span-4 lg:col-span-1">
              <button
                type="button"
                onClick={() => setShowEstimate((v) => !v)}
                aria-expanded={showEstimate}
                aria-controls="bb-estimate"
                className="btn btn-outline flex-1 px-4 lg:flex-none"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                <span className="lg:sr-only xl:not-sr-only">{dict.booking.estimate}</span>
              </button>
              <button type="submit" className="btn btn-primary flex-1 px-5 lg:flex-none">
                <Search className="h-4 w-4" aria-hidden /> {dict.booking.search}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {showEstimate && (
              <motion.div
                id="bb-estimate"
                role="region"
                aria-live="polite"
                aria-label={dict.booking.estimateTitle}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: easeOutExpo }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-sky p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-accent-700">
                      {dict.booking.estimateTitle} · {days} {dict.booking.days} · {destination?.label ?? dict.booking.anyDestination}
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                      <Price usd={estimate.perPerson} className="font-heading text-3xl font-bold" />
                      <span className="text-sm text-muted">{dict.booking.perPerson}</span>
                      <span className="text-sm text-muted">
                        (<Price usd={estimate.total} /> {dict.booking.total})
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">{dict.booking.estimateNote}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={builderHref} className="btn btn-accent btn-sm">
                      {dict.booking.buildIt}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowEstimate(false)}
                      className="grid h-9 w-9 place-items-center rounded-full hover:bg-white"
                      aria-label={dict.tour.close}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
