import { cn } from "@/lib/utils";

/**
 * Animated brand mark (the favicon "L" on ivory with its gold rule). The L rises in, the gold rule
 * draws outward, then both fade and the cycle repeats. With reduced motion it shows a gentle fade only.
 */
export function LogoLoader({ label, size = 88, className }: { label: string; size?: number; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("inline-flex flex-col items-center gap-4", className)}>
      <span
        aria-hidden
        className="loader-mark relative grid place-items-center rounded-[22%] bg-ivory shadow-card ring-1 ring-line"
        style={{ width: size, height: size }}
      >
        <span className="loader-l font-heading leading-none font-semibold text-primary" style={{ fontSize: size * 0.62 }}>
          L
        </span>
        <span
          className="loader-rule absolute rounded-full bg-accent"
          style={{ width: size * 0.42, height: Math.max(2, size * 0.035), bottom: size * 0.16 }}
        />
      </span>
      <span className="text-xs font-semibold tracking-[0.25em] text-accent-700 uppercase">{label}</span>
    </div>
  );
}
