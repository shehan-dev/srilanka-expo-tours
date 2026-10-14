import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ToursCatalog, type CatalogFilters } from "@/components/tours/ToursCatalog";
import { lengthOf, maxTourPrice, type LengthId } from "@/lib/data/tours";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import type { RegionId, ThemeId } from "@/lib/types";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/tours", title: dict.catalog.title, description: dict.catalog.subtitle });
}

const list = <T extends string>(value: string | string[] | undefined, allowed: readonly T[]): T[] =>
  String(value ?? "")
    .split(",")
    .filter((v): v is T => (allowed as readonly string[]).includes(v));

/** Server-side parse of the query string so the filtered catalog is pre-rendered (SEO). */
function parseFilters(sp: Record<string, string | string[] | undefined>): CatalogFilters {
  const days = Number(sp.days);
  const lengthFromDays: LengthId[] = days ? [lengthOf(days)] : [];
  const theme = list(sp.theme, ["culture", "nature", "wildlife", "beach", "adventure", "family", "food"] as ThemeId[])[0];
  const max = Number(sp.max);
  const sort = list(sp.sort, ["popular", "price-asc", "price-desc", "duration"] as const)[0];
  return {
    theme: theme ?? "all",
    regions: list(sp.region, ["hill-country", "cultural-triangle", "south-coast", "east-coast", "national-parks", "city"] as RegionId[]),
    lengths: [...new Set([...list(sp.length, ["short", "medium", "long"] as LengthId[]), ...lengthFromDays])],
    maxPrice: max > 0 && max < maxTourPrice ? max : maxTourPrice,
    sort: sort ?? "popular",
  };
}

export default async function ToursPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const initial = parseFilters(await searchParams);

  return (
    <>
      <PageHeader
        eyebrow={dict.catalog.eyebrow}
        title={dict.catalog.title}
        subtitle={dict.catalog.subtitle}
        scene="rock"
        image="/media/pages/tours.jpg"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.tours, path: href(lang, "/tours") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site">
          <ToursCatalog initial={initial} />
        </div>
      </section>
    </>
  );
}
