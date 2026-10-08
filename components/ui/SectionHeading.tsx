import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  action?: ReactNode;
  id?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-10 flex flex-col gap-3 md:mb-14",
        align === "center" ? "items-center text-center" : "items-start md:flex-row md:items-end md:justify-between"
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && (
          <span className="eyebrow">
            <span aria-hidden className="h-px w-6 bg-accent" />
            {eyebrow}
          </span>
        )}
        <Tag id={id} className={Tag === "h1" ? "h1" : "h2"}>
          {title}
        </Tag>
        {subtitle && <p className={cn("max-w-2xl text-lg text-muted", align === "center" && "mx-auto")}>{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  );
}
