"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Share2 } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Media } from "@/components/ui/Media";
import { Modal } from "@/components/ui/Modal";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { gallery } from "@/lib/data/gallery";
import { l } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import type { GalleryCategory, GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const aspectClass: Record<GalleryItem["aspect"], string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

const categories: GalleryCategory[] = ["nature", "culture", "food", "vehicles"];

/** Filterable masonry grid with keyboard-navigable lightbox. */
export function GalleryMasonry({ limit }: { limit?: number }) {
  const { lang, dict } = useI18n();
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = gallery.filter((g) => filter === "all" || g.category === filter).slice(0, limit);
  const current = openIndex !== null ? items[openIndex] : null;

  const step = useCallback(
    (dir: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  const share = async (item: GalleryItem) => {
    const data = { title: site.name, text: l(item.caption, lang), url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {}
    } else {
      await navigator.clipboard?.writeText(data.url);
    }
  };

  return (
    <div>
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1 md:justify-center" role="group" aria-label={dict.gallery.title}>
        <button type="button" className="chip shrink-0" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          {dict.gallery.all}
        </button>
        {categories.map((c) => (
          <button key={c} type="button" className="chip shrink-0" aria-pressed={filter === c} onClick={() => setFilter(c)}>
            {dict.gallery.categories[c]}
          </button>
        ))}
      </div>

      <ul className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>li]:mb-4">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className={cn("group relative block w-full overflow-hidden rounded-2xl shadow-card", aspectClass[item.aspect])}
              >
                <Media
                  src={item.image}
                  scene={item.scene}
                  alt={l(item.caption, lang)}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/70 to-transparent p-3 pt-10 text-left text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {l(item.caption, lang)}
                </span>
                {item.video && (
                  <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-primary">
                    <Play className="h-4 w-4 fill-current" aria-hidden />
                    <span className="sr-only">{dict.gallery.video}</span>
                  </span>
                )}
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-6 flex justify-center">
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          <InstagramIcon /> {dict.gallery.followUs}
        </a>
      </div>

      <Modal
        open={!!current}
        onClose={() => setOpenIndex(null)}
        title={current ? l(current.caption, lang) : ""}
        closeLabel={dict.gallery.close}
        className="max-w-4xl bg-ink"
        hideTitle
      >
        {current && (
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink sm:aspect-video">
              {current.video ? (
                <video src={current.video} className="h-full w-full object-contain" autoPlay muted loop playsInline controls />
              ) : (
                <Media src={current.image} scene={current.scene} alt={l(current.caption, lang)} sizes="900px" className="object-contain" />
              )}
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={dict.gallery.prev}
                className="absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={dict.gallery.next}
                className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 p-4 text-white">
              <p className="font-medium">
                {l(current.caption, lang)}
                <span className="ml-2 text-sm text-white/60">
                  {(openIndex ?? 0) + 1} / {items.length}
                </span>
              </p>
              <button type="button" onClick={() => share(current)} className="btn btn-ghost-light btn-sm">
                <Share2 className="h-4 w-4" aria-hidden /> {dict.gallery.share}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
