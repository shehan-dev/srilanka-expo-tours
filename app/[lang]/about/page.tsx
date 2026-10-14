import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MissionCards, Milestones, TeamProfile } from "@/components/sections/TeamProfile";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/about", title: dict.about.title, description: dict.about.story });
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        subtitle={dict.about.story}
        scene="temple"
        image="/media/pages/about.jpg"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.about, path: href(lang, "/about") },
        ]}
      />
      <section className="section">
        <div className="container-site flex flex-col gap-20">
          <MissionCards dict={dict} />
          <TeamProfile dict={dict} lang={lang} />
          <div>
            <h2 className="h2 mb-8 text-center">{dict.about.milestonesTitle}</h2>
            <Milestones dict={dict} />
          </div>
        </div>
      </section>
      <TestimonialsSlider />
    </>
  );
}
