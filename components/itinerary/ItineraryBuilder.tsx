"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bus,
  Car,
  CarFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Loader2,
  Minus,
  Plus,
  Send,
} from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Price } from "@/components/ui/Price";
import { attractions } from "@/lib/data/attractions";
import { recommendedVehicle, vehicles } from "@/lib/data/vehicles";
import { l } from "@/lib/i18n/config";
import {
  estimateTrip,
  type AccommodationOption,
  type GuideOption,
  type MealOption,
} from "@/lib/pricing";
import type { RegionId } from "@/lib/types";
import { cn, easeOutExpo } from "@/lib/utils";

interface DayPlan {
  id: string;
  items: string[];
}

export interface BuilderInitial {
  days?: number;
  adults?: number;
  kids?: number;
  guide?: GuideOption;
  start?: string;
}

const MIN_DAYS = 2;
const MAX_DAYS = 21;
const regionOrder: RegionId[] = ["cultural-triangle", "hill-country", "national-parks", "south-coast", "east-coast", "city"];
const vehicleIcons = { car: Car, van: CarFront, bus: Bus };
const attractionName = (id: string) => attractions.find((a) => a.id === id)?.name ?? id;

/** Spread selected attractions (kept in island-loop order) evenly across the trip. */
function distribute(selected: string[], days: number): DayPlan[] {
  const plan: DayPlan[] = Array.from({ length: days }, (_, i) => ({ id: `day-${i}-${Date.now()}`, items: [] }));
  const ordered = attractions.filter((a) => selected.includes(a.id)).map((a) => a.id);
  ordered.forEach((id, i) => {
    const day = Math.min(days - 1, Math.floor((i * days) / Math.max(ordered.length, 1)));
    plan[day].items.push(id);
  });
  return plan;
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-sky px-4 py-3">
      <span className="font-medium" id={`stepper-${label}`}>
        {label}
      </span>
      <div className="flex items-center gap-3" role="group" aria-labelledby={`stepper-${label}`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`${label} −1`}
          className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-line disabled:opacity-40"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <output className="w-6 text-center text-lg font-semibold" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`${label} +1`}
          className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-line disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Accessible radio rendered as a selectable card. */
function RadioCard({
  name,
  value,
  checked,
  onChange,
  disabled,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer gap-3 rounded-2xl border-2 bg-white p-4 transition-all",
        checked ? "border-primary shadow-card" : "border-line hover:border-primary/40",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-primary/30",
          checked ? "border-primary bg-primary text-white" : "border-line"
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      <span className="flex-1">{children}</span>
    </label>
  );
}

function DayRow({
  day,
  index,
  total,
  onMove,
  onMoveItem,
}: {
  day: DayPlan;
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onMoveItem: (dayIndex: number, itemId: string, dir: -1 | 1) => void;
}) {
  const { dict } = useI18n();
  const t = dict.itinerary;
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={day}
      dragListener={false}
      dragControls={controls}
      layout="position"
      whileDrag={{ scale: 1.02, boxShadow: "0 22px 44px -12px rgb(10 110 255 / 0.35)", zIndex: 10 }}
      transition={{ duration: 0.35, ease: easeOutExpo }}
      className="relative flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-line"
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        aria-label={`${t.dragHandle} ${index + 1}`}
        className="grid w-8 shrink-0 cursor-grab touch-none place-items-center rounded-xl text-muted hover:bg-sky active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" aria-hidden />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-wide text-primary-600 uppercase">
          {dict.tour.day} {index + 1}
        </p>
        {day.items.length === 0 ? (
          <p className="mt-1 text-sm text-muted italic">{t.freeDay}</p>
        ) : (
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            <AnimatePresence initial={false}>
              {day.items.map((id) => (
                <motion.li
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1 rounded-full bg-sky py-1 pr-1 pl-3 text-sm"
                >
                  {attractionName(id)}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveItem(index, id, -1)}
                    aria-label={`${t.moveToPrev}: ${attractionName(id)}`}
                    className="grid h-6 w-6 place-items-center rounded-full hover:bg-white disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={index === total - 1}
                    onClick={() => onMoveItem(index, id, 1)}
                    aria-label={`${t.moveToNext}: ${attractionName(id)}`}
                    className="grid h-6 w-6 place-items-center rounded-full hover:bg-white disabled:opacity-30"
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          aria-label={`${t.moveUp} ${index + 1}`}
          className="grid h-7 w-7 place-items-center rounded-full hover:bg-sky disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          aria-label={`${t.moveDown} ${index + 1}`}
          className="grid h-7 w-7 place-items-center rounded-full hover:bg-sky disabled:opacity-30"
        >
          <ArrowDown className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </Reorder.Item>
  );
}

export function ItineraryBuilder({ initial }: { initial: BuilderInitial }) {
  const { lang, dict } = useI18n();
  const t = dict.itinerary;

  const [step, setStep] = useState(0);
  const [days, setDays] = useState(Math.min(MAX_DAYS, Math.max(MIN_DAYS, initial.days ?? 7)));
  const [start, setStart] = useState(initial.start ?? "");
  const [adults, setAdults] = useState(initial.adults ?? 2);
  const [kids, setKids] = useState(initial.kids ?? 0);
  const [selected, setSelected] = useState<string[]>(["sigiriya", "kandy-temple", "ella-train", "yala", "galle"]);
  const [plan, setPlan] = useState<DayPlan[]>(() => distribute(["sigiriya", "kandy-temple", "ella-train", "yala", "galle"], initial.days ?? 7));
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [guide, setGuide] = useState<GuideOption>(initial.guide ?? (lang === "it" ? "italian" : "driver"));
  const [meals, setMeals] = useState<MealOption>("half");
  const [accommodation, setAccommodation] = useState<AccommodationOption>("comfort");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);

  const pax = adults + kids;
  const suggested = recommendedVehicle(pax);
  const vehicle = vehicles.find((v) => v.id === vehicleId && v.capacity >= pax) ?? suggested;
  const today = new Date().toISOString().slice(0, 10);

  const estimate = useMemo(
    () => estimateTrip({ days, adults, kids, vehicleId: vehicle.id, guide, meals, accommodation, attractionIds: selected }),
    [days, adults, kids, vehicle.id, guide, meals, accommodation, selected]
  );

  const changeDays = (n: number) => {
    setDays(n);
    setPlan(distribute(selected, n));
  };
  const toggleAttraction = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setSelected(next);
    setPlan(distribute(next, days));
  };
  const moveDay = (from: number, to: number) =>
    setPlan((p) => {
      const next = [...p];
      const [d] = next.splice(from, 1);
      next.splice(to, 0, d);
      return next;
    });
  const moveItem = (dayIndex: number, itemId: string, dir: -1 | 1) =>
    setPlan((p) =>
      p.map((d, i) => {
        if (i === dayIndex) return { ...d, items: d.items.filter((x) => x !== itemId) };
        if (i === dayIndex + dir) return { ...d, items: [...d.items, itemId] };
        return d;
      })
    );

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "itinerary",
          language: lang,
          adults,
          kids,
          startDate: start,
          itinerary: {
            days,
            vehicle: vehicle.model,
            guide,
            meals,
            accommodation,
            plan: plan.map((d, i) => ({ day: i + 1, places: d.items.map(attractionName) })),
            estimateUSD: estimate,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error();
      setReference(json.reference);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const steps = t.steps;
  const canNext = step !== 1 || selected.length > 0;

  if (reference) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center"
        role="status"
      >
        <CheckCircle2 className="h-16 w-16 text-accent" aria-hidden />
        <h2 className="text-2xl font-semibold">{t.successTitle}</h2>
        <p className="text-ink/85">{t.successText}</p>
        <p className="rounded-xl bg-sky px-5 py-3 font-mono text-xl font-bold tracking-wider text-primary-600">{reference}</p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setReference(null);
            setStep(0);
          }}
        >
          {t.startOver}
        </button>
      </motion.div>
    );
  }

  const breakdown: { label: string; value: number }[] = [
    { label: t.breakdown.vehicle, value: estimate.vehicle },
    { label: t.breakdown.guide, value: estimate.guide },
    { label: t.breakdown.accommodation, value: estimate.accommodation },
    { label: t.breakdown.meals, value: estimate.meals },
    { label: t.breakdown.fees, value: estimate.fees },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        {/* Progress */}
        <nav aria-label={`${t.step} ${step + 1} ${t.of} ${steps.length}`} className="mb-8">
          <ol className="flex items-center gap-2">
            {steps.map((s, i) => (
              <li key={s} className="flex flex-1 flex-col gap-2">
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => setStep(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="group flex flex-col gap-2 text-left disabled:cursor-default"
                >
                  <span className="h-1.5 overflow-hidden rounded-full bg-line">
                    <motion.span
                      className="block h-full rounded-full bg-linear-to-r from-primary to-accent"
                      initial={false}
                      animate={{ width: i <= step ? "100%" : "0%" }}
                      transition={{ duration: 0.35, ease: easeOutExpo }}
                    />
                  </span>
                  <span className={cn("hidden text-xs font-semibold sm:block", i === step ? "text-primary-600" : "text-muted")}>
                    {i + 1}. {s}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm font-semibold sm:hidden">
            {t.step} {step + 1} {t.of} {steps.length}: {steps[step]}
          </p>
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            {step === 0 && (
              <section aria-labelledby="step-duration" className="flex flex-col gap-6">
                <h2 id="step-duration" className="text-2xl font-semibold">
                  {t.durationTitle}
                </h2>
                <div className="card p-6">
                  <label htmlFor="days" className="flex items-baseline justify-between">
                    <span className="font-heading text-5xl font-bold text-primary-600">
                      {days} <span className="text-xl font-semibold text-ink">{t.days}</span>
                    </span>
                    <span className="text-sm text-muted">
                      {days - 1} {t.nights}
                    </span>
                  </label>
                  <input
                    id="days"
                    type="range"
                    min={MIN_DAYS}
                    max={MAX_DAYS}
                    value={days}
                    onChange={(e) => changeDays(Number(e.target.value))}
                    className="mt-4 w-full accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted">
                    <span>{MIN_DAYS}</span>
                    <span>{MAX_DAYS}</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="start" className="field-label">
                      {t.startDate}
                    </label>
                    <input id="start" type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} className="input" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="field-label">{t.travellers}</span>
                    <Stepper label={dict.booking.adults} value={adults} min={1} max={30} onChange={setAdults} />
                    <Stepper label={dict.booking.kids} value={kids} min={0} max={15} onChange={setKids} />
                  </div>
                </div>
              </section>
            )}

            {step === 1 && (
              <section aria-labelledby="step-attractions" className="flex flex-col gap-6">
                <div>
                  <h2 id="step-attractions" className="text-2xl font-semibold">
                    {t.attractionsTitle}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{t.attractionsHint}</p>
                </div>
                <div className="flex flex-col gap-4">
                  {regionOrder.map((r) => {
                    const list = attractions.filter((a) => a.region === r);
                    if (!list.length) return null;
                    return (
                      <fieldset key={r}>
                        <legend className="mb-2 text-sm font-semibold">{dict.regions[r]}</legend>
                        <div className="flex flex-wrap gap-2">
                          {list.map((a) => (
                            <button
                              key={a.id}
                              type="button"
                              className="chip"
                              aria-pressed={selected.includes(a.id)}
                              onClick={() => toggleAttraction(a.id)}
                            >
                              {selected.includes(a.id) ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Plus className="h-3.5 w-3.5" aria-hidden />}
                              {a.name}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    );
                  })}
                </div>

                <div>
                  <h3 className="mb-3 flex items-center justify-between text-lg font-semibold">
                    {t.dayPlan}
                    <span className="text-sm font-normal text-muted">
                      {selected.length} {t.selected}
                    </span>
                  </h3>
                  <Reorder.Group axis="y" values={plan} onReorder={setPlan} className="flex flex-col gap-2.5">
                    {plan.map((d, i) => (
                      <DayRow key={d.id} day={d} index={i} total={plan.length} onMove={moveDay} onMoveItem={moveItem} />
                    ))}
                  </Reorder.Group>
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="step-options" className="flex flex-col gap-8">
                <h2 id="step-options" className="text-2xl font-semibold">
                  {t.optionsTitle}
                </h2>

                <fieldset>
                  <legend className="mb-3 font-semibold">{t.vehicle}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {vehicles.map((v) => {
                      const Icon = vehicleIcons[v.icon];
                      return (
                        <RadioCard
                          key={v.id}
                          name="vehicle"
                          value={v.id}
                          checked={vehicle.id === v.id}
                          onChange={() => setVehicleId(v.id)}
                          disabled={v.capacity < pax}
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span>
                              <span className="block font-semibold">{l(v.name, lang)}</span>
                              <span className="block text-sm text-muted">
                                {v.capacity} {t.seats} · <Price usd={v.pricePerDay} />/{dict.services.perDay}
                              </span>
                            </span>
                            <Icon className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                          </span>
                          {v.id === suggested.id && (
                            <span className="mt-2 inline-block rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
                              {t.recommended}
                            </span>
                          )}
                        </RadioCard>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-3 font-semibold">{t.guide}</legend>
                  <div className="grid gap-3">
                    {(Object.keys(t.guideOptions) as GuideOption[]).map((g) => (
                      <RadioCard key={g} name="guide" value={g} checked={guide === g} onChange={() => setGuide(g)}>
                        <span className="font-medium">
                          {g === "italian" && <span aria-hidden>🇮🇹 </span>}
                          {t.guideOptions[g]}
                        </span>
                      </RadioCard>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-8 md:grid-cols-2">
                  <fieldset>
                    <legend className="mb-3 font-semibold">{t.accommodation}</legend>
                    <div className="grid gap-3">
                      {(Object.keys(t.accommodationOptions) as AccommodationOption[]).map((a) => (
                        <RadioCard key={a} name="accommodation" value={a} checked={accommodation === a} onChange={() => setAccommodation(a)}>
                          {t.accommodationOptions[a]}
                        </RadioCard>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="mb-3 font-semibold">{t.meals}</legend>
                    <div className="grid gap-3">
                      {(Object.keys(t.mealOptions) as MealOption[]).map((m) => (
                        <RadioCard key={m} name="meals" value={m} checked={meals === m} onChange={() => setMeals(m)}>
                          {t.mealOptions[m]}
                        </RadioCard>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="step-summary" className="flex flex-col gap-6">
                <h2 id="step-summary" className="text-2xl font-semibold">
                  {t.summaryTitle}
                </h2>
                <dl className="card grid gap-4 p-6 sm:grid-cols-2">
                  {[
                    [t.steps[0], `${days} ${t.days} · ${adults} ${dict.booking.adults.toLowerCase()}${kids ? `, ${kids} ${dict.booking.kids.toLowerCase()}` : ""}`],
                    [t.startDate, start || "—"],
                    [t.vehicle, `${l(vehicle.name, lang)} (${vehicle.model})`],
                    [t.guide, t.guideOptions[guide]],
                    [t.accommodation, t.accommodationOptions[accommodation]],
                    [t.meals, t.mealOptions[meals]],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{k}</dt>
                      <dd className="mt-0.5 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <ol className="flex flex-col gap-2">
                  {plan.map((d, i) => (
                    <li key={d.id} className="flex gap-4 rounded-2xl bg-sky/70 px-4 py-3">
                      <span className="w-14 shrink-0 text-sm font-bold text-primary-600">
                        {dict.tour.day} {i + 1}
                      </span>
                      <span className="text-sm">{d.items.length ? d.items.map(attractionName).join(" · ") : t.freeDay}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {step === 4 && (
              <section aria-labelledby="step-request">
                <h2 id="step-request" className="mb-6 text-2xl font-semibold">
                  {t.requestTitle}
                </h2>
                <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2">
                  <div aria-hidden className="absolute -left-[9999px]">
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ib-name" className="field-label">
                      {dict.contact.name} *
                    </label>
                    <input id="ib-name" name="name" required autoComplete="name" className="input" />
                  </div>
                  <div>
                    <label htmlFor="ib-email" className="field-label">
                      {dict.contact.email} *
                    </label>
                    <input id="ib-email" name="email" type="email" required autoComplete="email" className="input" />
                  </div>
                  <div>
                    <label htmlFor="ib-phone" className="field-label">
                      {dict.contact.phone}
                    </label>
                    <input id="ib-phone" name="phone" type="tel" autoComplete="tel" className="input" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ib-message" className="field-label">
                      {dict.contact.message}
                    </label>
                    <textarea id="ib-message" name="message" rows={4} className="input" placeholder={dict.contact.messagePlaceholder} />
                  </div>
                  {status === "error" && (
                    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                      {dict.contact.error}
                    </p>
                  )}
                  <button type="submit" disabled={status === "sending"} className="btn btn-primary sm:col-span-2 sm:justify-self-start">
                    {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                    {status === "sending" ? t.sending : t.send}
                  </button>
                </form>
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard navigation */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn btn-outline">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {t.back}
          </button>
          {step < steps.length - 1 && (
            <button type="button" onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext} className="btn btn-primary">
              {t.next} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Live estimate panel */}
      <aside aria-label={t.estimate} className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-3xl bg-ink text-white shadow-lift">
          <div className="bg-linear-to-br from-primary to-accent p-6">
            <p className="text-sm font-semibold tracking-wide text-white/85 uppercase">{t.estimate}</p>
            <p className="mt-2" aria-live="polite">
              <motion.span key={estimate.total} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                <Price usd={estimate.total} className="font-heading text-4xl font-bold" />
              </motion.span>
            </p>
            <p className="mt-1 text-sm text-white/90">
              {t.perPerson}: <Price usd={estimate.perPerson} className="font-semibold" />
            </p>
          </div>
          <dl className="flex flex-col gap-2.5 p-6 text-sm">
            {breakdown.map((b) => (
              <div key={b.label} className="flex justify-between gap-3">
                <dt className="text-white/70">{b.label}</dt>
                <dd className="font-medium">
                  <Price usd={b.value} />
                </dd>
              </div>
            ))}
            <div className="mt-2 flex justify-between gap-3 border-t border-white/15 pt-3">
              <dt>{t.total}</dt>
              <dd className="font-bold">
                <Price usd={estimate.total} />
              </dd>
            </div>
          </dl>
          <div className="border-t border-white/10 px-6 py-4 text-xs text-white/60">
            <p>
              {days} {t.days} · {pax} {t.travellers.toLowerCase()} · {selected.length || t.noAttractions} {selected.length ? t.selected : ""}
            </p>
            <p className="mt-2">{t.estimateNote}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
