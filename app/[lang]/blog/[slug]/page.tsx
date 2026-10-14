import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { BlogCards } from "@/components/sections/BlogCards";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPost, posts } from "@/lib/data/blog";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href, intlLocale, l, locales } from "@/lib/i18n/config";
import { articleLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!hasLocale(lang) || !post) return {};
  return pageMetadata({ lang, path: `/blog/${slug}`, title: l(post.title, lang), description: l(post.excerpt, lang), type: "article" });
}

/** Renders the lightweight body markup: "## " headings, "- " bullets, blank-line paragraphs. */
function ArticleBody({ source }: { source: string }) {
  const blocks = source.split(/\n\s*\n/);
  return (
    <div className="prose-article">
      {blocks.map((block, i) => {
        const lines = block.trim().split("\n");
        if (lines[0].startsWith("## ")) {
          const [heading, ...rest] = lines;
          return (
            <div key={i}>
              <h2>{heading.slice(3)}</h2>
              {rest.length > 0 && <p>{rest.join(" ")}</p>}
            </div>
          );
        }
        if (lines.every((ln) => ln.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((ln) => (
                <li key={ln}>{ln.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const post = getPost(slug);
  if (!hasLocale(lang) || !post) notFound();
  const dict = await getDictionary(lang);
  const title = l(post.title, lang);
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd data={articleLd(post, lang)} />
      <PageHeader
        eyebrow={dict.blog.categories[post.category]}
        title={title}
        subtitle={l(post.excerpt, lang)}
        scene={post.scene}
        image={post.image}
        crumbs={[
          { name: dict.common.home, path: href(lang) },
          { name: dict.nav.blog, path: href(lang, "/blog") },
          { name: title, path: href(lang, `/blog/${slug}`) },
        ]}
      />
      <article className="section pt-10">
        <div className="container-site max-w-3xl">
          <p className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            {dict.blog.by} <strong className="text-ink">{post.author}</strong>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{formatDate(post.date, intlLocale[lang])}</time>
            <span aria-hidden>·</span>
            <Clock className="h-4 w-4" aria-hidden /> {post.readMinutes} {dict.blog.minRead}
          </p>
          <ArticleBody source={l(post.body, lang)} />
          <Link href={href(lang, "/blog")} className="btn btn-outline mt-6">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {dict.blog.back}
          </Link>
        </div>
      </article>
      <section aria-labelledby="more-title" className="section bg-sky/60">
        <div className="container-site">
          <h2 id="more-title" className="h2 mb-8">
            {dict.blog.related}
          </h2>
          <BlogCards posts={more} lang={lang} dict={dict} />
        </div>
      </section>
    </>
  );
}
