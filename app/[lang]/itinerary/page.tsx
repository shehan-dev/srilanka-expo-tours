import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItineraryBuilder, type BuilderInitial } from "@/components/itinerary/ItineraryBuilder";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import type { GuideOption } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/itinerary", title: dict.itinerary.title, description: dict.itinerary.subtitle });
}

const num = (v: unknown) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : undefined);

export default async function ItineraryPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sp = await searchParams;

  const guide = ["driver", "national", "italian"].includes(String(sp.guide)) ? (sp.guide as GuideOption) : undefined;
  const initial: BuilderInitial = {
    days: num(sp.days),
    adults: num(sp.adults),
    kids: Number(sp.kids) >= 0 ? Number(sp.kids) || 0 : 0,
    guide,
    start: typeof sp.start === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.start) ? sp.start : undefined,
  };

  return (
    <>
      <PageHeader
        eyebrow={dict.itinerary.eyebrow}
        title={dict.itinerary.title}
        subtitle={dict.itinerary.subtitle}
        scene="coast"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.itinerary, path: href(lang, "/itinerary") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site">
          <ItineraryBuilder initial={initial} />
        </div>
      </section>
    </>
  );
}
