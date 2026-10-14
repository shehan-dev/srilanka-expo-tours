import Link from "next/link";
import { ArrowRight, CalendarRange, Car, ListChecks, MapPinned, Send } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/i18n/config";
import { Reveal } from "@/components/ui/Reveal";

const stepIcons = [CalendarRange, MapPinned, Car, ListChecks, Send];

export function ItineraryTeaser({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="builder-title" className="section">
      <div className="container-site">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary to-accent p-8 text-white shadow-lift md:p-14">
          <div aria-hidden className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="flex flex-wrap items-center gap-3 text-sm font-semibold tracking-wider text-white/85 uppercase">
                {dict.itinerary.eyebrow}
                <span className="rounded-full bg-white px-3 py-1 text-xs tracking-wide text-primary-600">{dict.itinerary.comingSoon}</span>
              </p>
              <h2 id="builder-title" className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                {dict.itinerary.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg text-white/90">{dict.itinerary.comingSoonText}</p>
              <Link href={href(lang, "/contact")} className="btn mt-8 bg-white text-primary-600 shadow-lg hover:bg-sky">
                {dict.itinerary.comingSoonCta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <ol className="grid gap-3">
              {dict.itinerary.steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <li key={step} className="flex items-center gap-4 rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary-600">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-sm text-white/80">
                      {dict.itinerary.step} {i + 1}
                    </span>
                    <span className="font-semibold">{step}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
