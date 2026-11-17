import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Primary full-colour lockup (no tagline). For ivory or white backgrounds only:
 * never place it on green or on a photo; use <Wordmark> there instead.
 */
export function Logo({ compact, className, priority }: { compact?: boolean; className?: string; priority?: boolean }) {
  return (
    <Image
      src={site.logo.src}
      width={site.logo.width}
      height={site.logo.height}
      alt={site.name}
      priority={priority}
      sizes="120px"
      className={cn(
        "w-auto transition-[height] duration-300",
        compact ? "h-10 md:h-11" : "h-10 md:h-[52px]",
        className
      )}
    />
  );
}

/**
 * Text wordmark for Tea Green backgrounds, used until the reversed (white) logo is supplied:
 * LANKAVÉ in Playfair Display (ivory) over TOURS in Montserrat (gold) between two short gold rules.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span role="img" aria-label={site.name} className={cn("inline-flex flex-col items-center leading-none", className)}>
      <span aria-hidden className="font-heading text-[2rem] font-semibold tracking-[0.04em] text-ivory">
        LANKAVÉ
      </span>
      <span aria-hidden className="mt-2 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.4em] text-accent-300">
        <span className="h-px w-7 bg-accent" />
        <span className="-mr-[0.4em]">TOURS</span>
        <span className="h-px w-7 bg-accent" />
      </span>
    </span>
  );
}
