import "../globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { JsonLd } from "@/components/ui/JsonLd";
import { revealScript } from "@/components/ui/Reveal";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, locales } from "@/lib/i18n/config";
import { organizationLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

// Self-hosted variable fonts (assets/fonts/web), subset to Latin + Latin-ext so the É in LANKAVÉ
// and Italian accented characters render. Local files keep builds independent of Google Fonts.
const playfair = localFont({
  src: "../../assets/fonts/web/PlayfairDisplay-VF.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-playfair",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const montserrat = localFont({
  src: "../../assets/fonts/web/Montserrat-VF.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
const lora = localFont({
  src: [
    { path: "../../assets/fonts/web/Lora-VF.woff2", weight: "400 700", style: "normal" },
    { path: "../../assets/fonts/web/Lora-Italic-VF.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-lora",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0F4A3C",
};

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    applicationName: site.name,
    appleWebApp: { title: site.name },
    ...pageMetadata({ lang, title: dict.meta.title, description: dict.meta.description }),
    title: { default: dict.meta.title, template: `%s · ${site.name}` },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${playfair.variable} ${montserrat.variable} ${lora.variable}`}
    >
      <head>
        {/* Runs before first paint: enables scroll reveals only when JavaScript is available. */}
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body>
        <AppProviders lang={lang} dict={dict}>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <ClosingCta />
          <Footer lang={lang} dict={dict} />
          <FloatingContact />
        </AppProviders>
        <JsonLd data={organizationLd(lang, dict.meta.description)} />
      </body>
    </html>
  );
}
