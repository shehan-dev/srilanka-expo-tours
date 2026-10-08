"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { href } from "@/lib/i18n/config";

export default function NotFound() {
  const { lang, dict } = useI18n();
  return (
    <section className="grid min-h-[80vh] place-items-center bg-sky px-4 pt-32 pb-20">
      <div className="flex max-w-md flex-col items-center gap-5 text-center">
        <Compass className="h-16 w-16 text-primary" aria-hidden />
        <h1 className="text-4xl font-semibold">{dict.common.notFoundTitle}</h1>
        <p className="text-muted">{dict.common.notFoundText}</p>
        <Link href={href(lang)} className="btn btn-primary">
          {dict.common.backHome}
        </Link>
      </div>
    </section>
  );
}
