import { cn } from "@/lib/utils";

/**
 * Placeholder wordmark. When the real logo arrives, drop it in /public (e.g. /logo.svg)
 * and replace the contents of this component with a next/image <Image>.
 */
export function Logo({ compact, light, className }: { compact?: boolean; light?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden
        className={cn("shrink-0 transition-all duration-300", compact ? "h-8 w-8" : "h-10 w-10")}
      >
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0a6eff" />
            <stop offset="1" stopColor="#00a3c4" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#logo-g)" />
        <path d="M8 27 C13 19 17 22 21 16 S29 12 32 15 L32 32 L8 32Z" fill="#fff" opacity="0.9" />
        <circle cx="28" cy="11" r="3.5" fill="#ffd27a" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-bold tracking-tight transition-all duration-300",
            compact ? "text-lg" : "text-xl",
            light ? "text-white" : "text-ink"
          )}
        >
          SriLanka <span className={light ? "text-sky-200" : "text-primary"}>Expo</span>
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold tracking-[0.25em] uppercase transition-all duration-300",
            light ? "text-white/80" : "text-accent-700",
            compact && "h-0 overflow-hidden opacity-0"
          )}
        >
          Tours
        </span>
      </span>
    </span>
  );
}
