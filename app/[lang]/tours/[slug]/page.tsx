import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, CheckCircle2, ChevronRight, Clock, Info, Languages, MapPin, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { Media } from "@/components/ui/Media";
import { Price } from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";
import { MapView } from "@/components/map/MapView";
import { TourCard, TourTags } from "@/components/tours/TourCard";
import { dayLabels, getTour, tours } from "@/lib/data/tours";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href, l, locales } from "@/lib/i18n/config";
import { breadcrumbLd, pageMetadata, tourLd } from "@/lib/seo";
import { site } from "@/lib/site";
import type { PackageOption } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => tours.map((t) => ({ lang, slug: t.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const tour = getTour(slug);
  if (!hasLocale(lang) || !tour) return {};
  return pageMetadata({ lang, path: `/tours/${slug}`, title: l(tour.title, lang), description: l(tour.tagline, lang) });
}

export default async function TourPage({ params }: Props) {
  const { lang, slug } = await params;
  const tour = getTour(slug);
  if (!hasLocale(lang) || !tour) notFound();
  const dict = await getDictionary(lang);
  const title = l(tour.title, lang);
  const labels = dayLabels(tour);

  const crumbs = [
    { name: dict.common.home, path: href(lang) },
    { name: dict.nav.tours, path: href(lang, "/tours") },
    { name: title, path: href(lang, `/tours/${slug}`) },
  ];

  const related = tours
    .filter((t) => t.id !== tour.id && t.themes.some((th) => tour.themes.includes(th)))
    .slice(0, 3);

  const whatsappText = encodeURIComponent(`${dict.contact.prefill} — ${title}`);
  const options: { key: PackageOption; label: string; hotels: string }[] = [
    { key: "standard", label: dict.tour.standard, hotels: dict.tour.standardHotels },
    { key: "premium", label: dict.tour.premium, hotels: dict.tour.premiumHotels },
  ];

  return (
    <>
      <JsonLd data={tourLd(tour, lang)} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      {/* Hero */}
      <header className="relative isolate flex min-h-[70vh] items-end overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 -z-20">
          <Media src={tour.image} scene={tour.scene} alt="" sizes="100vw" priority />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-ink/85 via-ink/30 to-ink/40" />
        <div className="container-site text-white">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/80">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.path} className="hover:text-white hover:underline">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <TourTags tour={tour} className="mb-4" />
          <h1 className="h1 max-w-4xl text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">{l(tour.tagline, lang)}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden /> {tour.durationDays} {dict.tour.days}
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden /> {tour.regions.map((r) => dict.regions[r]).join(" · ")}
            </li>
          </ul>
        </div>
        {tour.imageCredit && (
          <a
            href={tour.imageCredit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-3 bottom-2 text-[11px] text-white/60 hover:text-white"
          >
            {dict.tour.photoBy}: {tour.imageCredit.name} / Unsplash
          </a>
        )}
      </header>

      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1fr_380px] lg:py-16">
        <div className="flex min-w-0 flex-col gap-12">
          <Reveal>
            <p className="text-lg leading-8 text-ink/85">{l(tour.description, lang)}</p>
          </Reveal>

          <Reveal>
            <h2 className="mb-5 text-2xl font-semibold">{dict.tour.highlights}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {l(tour.highlights, lang).map((h) => (
                <li key={h} className="flex gap-3 rounded-2xl bg-sky p-4 text-[15px]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent-700" aria-hidden /> {h}
                </li>
              ))}
            </ul>
          </Reveal>

          <section aria-labelledby="itinerary-title">
            <h2 id="itinerary-title" className="mb-6 text-2xl font-semibold">
              {dict.tour.itinerary}
            </h2>
            <ol className="relative flex flex-col gap-6 border-l-2 border-dashed border-sky-200 pl-8">
              {tour.itinerary.map((d, i) => (
                <Reveal as="li" key={i} delay={Math.min(i, 6) * 0.05} className="relative">
                  <span className="absolute top-0 -left-[49px] grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold tracking-wide text-accent-700 uppercase">
                    {labels[i].multi ? dict.tour.days : dict.tour.day} {labels[i].label}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{l(d.title, lang)}</h3>
                  <p className="mt-1 text-[15px] text-muted">{l(d.description, lang)}</p>
                </Reveal>
              ))}
            </ol>
          </section>

          <Reveal>
            <h2 className="mb-5 text-2xl font-semibold">{dict.tour.includes}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {l(tour.includes, lang).map((x) => (
                <li key={x} className="flex gap-2 text-[15px]">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden /> {x}
                </li>
              ))}
            </ul>
          </Reveal>

          <MapView
            className="h-80"
            label={`${dict.catalog.map}: ${title}`}
            points={[{ id: tour.id, coords: tour.coords, title }]}
          />
        </div>

        {/* Booking sidebar: Standard / Premium options */}
        <aside aria-label={dict.tour.bookThis}>
          <div className="card sticky top-24 flex flex-col gap-5 p-6">
            <h2 className="text-lg font-semibold">{dict.tour.options}</h2>
            <ul className="flex flex-col gap-3">
              {options.map((o) => (
                <li
                  key={o.key}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border-2 p-4",
                    o.key === "premium" ? "border-primary/40 bg-primary-50/60" : "border-line"
                  )}
                >
                  <div>
                    <p className="font-semibold">{o.label}</p>
                    <p className="flex items-center gap-1 text-xs text-muted">
                      <BedDouble className="h-3.5 w-3.5" aria-hidden /> {o.hotels}
                    </p>
                    <p className="mt-1">
                      <Price usd={tour.prices[o.key]} className="font-heading text-2xl font-bold" />
                      <span className="text-xs text-muted"> / {dict.tour.perPerson}</span>
                    </p>
                  </div>
                  <Link
                    href={`${href(lang, "/contact")}?tour=${tour.slug}&option=${o.key}`}
                    className={cn("btn btn-sm", o.key === "premium" ? "btn-primary" : "btn-outline")}
                  >
                    {dict.tour.bookOption}
                    <span className="sr-only">
                      : {title} — {o.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <dl className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-muted">
                  <Clock className="h-4 w-4" aria-hidden /> {dict.catalog.length}
                </dt>
                <dd className="font-medium">
                  {tour.durationDays} {dict.tour.days}
                </dd>
              </div>
            </dl>

            <p className="flex gap-2 rounded-xl bg-sky p-3 text-xs text-ink/80">
              <Languages className="h-4 w-4 shrink-0 text-accent-700" aria-hidden /> {dict.tour.anyGuide}
            </p>

            <div className="flex flex-col gap-2">
              <Link href={`${href(lang, "/contact")}?tour=${tour.slug}`} className="btn btn-outline btn-sm">
                {dict.tour.customise}
              </Link>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-primary-600 hover:bg-sky"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> {dict.tour.askQuestion}
              </a>
            </div>
            <p className="flex gap-2 text-xs text-muted">
              <Info className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                {dict.tour.priceDisclaimer} {dict.tour.priceNote}
              </span>
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section bg-sky/60">
          <div className="container-site">
            <h2 id="related-title" className="h2 mb-8">
              {dict.tour.related}
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <li key={t.id}>
                  <TourCard tour={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
