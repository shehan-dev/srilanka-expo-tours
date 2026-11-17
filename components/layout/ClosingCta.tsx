"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Reveal } from "@/components/ui/Reveal";
import { href } from "@/lib/i18n/config";

/**
 * Pre-footer call-to-action band. Shown on every page that does not already end with the
 * booking form (the home page and the contact page do).
 */
export function ClosingCta() {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  if (pathname === `/${lang}` || pathname.startsWith(href(lang, "/contact"))) return null;

  return (
    <section aria-labelledby="closing-cta" className="bg-ivory-deep">
      <div className="container-site flex flex-col items-center gap-4 py-14 text-center md:py-20">
        <Reveal as="span" className="eyebrow">
          {dict.contact.eyebrow}
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="closing-cta" className="h2">
            {dict.contact.title}
          </h2>
        </Reveal>
        <Reveal as="span" variant="rule" delay={0.16} className="rule-taper" aria-hidden />
        <Reveal as="p" delay={0.24} className="measure text-lg text-muted">
          {dict.contact.subtitle}
        </Reveal>
        <Reveal delay={0.3}>
          <Link href={href(lang, "/contact")} className="btn btn-primary mt-2">
            {dict.itinerary.comingSoonCta} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
