import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Scene } from "@/lib/types";
import { breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";
import { Reveal } from "./Reveal";
import { SceneArt } from "./SceneArt";

/** Inner-page hero: clears the fixed header, renders visible breadcrumbs + BreadcrumbList JSON-LD. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
  scene = "hills",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs: { name: string; path: string }[];
  scene?: Scene;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-sky pt-32 pb-14 md:pt-44 md:pb-20">
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-60 [mask-image:linear-gradient(to_left,black,transparent)] md:block">
        <SceneArt scene={scene} />
      </div>
      <div className="container-site">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
                {i < crumbs.length - 1 ? (
                  <Link href={c.path} className="hover:text-primary hover:underline">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-ink">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <p className="eyebrow mb-3">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {eyebrow}
            </p>
          )}
          <h1 className="h1">{title}</h1>
          {subtitle && <p className="mt-4 text-lg text-muted md:text-xl">{subtitle}</p>}
        </Reveal>
      </div>
      <JsonLd data={breadcrumbLd(crumbs)} />
    </header>
  );
}
