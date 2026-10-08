"use client";

import { useCurrency } from "@/components/providers/AppProviders";

/** Renders a USD amount in the visitor's selected currency. */
export function Price({ usd, className }: { usd: number; className?: string }) {
  const { format } = useCurrency();
  return (
    <span className={className} suppressHydrationWarning>
      {format(usd)}
    </span>
  );
}
