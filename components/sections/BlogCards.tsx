import Link from "next/link";
import { Clock } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, intlLocale, l, type Locale } from "@/lib/i18n/config";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";

export function BlogCard({ post, lang, dict, index = 0 }: { post: BlogPost; lang: Locale; dict: Dictionary; index?: number }) {
  const url = href(lang, `/blog/${post.slug}`);
  return (
    <Reveal as="li" delay={index * 0.08} className="card group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Media src={post.image} scene={post.scene} alt="" className="transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-600">
          {dict.blog.categories[post.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="flex items-center gap-2 text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date, intlLocale[lang])}</time>
          <span aria-hidden>·</span>
          <Clock className="h-3.5 w-3.5" aria-hidden /> {post.readMinutes} {dict.blog.minRead}
        </p>
        <h3 className="text-lg font-semibold">
          <Link href={url} className="after:absolute after:inset-0 group-hover:text-primary">
            {l(post.title, lang)}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{l(post.excerpt, lang)}</p>
        <span aria-hidden className="mt-auto pt-2 text-sm font-semibold text-primary-600">
          {dict.blog.readMore} →
        </span>
      </div>
    </Reveal>
  );
}

export function BlogCards({ posts, lang, dict }: { posts: BlogPost[]; lang: Locale; dict: Dictionary }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <BlogCard key={p.slug} post={p} lang={lang} dict={dict} index={i} />
      ))}
    </ul>
  );
}
