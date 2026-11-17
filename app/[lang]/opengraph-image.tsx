import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, locales } from "@/lib/i18n/config";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Default social share image: ivory background, primary logo (without tagline), the tagline in
 * Lora italic, a thin gold rule and one localised sub-line. Brand fonts are loaded explicitly
 * because ImageResponse does not inherit next/font.
 */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : "en");
  const fonts = join(process.cwd(), "assets/fonts");
  const [logo, lora, montserrat] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo-primary-notagline.png")),
    readFile(join(fonts, "Lora-Italic.ttf")),
    readFile(join(fonts, "Montserrat-Medium.ttf")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F2E7",
          borderBottom: "14px solid #0F4A3C",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={520} height={305} alt="" />
        <div style={{ display: "flex", marginTop: 22, fontFamily: "Lora", fontStyle: "italic", fontSize: 40, color: "#0F4A3C" }}>
          {site.tagline}
        </div>
        <div
          style={{
            display: "flex",
            width: 120,
            height: 3,
            marginTop: 24,
            background: "linear-gradient(90deg, rgba(212,162,74,0), #D4A24A 25%, #D4A24A 75%, rgba(212,162,74,0))",
          }}
        />
        <div style={{ display: "flex", marginTop: 22, fontFamily: "Montserrat", fontSize: 26, color: "#55635D" }}>{dict.hero.badge}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Lora", data: lora, style: "italic", weight: 400 },
        { name: "Montserrat", data: montserrat, style: "normal", weight: 500 },
      ],
    }
  );
}
