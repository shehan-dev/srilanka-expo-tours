"use client";

import { useI18n } from "@/components/providers/AppProviders";
import { LogoLoader } from "@/components/ui/LogoLoader";

/** Shown by Next.js while a page is loading (route transitions, on-demand pages). */
export default function Loading() {
  const { dict } = useI18n();
  return (
    <div className="grid min-h-[75vh] place-items-center bg-ivory pt-24">
      <LogoLoader label={dict.common.loading} />
    </div>
  );
}
