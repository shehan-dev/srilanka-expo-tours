import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarRange, Car, ListChecks, MapPinned, MessageCircle, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

// The interactive builder lives in components/itinerary/ItineraryBuilder.tsx. To launch it,
// render <ItineraryBuilder initial={...} /> here again (see git history for the query-string parsing).

type Props = { params: Promise<{ lang: string }> };

const stepIcons = [CalendarRange, MapPinned, Car, ListChecks, Send];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/itinerary", title: dict.itinerary.comingSoonTitle, description: dict.itinerary.comingSoonText });
}

export default async function ItineraryPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.itinerary;

  return (
    <>
      <PageHeader
        eyebrow={`${t.eyebrow} · ${t.comingSoon}`}
        title={t.title}
        subtitle={t.subtitle}
        image="/media/pages/itinerary.jpg"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.itinerary, path: href(lang, "/itinerary") },
        ]}
      />
      <section className="section">
        <div className="container-site grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-50 px-4 py-1.5 text-sm font-semibold text-accent-700">
              <Sparkles className="h-4 w-4" aria-hidden /> {t.comingSoon}
            </span>
            <h2 className="h2">{t.comingSoonTitle}</h2>
            <p className="text-lg text-ink/80">{t.comingSoonText}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={href(lang, "/contact")} className="btn btn-primary">
                {t.comingSoonCta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(dict.contact.prefill)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
              <Link href={href(lang, "/tours")} className="btn btn-outline">
                {dict.popular.viewAll}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="grid gap-3 opacity-80">
              {t.steps.map((step, i) => {
                const Icon = stepIcons[i];
                return (
                  <li key={step} className="flex items-center gap-4 rounded-2xl bg-sky px-4 py-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary-600 shadow-sm">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-sm text-muted">
                      {t.step} {i + 1}
                    </span>
                    <span className="font-semibold">{step}</span>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  );
}
