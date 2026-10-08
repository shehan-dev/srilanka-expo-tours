import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { tours } from "@/lib/data/tours";
import { posts } from "@/lib/data/blog";
import { legalSlugs } from "@/lib/data/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/tours", "/itinerary", "/discover", "/services", "/about", "/blog", "/gallery", "/faq", "/contact"];
  const paths = [
    ...staticPaths.map((p) => ({ path: p, priority: p === "" ? 1 : 0.8 })),
    ...tours.map((t) => ({ path: `/tours/${t.slug}`, priority: 0.9 })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, priority: 0.6, date: p.date })),
    ...legalSlugs.map((s) => ({ path: `/legal/${s}`, priority: 0.2 })),
  ];

  return paths.flatMap(({ path, priority, ...rest }) =>
    locales.map((lang) => ({
      url: `${site.url}/${lang}${path}`,
      lastModified: "date" in rest ? new Date(rest.date as string) : new Date(),
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])),
      },
    }))
  );
}
