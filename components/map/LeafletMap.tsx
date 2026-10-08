"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { latLngBounds } from "leaflet";

export interface MapPoint {
  id: string;
  coords: [number, number];
  title: string;
  subtitle?: string;
  href?: string;
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView(points[0].coords, 9);
    } else {
      map.fitBounds(latLngBounds(points.map((p) => p.coords)), { padding: [40, 40], maxZoom: 9 });
    }
  }, [map, points]);
  return null;
}

function FlyToActive({ points, activeId }: { points: MapPoint[]; activeId?: string }) {
  const map = useMap();
  useEffect(() => {
    const p = points.find((x) => x.id === activeId);
    if (p) map.flyTo(p.coords, Math.max(map.getZoom(), 8), { duration: 0.8 });
  }, [map, points, activeId]);
  return null;
}

/** OpenStreetMap + Leaflet map with circle pins. Load via <MapView> (client-only). */
export default function LeafletMap({
  points,
  activeId,
  onSelect,
  linkLabel,
}: {
  points: MapPoint[];
  activeId?: string;
  onSelect?: (id: string) => void;
  linkLabel?: string;
}) {
  return (
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      <FlyToActive points={points} activeId={activeId} />
      {points.map((p) => {
        const active = p.id === activeId;
        return (
          <CircleMarker
            key={p.id}
            center={p.coords}
            radius={active ? 12 : 8}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: active ? "#00a3c4" : "#0a6eff",
              fillOpacity: 1,
            }}
            eventHandlers={{ click: () => onSelect?.(p.id) }}
          >
            <Popup>
              <strong className="block text-sm">{p.title}</strong>
              {p.subtitle && <span className="block text-xs text-muted">{p.subtitle}</span>}
              {p.href && linkLabel && (
                <Link href={p.href} className="mt-1 inline-block text-xs font-semibold text-primary">
                  {linkLabel} →
                </Link>
              )}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
