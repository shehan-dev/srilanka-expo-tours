import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, size = 16, label, className }: { rating: number; size?: number; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${rating} ${label}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          width={size}
          height={size}
          className={i < Math.round(rating) ? "fill-star text-star" : "fill-line text-line"}
        />
      ))}
    </span>
  );
}
