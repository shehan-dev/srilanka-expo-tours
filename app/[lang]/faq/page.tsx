import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { faqs } from "@/lib/data/faqs";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/faq", title: dict.faq.title, description: dict.faq.subtitle });
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <JsonLd data={faqLd(faqs, lang)} />
      <PageHeader
        eyebrow={dict.faq.eyebrow}
        title={dict.faq.title}
        subtitle={dict.faq.subtitle}
        scene="temple"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.faq, path: href(lang, "/faq") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site max-w-3xl">
          <FAQAccordion />
        </div>
      </section>
    </>
  );
}
