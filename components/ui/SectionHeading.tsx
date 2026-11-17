import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/**
 * The one section-header pattern used across the site:
 * gold uppercase eyebrow → Playfair heading → tapered gold rule → optional one-line intro.
 * Centred for showcase sections; left-aligned with an action link on the right for list sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  action,
  id,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  action?: ReactNode;
  id?: string;
  className?: string;
}) {
  const centred = align === "center";
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:mb-14",
        centred ? "items-center text-center" : "items-start md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("flex flex-col gap-3", centred && "items-center")}>
        {eyebrow && (
          <Reveal as="span" className="eyebrow">
            {eyebrow}
          </Reveal>
        )}
        <Reveal delay={0.08}>
          <Tag id={id} className={Tag === "h1" ? "h1" : "h2"}>
            {title}
          </Tag>
        </Reveal>
        <Reveal as="span" variant="rule" delay={0.16} className="rule-taper" aria-hidden />
        {subtitle && (
          <Reveal as="p" delay={0.24} className={cn("measure text-lg text-muted", centred && "mx-auto")}>
            {subtitle}
          </Reveal>
        )}
      </div>
      {action}
    </div>
  );
}
