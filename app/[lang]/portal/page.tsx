import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { ...pageMetadata({ lang, path: "/portal", title: dict.portal.title, description: dict.portal.text }), robots: { index: false } };
}

/** Placeholder until the B2B agent portal (net rates, allotments, bookings) is built. */
export default async function PortalPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <section className="grid min-h-[80vh] place-items-center bg-sky px-4 pt-32 pb-20">
      <div className="card flex max-w-lg flex-col items-center gap-5 p-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-white">
          <Briefcase className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="text-3xl font-semibold">{dict.portal.title}</h1>
        <p className="text-muted">{dict.portal.text}</p>
        <Link href={href(lang, "/contact")} className="btn btn-primary">
          {dict.portal.cta}
        </Link>
      </div>
    </section>
  );
}
