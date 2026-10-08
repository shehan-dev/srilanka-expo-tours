import Image from "next/image";
import type { Scene } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SceneArt } from "./SceneArt";

// Tiny light-blue blur placeholder for the blur-up effect on remote/string image paths.
const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4IDYnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzYnIGZpbGw9JyNjZGVhZmYnLz48L3N2Zz4=";

/**
 * Responsive image that falls back to an illustrated scene when no photo is set.
 * The parent must be `relative` with a defined size/aspect ratio.
 */
export function Media({
  src,
  scene,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className,
}: {
  src?: string;
  scene: Scene;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div role="img" aria-label={alt} className={cn("absolute inset-0", className)}>
      <SceneArt scene={scene} />
    </div>
  );
}
