/** Join class names, skipping falsy values. */
export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

/** Motion tokens from the design system (durations in seconds for Motion). */
export const motionTokens = {
  fast: { duration: 0.18, ease: "easeOut" },
  medium: { duration: 0.35, ease: [0.2, 0.9, 0.2, 1] },
  slow: { duration: 0.6, ease: "easeOut" },
} as const;

export const easeOutExpo = [0.2, 0.9, 0.2, 1] as const;

export const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
