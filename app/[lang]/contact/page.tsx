import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTour } from "@/lib/data/tours";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/contact", title: dict.contact.title, description: dict.contact.subtitle });
}

export default async function ContactPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sp = await searchParams;

  // Prefill from links like ?tour=slug&option=premium, ?guide=nishan or ?message=… (booking bar estimate)
  const tour = sp.tour && getTour(sp.tour) ? sp.tour : "";
  const option = sp.option === "premium" || sp.option === "standard" ? sp.option : "";
  const message = [sp.message?.slice(0, 500) ?? "", sp.guide === "nishan" ? `${dict.about.bookNishan} (${site.founder})` : ""]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <PageHeader
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        subtitle={dict.contact.subtitle}
        scene="coast"
        image="/media/pages/contact.jpg"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.contact, path: href(lang, "/contact") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm defaultTour={tour} defaultOption={option} defaultMessage={message} />
          <ContactDetails dict={dict} />
        </div>
      </section>
    </>
  );
}
