import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, Leaf, Quote, Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

const missionIcons = [Sparkles, Leaf, Heart];

export function MissionCards({ dict }: { dict: Dictionary }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {dict.about.mission.map((m, i) => {
        const Icon = missionIcons[i];
        return (
          <Reveal as="li" key={m.title} delay={i * 0.08} className="card flex flex-col gap-3 p-6">
            <Icon className="h-7 w-7 text-accent-700" aria-hidden />
            <h3 className="text-lg font-semibold">{m.title}</h3>
            <p className="text-sm text-muted">{m.text}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}

export function Milestones({ dict }: { dict: Dictionary }) {
  return (
    <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {dict.about.milestones.map((m, i) => (
        <Reveal key={m.label} delay={i * 0.08} className="rounded-2xl bg-white p-5 text-center shadow-card ring-1 ring-line">
          <dt className="sr-only">{m.label}</dt>
          <dd className="font-heading text-3xl font-bold text-primary-600 md:text-4xl">{m.value}</dd>
          <dd className="mt-1 text-sm text-muted">{m.label}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

/** Founder / chauffeur tourist guide profile block. */
export function TeamProfile({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <Reveal className="relative mx-auto w-full max-w-md">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sky shadow-lift">
          <Image
            src={site.founderPhoto}
            alt={`${site.founder} — ${dict.about.founderTitle}`}
            fill
            sizes="(min-width: 1024px) 28rem, 90vw"
            className="object-cover object-top"
          />
        </div>
        <div className="absolute -right-4 -bottom-6 rounded-2xl bg-white p-4 shadow-lift ring-1 ring-line sm:-right-8">
          <p className="text-xs text-muted">{dict.about.yearsGuiding}</p>
          <p className="font-heading text-3xl font-bold text-primary-600">5+</p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col gap-5">
        <span className="eyebrow">
          <span aria-hidden className="h-px w-6 bg-accent" />
          {dict.about.founderTitle}
        </span>
        <h2 className="h2">{site.founder}</h2>
        <p className="text-lg text-ink/85">{dict.about.founderBio}</p>

        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-sky p-4">
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{dict.about.credentials}</dt>
            <dd className="mt-1 flex items-start gap-2 text-sm font-medium">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" aria-hidden /> {dict.about.credentialsText}
            </dd>
          </div>
          <div className="rounded-2xl bg-sky p-4">
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{dict.about.italy}</dt>
            <dd className="mt-1 text-sm font-medium">
              <span aria-hidden>🇮🇹 </span>
              {dict.about.italyText}
            </dd>
          </div>
          <div className="rounded-2xl bg-sky p-4">
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{dict.about.languagesSpoken}</dt>
            <dd className="mt-1 text-sm font-medium">
              {dict.languages.it} ✔ · {dict.languages.en} ✔ · Sinhala ✔
            </dd>
          </div>
        </dl>

        <figure className="relative rounded-2xl border-l-4 border-accent bg-white p-5 shadow-card">
          <Quote className="absolute top-4 right-4 h-6 w-6 text-sky-200" aria-hidden />
          <figcaption className="text-xs font-semibold tracking-wide text-muted uppercase">{dict.about.favouriteRoute}</figcaption>
          <blockquote className="mt-2 text-[15px] text-ink/85 italic">{dict.about.favouriteRouteText}</blockquote>
        </figure>

        <div>
          <Link href={`${href(lang, "/contact")}?guide=nishan`} className="btn btn-primary">
            {dict.about.bookNishan}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
