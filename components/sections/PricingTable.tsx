import Link from "next/link";
import { Check, Minus } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { Price } from "@/components/ui/Price";
import { Reveal } from "@/components/ui/Reveal";

/** Essential · Comfort · Premium comparison with feature matrix. */
export function PricingTable({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const { tiers, features } = dict.pricing;

  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {tiers.map((tier, t) => {
        const featured = t === 1;
        return (
          <Reveal
            as="li"
            key={tier.id}
            delay={t * 0.08}
            className={cn(
              "relative flex flex-col rounded-[1.75rem] p-7",
              featured ? "bg-ink text-white shadow-lift lg:-my-4 lg:py-11" : "card"
            )}
          >
            {featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-ink">
                {dict.pricing.popular}
              </span>
            )}
            <h3 className={cn("text-xl font-semibold", featured && "text-white")}>{tier.name}</h3>
            <p className="mt-4">
              <Price usd={tier.price} className="font-heading text-4xl font-bold" />
              <span className={cn("text-sm", featured ? "text-white/70" : "text-muted")}> / {dict.pricing.perPerson}</span>
            </p>
            <p className={cn("mt-1 text-sm", featured ? "text-white/70" : "text-muted")}>
              <Price usd={tier.group} className="font-semibold" /> · {dict.pricing.perGroup}
            </p>

            <ul className="mt-6 flex flex-col gap-3 border-t border-current/10 pt-6 text-sm">
              {features.map((f) => {
                const v = f.values[t];
                const included = v !== false;
                return (
                  <li key={f.label} className={cn("flex items-start gap-2.5", !included && (featured ? "text-white/50" : "text-muted"))}>
                    {included ? (
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", featured ? "text-accent" : "text-accent-700")} aria-hidden />
                    ) : (
                      <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    )}
                    <span>
                      {!included && <span className="sr-only">✗ </span>}
                      {f.label}
                      {typeof v === "string" && <strong className="font-semibold">: {v}</strong>}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link
              href={`${href(lang, "/contact")}?package=${tier.id}`}
              className={cn("btn mt-8", featured ? "btn-accent" : "btn-outline")}
            >
              {dict.pricing.choose} {tier.name}
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
