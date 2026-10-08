import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryMasonry } from "@/components/sections/GalleryMasonry";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/gallery", title: dict.gallery.title, description: dict.hero.tagline });
}

export default async function GalleryPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader
        eyebrow={dict.gallery.eyebrow}
        title={dict.gallery.title}
        subtitle={dict.hero.tagline}
        scene="safari"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.gallery, path: href(lang, "/gallery") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site">
          <GalleryMasonry />
        </div>
      </section>
    </>
  );
}
