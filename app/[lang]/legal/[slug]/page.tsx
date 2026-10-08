import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { legalPages, legalSlugs, legalUpdated, type LegalSlug } from "@/lib/data/legal";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href, intlLocale, l, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

const isLegalSlug = (s: string): s is LegalSlug => (legalSlugs as readonly string[]).includes(s);

export function generateStaticParams() {
  return locales.flatMap((lang) => legalSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isLegalSlug(slug)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: `/legal/${slug}`, title: dict.legal[slug], description: `${site.name} — ${dict.legal[slug]}` });
}

export default async function LegalPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isLegalSlug(slug)) notFound();
  const dict = await getDictionary(lang);
  const title = dict.legal[slug];

  return (
    <>
      <PageHeader
        title={title}
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: title, path: href(lang, `/legal/${slug}`) },
        ]}
      />
      <section className="section pt-10">
        <div className="container-site grid gap-10 lg:grid-cols-[220px_1fr]">
          <nav aria-label={dict.footer.legal}>
            <ul className="flex flex-col gap-1 text-sm lg:sticky lg:top-24">
              {legalSlugs.map((s) => (
                <li key={s}>
                  <Link
                    href={href(lang, `/legal/${s}`)}
                    aria-current={s === slug ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2 hover:bg-sky ${s === slug ? "bg-sky font-semibold text-primary-600" : ""}`}
                  >
                    {dict.legal[s]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="prose-article max-w-3xl">
            <p className="text-sm text-muted">
              {dict.legal.lastUpdated}: <time dateTime={legalUpdated}>{formatDate(legalUpdated, intlLocale[lang])}</time>
            </p>
            {legalPages[slug].map((s) => (
              <section key={s.heading.en}>
                <h2>{l(s.heading, lang)}</h2>
                <p>{l(s.body, lang)}</p>
              </section>
            ))}

            {(slug === "insurance" || slug === "terms") && (
              <section className="mt-10 rounded-card bg-sky p-6">
                <h2 className="mt-0! flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent-700" aria-hidden /> {dict.legal.documents}
                </h2>
                {site.documents.length ? (
                  <ul>
                    {site.documents.map((d) => (
                      <li key={d.href}>
                        <a href={d.href} download className="text-primary-600 underline">
                          {d.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-0!">{dict.legal.documentsOnRequest}</p>
                )}
                <p className="mb-0! text-sm text-muted">
                  {dict.footer.license}: {site.licenseNumber}
                </p>
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
