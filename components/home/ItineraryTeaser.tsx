import Link from "next/link";
import { ArrowRight, CalendarRange, Car, ListChecks, MapPinned, Send } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/i18n/config";
import { Reveal } from "@/components/ui/Reveal";

const stepIcons = [CalendarRange, MapPinned, Car, ListChecks, Send];

/** Custom-itinerary teaser: ivory-deep panel, 5-step preview as a timeline whose gold line draws downward. */
export function ItineraryTeaser({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="builder-title" className="section bg-white">
      <div className="container-site">
        <div className="grid items-center gap-10 rounded-panel bg-ivory-deep p-6 sm:p-8 md:p-14 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
          <div>
            <Reveal as="p" className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">{dict.itinerary.eyebrow}</span>
              <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold tracking-wide text-accent-700 uppercase">
                {dict.itinerary.comingSoon}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="builder-title" className="h2 mt-3">
                {dict.itinerary.title}
              </h2>
            </Reveal>
            <Reveal as="span" variant="rule" delay={0.16} className="rule-taper mt-4" aria-hidden />
            <Reveal as="p" delay={0.24} className="mt-4 max-w-xl text-lg text-muted">
              {dict.itinerary.comingSoonText}
            </Reveal>
            <Reveal delay={0.32}>
              <Link href={href(lang, "/contact")} className="btn btn-primary mt-8">
                {dict.itinerary.comingSoonCta} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
              </Link>
            </Reveal>
          </div>

          <ol className="relative grid gap-4 pl-2">
            <Reveal as="span" variant="line" aria-hidden className="absolute top-5 bottom-5 left-[29px] w-0.5 rounded-full bg-accent" />
            {dict.itinerary.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <Reveal as="li" key={step} delay={0.1 + i * 0.075} className="relative flex items-center gap-4">
                  <span className="z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-accent bg-ivory text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">
                    {dict.itinerary.step} {i + 1}
                  </span>
                  <span className="font-semibold text-primary">{step}</span>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
