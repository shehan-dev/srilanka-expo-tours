import { locales, type Locale, type L10n, type L10nList } from "@/lib/types";

export { locales, type Locale };
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Pick the current locale's value from a translated field. */
export function l(value: L10n, lang: Locale): string;
export function l(value: L10nList, lang: Locale): string[];
export function l(value: L10n | L10nList, lang: Locale) {
  return value[lang] ?? value[defaultLocale];
}

/** Build a locale-prefixed path: href("it", "/tours") -> "/it/tours". */
export const href = (lang: Locale, path = "/") =>
  `/${lang}${path === "/" ? "" : path.startsWith("/") ? path : `/${path}`}`;

export const intlLocale: Record<Locale, string> = { en: "en-GB", it: "it-IT" };
