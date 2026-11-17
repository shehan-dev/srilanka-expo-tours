import { BadgeCheck, CarFront, Route, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";

const icons = [BadgeCheck, CarFront, Route, ShieldCheck];

/** "Why travel with us": the one full-width Tea Green band, ivory text and gold line icons. */
export function FeatureStrip({ dict }: { dict: Dictionary }) {
  return (
    <section aria-labelledby="why-us" className="on-green section bg-primary text-ivory">
      <div className="container-site">
        <div className="mb-12 flex flex-col items-center gap-3 text-center md:mb-16">
          <Reveal delay={0.05}>
            <h2 id="why-us" className="h2 text-ivory">
              {dict.features.title}
            </h2>
          </Reveal>
          <Reveal as="span" variant="rule" delay={0.12} className="rule-taper" aria-hidden />
          <Reveal as="p" delay={0.2} className="measure text-lg text-ivory/85">
            {dict.features.subtitle}
          </Reveal>
        </div>

        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {dict.features.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={item.title} delay={i * 0.075} className="flex flex-col items-center gap-4 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-accent/50">
                  <Icon className="h-8 w-8 text-accent" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="text-xl font-semibold text-ivory">{item.title}</h3>
                <p className="max-w-[28ch] text-sm leading-relaxed text-ivory/85">{item.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
