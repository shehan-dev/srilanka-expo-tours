import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fleet, SafetyNotes, ServicesGrid } from "@/components/sections/Services";
import { PricingTable } from "@/components/sections/PricingTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/services", title: dict.services.title, description: dict.services.subtitle });
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        subtitle={dict.services.subtitle}
        scene="city"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.services, path: href(lang, "/services") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site flex flex-col gap-20">
          <ServicesGrid dict={dict} lang={lang} />
          <Fleet dict={dict} lang={lang} />
          <SafetyNotes dict={dict} />
        </div>
      </section>
      <section aria-labelledby="pricing-title" className="section bg-sky/60">
        <div className="container-site">
          <SectionHeading id="pricing-title" eyebrow={dict.pricing.eyebrow} title={dict.pricing.title} subtitle={dict.pricing.subtitle} />
          <PricingTable dict={dict} lang={lang} />
          <p className="mt-10 text-center">
            <Link href={href(lang, "/contact")} className="btn btn-primary">
              {dict.nav.bookNow}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
