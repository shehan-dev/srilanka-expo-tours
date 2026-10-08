"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { intlLocale, type Locale } from "@/lib/i18n/config";
import { site, type Currency } from "@/lib/site";

interface I18nValue {
  lang: Locale;
  dict: Dictionary;
}

interface CurrencyValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Format a USD amount in the visitor's chosen currency. */
  format: (usd: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);
const CurrencyContext = createContext<CurrencyValue | null>(null);

const CURRENCY_KEY = "sle-currency";

export function AppProviders({ lang, dict, children }: I18nValue & { children: ReactNode }) {
  // Italian visitors see euros by default; the choice is remembered per browser.
  const [currency, setCurrencyState] = useState<Currency>(lang === "it" ? "EUR" : "USD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY);
      if (saved && saved in site.currencyRates) setCurrencyState(saved as Currency);
    } catch {}
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_KEY, c);
    } catch {}
  }, []);

  const format = useCallback(
    (usd: number) =>
      new Intl.NumberFormat(intlLocale[lang], {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(Math.round(usd * site.currencyRates[currency])),
    [currency, lang]
  );

  const i18n = useMemo(() => ({ lang, dict }), [lang, dict]);
  const money = useMemo(() => ({ currency, setCurrency, format }), [currency, setCurrency, format]);

  return (
    <I18nContext.Provider value={i18n}>
      <CurrencyContext.Provider value={money}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </CurrencyContext.Provider>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <AppProviders>");
  return ctx;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <AppProviders>");
  return ctx;
}
