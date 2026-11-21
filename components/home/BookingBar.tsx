"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calculator, CalendarDays, Car, Languages, MapPin, Minus, Plus, Route, Search, ShieldCheck, Users, X } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Price } from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
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
                  i === active && "bg-ivory"
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

/** Guest counter with − / + buttons (44px targets). The value fades when it changes. */
function GuestStepper({
  id,
  label,
  icon,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  icon?: boolean;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const { dict } = useI18n();
  return (
    <div role="group" aria-labelledby={id}>
      <span id={id} className="field-label flex items-center gap-1.5">
        {icon && <Users className="h-4 w-4 text-accent-700" aria-hidden />} {label}
      </span>
      <div className="flex h-11 items-center justify-between rounded-control border border-line bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`${dict.booking.decrease}: ${label}`}
          className="grid h-11 w-11 place-items-center rounded-control text-primary transition-colors hover:bg-primary-50 disabled:opacity-35"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <output key={value} aria-live="polite" className="fade-in min-w-6 text-center text-[15px] font-semibold tabular-nums">
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`${dict.booking.increase}: ${label}`}
          className="grid h-11 w-11 place-items-center rounded-control text-primary transition-colors hover:bg-primary-50 disabled:opacity-35"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Quick search / booking card. Overlaps the bottom edge of the hero; a slim trust strip sits beneath it. */
export function BookingBar() {
  const { lang, dict } = useI18n();
  const router = useRouter();
  const [destination, setDestination] = useState<Option | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [guideLang, setGuideLang] = useState<GuideLanguage>(lang === "it" ? "it" : "en");
  const [showEstimate, setShowEstimate] = useState(false);

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
    router.push(`${href(lang, "/tours")}?${params}`);
  };

  // Until the itinerary builder launches, the estimate leads to a custom quote request.
  const quoteHref = `${href(lang, "/contact")}?${new URLSearchParams({
    message: `${days} ${dict.booking.days} · ${adults} ${dict.booking.adults}${kids ? `, ${kids} ${dict.booking.kids}` : ""}${
      destination ? ` · ${destination.label}` : ""
    }${start ? ` · ${start}` : ""} · ${dict.booking.language}: ${dict.languages[guideLang]}`,
  })}`;

  const trust = [
    { Icon: Languages, label: dict.hero.badge },
    { Icon: Car, label: dict.features.items[1].title },
    { Icon: Route, label: dict.features.items[2].title },
    { Icon: ShieldCheck, label: dict.features.items[3].title },
  ];

  return (
    <section id="search" aria-labelledby="search-title" className="relative z-10 -mt-20 md:-mt-24">
      <div className="container-site">
        <Reveal delay={0.6} className="rounded-panel bg-white p-4 shadow-lift ring-1 ring-line/60 md:p-6">
          <h2 id="search-title" className="sr-only">
            {dict.booking.title}
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="grid grid-cols-2 items-end gap-3 md:grid-cols-4 xl:grid-cols-[1.4fr_1fr_1fr_0.85fr_0.85fr_1.25fr_auto]"
          >
            <div className="col-span-2 xl:col-span-1">
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
            <GuestStepper id="bb-adults" label={dict.booking.adults} icon value={adults} min={1} max={20} onChange={setAdults} />
            <GuestStepper id="bb-kids" label={dict.booking.kids} value={kids} min={0} max={10} onChange={setKids} />
            <div className="col-span-2 xl:col-span-1">
              <label htmlFor="bb-lang" className="field-label flex items-center gap-1.5 whitespace-nowrap">
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
            <div className="col-span-2 flex gap-2 md:col-span-4 xl:col-span-1">
              <button
                type="button"
                onClick={() => setShowEstimate((v) => !v)}
                aria-expanded={showEstimate}
                aria-controls="bb-estimate"
                aria-label={dict.booking.estimate}
                title={dict.booking.estimate}
                className="btn btn-outline flex-1 px-4 xl:flex-none"
              >
                <Calculator className="h-4 w-4" aria-hidden />
                <span className="xl:hidden">{dict.booking.estimate}</span>
              </button>
              <button type="submit" className="btn btn-primary flex-1 px-5 xl:flex-none">
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
                transition={{ duration: 0.28, ease: easeOutExpo }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-col gap-3 rounded-card bg-ivory p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-accent-700">
                      {dict.booking.estimateTitle} · {days} {dict.booking.days} · {destination?.label ?? dict.booking.anyDestination}
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                      <Price usd={estimate.perPerson} className="font-heading text-3xl font-semibold text-primary" />
                      <span className="text-sm text-muted">{dict.booking.perPerson}</span>
                      <span className="text-sm text-muted">
                        (<Price usd={estimate.total} /> {dict.booking.total})
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">{dict.booking.estimateNote}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={quoteHref} className="btn btn-primary btn-sm">
                      {dict.booking.buildIt}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowEstimate(false)}
                      className="grid h-11 w-11 place-items-center rounded-full hover:bg-white"
                      aria-label={dict.tour.close}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

        {/* Trust strip */}
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-ink">
          {trust.map(({ Icon, label }, i) => (
            <Reveal as="li" key={label} delay={0.1 + i * 0.07} className="inline-flex items-center gap-2">
              <Icon className="h-[18px] w-[18px] text-accent-700" strokeWidth={1.75} aria-hidden />
              {label}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
