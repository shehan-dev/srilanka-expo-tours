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
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const aspectClass: Record<GalleryItem["aspect"], string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

/** Masonry photo grid with a keyboard-navigable lightbox. */
export function GalleryMasonry({ limit }: { limit?: number }) {
  const { lang, dict } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = gallery.slice(0, limit);
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
      <ul className="columns-2 gap-4 md:columns-3 [&>li]:mb-4">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.28 }}
              className="break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className={cn("group relative block w-full overflow-hidden rounded-card shadow-card", aspectClass[item.aspect])}
              >
                <Media
                  src={item.image}
                  scene={item.scene}
                  alt={l(item.caption, lang)}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                />
                <span className="hover-reveal absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgb(15_74_60/0.88),transparent)] p-3 pt-10 text-left text-sm font-medium text-ivory">
                  {l(item.caption, lang)}
                </span>
                {item.video && (
                  <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/95 text-primary">
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
        className="max-w-4xl bg-primary-600"
        hideTitle
      >
        {current && (
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-600 sm:aspect-video">
              {current.video ? (
                <video src={current.video} className="h-full w-full object-contain" autoPlay muted loop playsInline controls />
              ) : (
                <Media src={current.image} scene={current.scene} alt={l(current.caption, lang)} sizes="900px" className="object-contain" />
              )}
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={dict.gallery.prev}
                className="absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory text-primary shadow-card"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={dict.gallery.next}
                className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory text-primary shadow-card"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="on-green flex items-center justify-between gap-3 p-4 text-ivory">
              <p className="font-medium">
                {l(current.caption, lang)}
                <span className="ml-2 text-sm text-ivory/75">
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
