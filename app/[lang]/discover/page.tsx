import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationExplorer } from "@/components/discover/DestinationExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/discover", title: dict.discover.title, description: dict.discover.subtitle });
}

export default async function DiscoverPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader
        eyebrow={dict.discover.eyebrow}
        title={dict.discover.title}
        subtitle={dict.discover.subtitle}
        scene="hills"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.discover, path: href(lang, "/discover") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site">
          <DestinationExplorer />
        </div>
      </section>
    </>
  );
}
