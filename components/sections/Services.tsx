import Image from "next/image";
import Link from "next/link";
import { Briefcase, Bus, Car, CarFront, CheckCircle2, Languages, Luggage, PlaneLanding, ShieldCheck, Users } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, l, type Locale } from "@/lib/i18n/config";
import { vehicles } from "@/lib/data/vehicles";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const serviceIcons = [Languages, CarFront, PlaneLanding, Briefcase];
const vehicleIcons = { car: Car, van: CarFront, bus: Bus };

export function ServicesGrid({ dict, lang, showLink }: { dict: Dictionary; lang: Locale; showLink?: boolean }) {
  return (
    <div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dict.services.items.map((s, i) => {
          const Icon = serviceIcons[i];
          return (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="card flex h-full flex-col gap-3 p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-50 text-accent-700">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted">{s.text}</p>
              {i === 0 && (
                <p className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-sky px-3 py-1 text-xs font-semibold text-primary-600">
                  <span aria-hidden>🇮🇹</span> Italiano
                </p>
              )}
            </Reveal>
          );
        })}
      </ul>
      {showLink && (
        <div className="mt-8 flex justify-center">
          <Link href={href(lang, "/services")} className="btn btn-outline">
            {dict.services.learnMore} →
          </Link>
        </div>
      )}
    </div>
  );
}

export function Fleet({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  return (
    <div>
      <SectionHeading title={dict.services.fleetTitle} subtitle={dict.services.fleetSubtitle} />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((v, i) => {
          const Icon = vehicleIcons[v.icon];
          return (
            <Reveal as="li" key={v.id} delay={i * 0.08} className="card group flex h-full flex-col overflow-hidden">
                <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-linear-to-br from-sky to-sky-200">
                  {v.image ? (
                    <Image
                      src={v.image}
                      alt={`${l(v.name, lang)} — ${v.model}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <Icon className="h-20 w-20 text-primary" strokeWidth={1.4} aria-hidden />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h3 className="text-lg font-semibold">{l(v.name, lang)}</h3>
                    <p className="text-sm text-muted">{v.model}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-accent-700" aria-hidden />
                      <dt className="sr-only">{dict.services.capacity}</dt>
                      <dd>
                        {v.capacity} {dict.services.capacity.toLowerCase()}
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Luggage className="h-4 w-4 text-accent-700" aria-hidden />
                      <dt className="sr-only">{dict.services.luggage}</dt>
                      <dd>
                        {v.luggage} {dict.services.luggage.toLowerCase()}
                      </dd>
                    </div>
                  </dl>
                  <ul className="flex flex-wrap gap-1.5">
                    {v.features.map((f) => (
                      <li key={f} className="tag">
                        {dict.services.features[f]}
                      </li>
                    ))}
                  </ul>
                </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

export function SafetyNotes({ dict }: { dict: Dictionary }) {
  return (
    <Reveal className="card grid gap-6 p-8 md:grid-cols-[auto_1fr] md:p-10">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-white">
        <ShieldCheck className="h-8 w-8" aria-hidden />
      </span>
      <div>
        <h2 className="text-2xl font-semibold">{dict.services.safetyTitle}</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {dict.services.safety.map((s) => (
            <li key={s} className="flex gap-2 text-[15px]">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden /> {s}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
