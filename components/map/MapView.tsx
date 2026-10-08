"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";
import type { MapPoint } from "./LeafletMap";

export type { MapPoint };

// Leaflet touches `window` on import, so the map only ever renders in the browser.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="shimmer h-full w-full" />,
});

export function MapView({
  points,
  activeId,
  onSelect,
  linkLabel,
  className,
  label,
}: {
  points: MapPoint[];
  activeId?: string;
  onSelect?: (id: string) => void;
  linkLabel?: string;
  className?: string;
  label?: string;
}) {
  const { dict } = useI18n();
  return (
    <div
      role="region"
      aria-label={label ?? dict.catalog.map}
      className={cn("relative isolate overflow-hidden rounded-card bg-sky ring-1 ring-line", className)}
    >
      <LeafletMap points={points} activeId={activeId} onSelect={onSelect} linkLabel={linkLabel} />
    </div>
  );
}
