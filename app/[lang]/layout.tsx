import "../globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Lora, Montserrat, Playfair_Display } from "next/font/google";
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

// latin-ext covers the É in LANKAVÉ and Italian accented characters.
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
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
