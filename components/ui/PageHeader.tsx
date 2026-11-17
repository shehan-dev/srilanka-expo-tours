import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Scene } from "@/lib/types";
import { breadcrumbLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { JsonLd } from "./JsonLd";
import { Reveal } from "./Reveal";
import { SceneArt } from "./SceneArt";

/**
 * Inner-page hero: clears the fixed header, renders visible breadcrumbs + BreadcrumbList JSON-LD.
 * With `image` it becomes a full-bleed photo hero; otherwise a light illustrated header.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
  scene = "hills",
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs: { name: string; path: string }[];
  scene?: Scene;
  image?: string;
}) {
  const photo = !!image;
  return (
    <header
      className={cn(
        "relative isolate overflow-hidden pt-32 pb-14 md:pt-44 md:pb-20",
        photo ? "on-green flex min-h-[420px] items-end bg-primary-600 md:min-h-[520px]" : "bg-ivory-deep"
      )}
    >
      {photo ? (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(15_74_60/0.9),rgb(15_74_60/0.45)_50%,rgb(15_74_60/0.25))]" />
        </>
      ) : (
        <div aria-hidden className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-60 [mask-image:linear-gradient(to_left,black,transparent)] md:block">
          <SceneArt scene={scene} />
        </div>
      )}
      <div className="container-site">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className={cn("flex flex-wrap items-center gap-1 text-sm", photo ? "text-ivory/80" : "text-muted")}>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
                {i < crumbs.length - 1 ? (
                  <Link href={c.path} className={cn("hover:underline", photo ? "hover:text-ivory" : "hover:text-primary")}>
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className={cn("font-medium", photo ? "text-ivory" : "text-ink")}>
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
                            {eyebrow}
            </p>
          )}
          <h1 className={cn("h1", photo && "text-ivory")}>{title}</h1>
          {subtitle && <p className={cn("mt-4 text-lg md:text-xl", photo ? "text-ivory/90" : "text-muted")}>{subtitle}</p>}
        </Reveal>
      </div>
      <JsonLd data={breadcrumbLd(crumbs)} />
    </header>
  );
}
