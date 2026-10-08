import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, locales } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Default social share image for every page (override per route with its own opengraph-image). */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : "en");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0a6eff 0%, #00a3c4 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "white", display: "flex" }} />
          SriLanka Expo Tours
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{dict.hero.title}</div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.9 }}>{dict.hero.tagline}</div>
      </div>
    ),
    size
  );
}
