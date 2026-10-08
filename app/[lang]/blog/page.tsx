import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCards } from "@/components/sections/BlogCards";
import { PageHeader } from "@/components/ui/PageHeader";
import { posts } from "@/lib/data/blog";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import type { BlogCategory } from "@/lib/types";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
};

const categories: BlogCategory[] = ["for-italians", "food-drink", "practical", "nature"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata({ lang, path: "/blog", title: dict.blog.title, description: dict.blog.subtitle });
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { category } = await searchParams;
  const active = categories.find((c) => c === category);
  const list = [...posts].sort((a, b) => b.date.localeCompare(a.date)).filter((p) => !active || p.category === active);

  return (
    <>
      <PageHeader
        eyebrow={dict.blog.eyebrow}
        title={dict.blog.title}
        subtitle={dict.blog.subtitle}
        scene="coast"
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.blog, path: href(lang, "/blog") },
        ]}
      />
      <section className="section pt-10 md:pt-14">
        <div className="container-site">
          <nav aria-label={dict.blog.title} className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
            <Link href={href(lang, "/blog")} className="chip shrink-0" data-active={!active} aria-current={!active ? "page" : undefined}>
              {dict.blog.all}
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`${href(lang, "/blog")}?category=${c}`}
                className="chip shrink-0"
                data-active={active === c}
                aria-current={active === c ? "page" : undefined}
              >
                {dict.blog.categories[c]}
              </Link>
            ))}
          </nav>
          <BlogCards posts={list} lang={lang} dict={dict} />
        </div>
      </section>
    </>
  );
}
