import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Heart, Leaf, Quote, Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";

const missionIcons = [Sparkles, Leaf, Heart];

export function MissionCards({ dict }: { dict: Dictionary }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {dict.about.mission.map((m, i) => {
        const Icon = missionIcons[i];
        return (
          <Reveal as="li" key={m.title} delay={i * 0.075} className="card flex flex-col gap-3 p-6">
            <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} aria-hidden />
            <h3 className="text-xl font-semibold">{m.title}</h3>
            <p className="text-sm text-muted">{m.text}</p>
          </Reveal>
        );
      })}
    </ul>
  );
}

/** Stats: Playfair numerals in green with gold-dark labels. Numbers count up once; the final value is in the HTML. */
export function Milestones({ dict }: { dict: Dictionary }) {
  return (
    <dl className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
      {dict.about.milestones.map((m, i) => (
        <Reveal key={m.label} delay={i * 0.075} className="flex flex-col-reverse items-center rounded-card bg-white p-6 text-center shadow-card ring-1 ring-line/60">
          <dt className="mt-2 text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">{m.label}</dt>
          <dd className="font-heading text-4xl font-semibold text-primary md:text-5xl">
            <CountUp value={m.value} />
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}

const team = [
  { id: "shehan", name: "Shehan Silva", photo: "/media/team/shehan-silva.jpg", position: "object-[50%_25%]" },
  { id: "dhammika", name: "Dhammika Fernando", photo: "/media/team/dhammika-fernando-portrait.jpg", position: "object-[50%_20%]" },
] as const;

/** The rest of the team, shown under the founder: photo beside name, role, one highlight and a short bio. */
export function TeamMembers({ dict }: { dict: Dictionary }) {
  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <h3 className="text-center text-2xl font-semibold">{dict.about.teamTitle}</h3>
      </Reveal>
      <ul className="grid gap-6 lg:grid-cols-2">
        {team.map((m, i) => {
          const t = dict.about.team[m.id];
          return (
            <Reveal
              as="li"
              key={m.id}
              delay={i * 0.08}
              className="grid overflow-hidden rounded-panel bg-white shadow-card ring-1 ring-line/60 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            >
              <div className="relative aspect-[4/5] bg-ivory-deep sm:aspect-auto sm:min-h-full">
                <Image src={m.photo} alt={`${m.name}, ${t.role}`} fill sizes="(min-width: 1024px) 16rem, (min-width: 640px) 40vw, 90vw" className={`object-cover ${m.position}`} />
              </div>
              <div className="flex flex-col gap-3 p-6 md:p-7">
                <span className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">{t.role}</span>
                <h4 className="font-heading text-2xl font-semibold text-primary">{m.name}</h4>
                <span className="rule-taper" aria-hidden />
                <p className="flex items-start gap-2 text-sm font-medium">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden /> {t.highlight}
                </p>
                <p className="text-[15px] text-ink/85">{t.bio}</p>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

/** Founder / chauffeur tourist guide: photo in a large rounded panel with a gold-outlined caption card. */
export function TeamProfile({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <Reveal className="relative mx-auto w-full max-w-md pb-6">
        <div className="relative aspect-[4/5] overflow-hidden rounded-panel bg-ivory-deep shadow-lift">
          <Image
            src={site.founderPhoto}
            alt={`${site.founder}, ${dict.about.founderTitle}`}
            fill
            sizes="(min-width: 1024px) 28rem, 90vw"
            className="object-cover object-top"
          />
        </div>
        <div className="absolute right-0 -bottom-2 rounded-card border border-accent bg-ivory p-4 shadow-card sm:-right-6">
          <p className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">{dict.about.yearsGuiding}</p>
          <p className="font-heading text-3xl font-semibold text-primary">
            <CountUp value="8+" />
          </p>
        </div>
      </Reveal>

      <div className="flex flex-col gap-5">
        <Reveal as="span" className="eyebrow">
          {dict.about.founderTitle}
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="h2">{site.founder}</h2>
        </Reveal>
        <Reveal as="span" variant="rule" delay={0.16} className="rule-taper" aria-hidden />
        <Reveal as="p" delay={0.2} className="measure text-lg text-ink/90">
          {dict.about.founderBio}
        </Reveal>

        <Reveal delay={0.26}>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-card bg-white p-4 ring-1 ring-line/60">
              <dt className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">{dict.about.credentials}</dt>
              <dd className="mt-1 flex items-start gap-2 text-sm font-medium">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden /> {dict.about.credentialsText}
              </dd>
            </div>
            <div className="rounded-card bg-white p-4 ring-1 ring-line/60">
              <dt className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">{dict.about.italy}</dt>
              <dd className="mt-1 text-sm font-medium">
                {dict.about.italyText}
              </dd>
            </div>
            <div className="rounded-card bg-white p-4 ring-1 ring-line/60">
              <dt className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">{dict.about.languagesSpoken}</dt>
              <dd className="mt-1 text-sm font-medium">
                {dict.languages.it} ✔ · {dict.languages.en} ✔ · Sinhala ✔
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.32}>
          <figure className="relative rounded-card border-l-4 border-accent bg-white p-5 shadow-card">
            <Quote className="absolute top-4 right-4 h-7 w-7 text-accent" strokeWidth={1.5} aria-hidden />
            <figcaption className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">{dict.about.favouriteRoute}</figcaption>
            <blockquote className="tagline mt-2 pr-8 text-lg text-ink">{dict.about.favouriteRouteText}</blockquote>
          </figure>
        </Reveal>

        <Reveal delay={0.38}>
          <Link href={`${href(lang, "/contact")}?guide=nishan`} className="btn btn-primary">
            {dict.about.bookNishan} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
