/** Join class names, skipping falsy values. */
export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

/** Brand easing curves (mirrors --ease-brand / --ease-move in globals.css). */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

/** Motion tokens (durations in seconds for Motion). */
export const motionTokens = {
  fast: { duration: 0.15, ease: "easeOut" },
  base: { duration: 0.28, ease: easeOutExpo },
  slow: { duration: 0.6, ease: easeOutExpo },
} as const;

export const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
