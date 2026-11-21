import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTour } from "@/lib/data/tours";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href, l } from "@/lib/i18n/config";
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

  // Links like ?tour=slug&option=premium, ?guide=nishan or ?message=… (booking bar estimate) prefill
  // the WhatsApp chat with what the visitor was looking at.
  const tour = sp.tour ? getTour(sp.tour) : undefined;
  const option = sp.option === "premium" || sp.option === "standard" ? sp.option : undefined;
  const message = [
    dict.contact.prefill,
    tour ? `${dict.contact.tour}: ${l(tour.title, lang)}${option ? ` (${dict.tour[option]})` : ""}` : "",
    sp.message?.slice(0, 500) ?? "",
    sp.guide === "nishan" ? `${dict.about.bookNishan} (${site.founder})` : "",
  ]
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
        <div className="container-site">
          <ContactDetails dict={dict} message={message} />
        </div>
      </section>
    </>
  );
}
