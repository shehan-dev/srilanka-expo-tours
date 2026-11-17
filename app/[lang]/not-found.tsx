"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { Logo } from "@/components/layout/Logo";
import { href } from "@/lib/i18n/config";

/** Branded 404: ivory, primary logo, gold rule, back to tours. */
export default function NotFound() {
  const { lang, dict } = useI18n();
  return (
    <section className="grid min-h-[80vh] place-items-center bg-ivory px-5 pt-32 pb-20">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <Logo className="h-20! md:h-24!" />
        <p className="font-heading text-7xl font-semibold text-primary">404</p>
        <span className="rule-taper" aria-hidden />
        <h1 className="text-3xl font-semibold">{dict.common.notFoundTitle}</h1>
        <p className="text-muted">{dict.common.notFoundText}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={href(lang, "/tours")} className="btn btn-primary">
            {dict.common.backToTours} <ArrowRight className="btn-arrow h-4 w-4" aria-hidden />
          </Link>
          <Link href={href(lang)} className="btn btn-outline">
            {dict.common.backHome}
          </Link>
        </div>
      </div>
    </section>
  );
}
