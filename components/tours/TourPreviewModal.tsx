"use client";

import Link from "next/link";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { MapView } from "@/components/map/MapView";
import { Media } from "@/components/ui/Media";
import { Modal } from "@/components/ui/Modal";
import { dayLabels } from "@/lib/data/tours";
import { href, l } from "@/lib/i18n/config";
import type { Tour } from "@/lib/types";
import { TourPrices, TourTags } from "./TourCard";

/** Quick-view dialog: highlights, itinerary bullets, map, both price options and booking CTA. */
export function TourPreviewModal({ tour, onClose }: { tour: Tour | null; onClose: () => void }) {
  const { lang, dict } = useI18n();
  const labels = tour ? dayLabels(tour) : [];

  return (
    <Modal
      open={!!tour}
      onClose={onClose}
      title={tour ? l(tour.title, lang) : ""}
      closeLabel={dict.tour.close}
      hideTitle
      className="max-w-3xl"
    >
      {tour && (
        <div>
          <div className="relative aspect-[16/7] overflow-hidden">
            <Media src={tour.image} scene={tour.scene} alt="" sizes="768px" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white">
              <TourTags tour={tour} />
              <p aria-hidden className="font-heading text-2xl font-semibold sm:text-3xl">
                {l(tour.title, lang)}
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden /> {tour.durationDays} {dict.tour.days}
                </span>
              </div>
              <p className="text-[15px] text-ink/85">{l(tour.description, lang)}</p>

              <div>
                <h3 className="mb-2 text-base font-semibold">{dict.tour.itinerary}</h3>
                <ol className="flex flex-col gap-2">
                  {tour.itinerary.slice(0, 7).map((d, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-sky px-1.5 text-xs font-bold text-primary-600">
                        {labels[i].label}
                      </span>
                      <span>
                        <strong className="font-semibold">{l(d.title, lang)}</strong>
                        <span className="text-muted"> — {l(d.description, lang)}</span>
                      </span>
                    </li>
                  ))}
                  {tour.itinerary.length > 7 && <li className="pl-9 text-sm text-muted">+ {tour.itinerary.length - 7}…</li>}
                </ol>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <MapView
                className="h-48"
                points={[{ id: tour.id, coords: tour.coords, title: l(tour.title, lang) }]}
                label={`${dict.catalog.map}: ${l(tour.title, lang)}`}
              />
              <ul className="flex flex-col gap-1.5 text-sm">
                {l(tour.highlights, lang).map((h) => (
                  <li key={h} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-700" aria-hidden /> {h}
                  </li>
                ))}
              </ul>
              <p className="flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {tour.regions.map((r) => dict.regions[r]).join(" · ")}
              </p>
              <div className="mt-auto rounded-2xl border border-line p-4">
                <TourPrices tour={tour} />
                <p className="mt-2 text-xs text-muted">
                  / {dict.tour.perPerson} · {dict.tour.priceDisclaimer}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href={`${href(lang, "/contact")}?tour=${tour.slug}`} className="btn btn-primary btn-sm flex-1">
                    {dict.tour.bookThis}
                  </Link>
                  <Link href={href(lang, `/tours/${tour.slug}`)} className="btn btn-outline btn-sm flex-1">
                    {dict.tour.details}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
