"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X, UserRound, Languages, MessageCircle } from "lucide-react";
import { useCurrency, useI18n } from "@/components/providers/AppProviders";
import { href, locales, type Locale } from "@/lib/i18n/config";
import { site, type Currency } from "@/lib/site";
import { cn, easeOutExpo } from "@/lib/utils";
import { Logo } from "./Logo";

export function Header() {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === `/${lang}`;
  const overHero = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { label: dict.nav.home, path: "/", desktop: false },
    { label: dict.nav.search, path: "/#search", desktop: true },
    { label: dict.nav.popular, path: "/#popular", desktop: true },
    { label: dict.nav.tours, path: "/tours", desktop: true },
    { label: dict.nav.itinerary, path: "/itinerary", desktop: true },
    { label: dict.nav.discover, path: "/discover", desktop: true },
    { label: dict.nav.services, path: "/services", desktop: true },
    { label: dict.nav.about, path: "/about", desktop: true },
    { label: dict.nav.blog, path: "/blog", desktop: true },
    { label: dict.nav.contact, path: "/contact", desktop: true },
  ];

  const isActive = (path: string) =>
    !path.includes("#") && (path === "/" ? pathname === `/${lang}` : pathname.startsWith(href(lang, path)));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[200] rounded-full bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {dict.nav.skipToContent}
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
          overHero ? "bg-transparent" : "bg-white/90 shadow-[0_6px_24px_-12px_rgb(15_23_36/0.25)] backdrop-blur-lg"
        )}
      >
        {/* Utility bar — collapses after scroll */}
        <div
          className={cn(
            "hidden overflow-hidden border-b transition-all duration-300 md:block",
            scrolled ? "max-h-0 border-transparent opacity-0" : "max-h-12 opacity-100",
            overHero ? "border-white/15 text-white" : "border-line text-ink"
          )}
        >
          <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-4 px-6 text-[13px]">
            <p className="flex items-center gap-2 font-medium">
              <span aria-hidden>🇮🇹</span> {dict.hero.badge}
            </p>
            <div className="flex items-center gap-1">
              <a href={site.phoneHref} className="flex items-center gap-1.5 rounded-full px-3 py-1 font-medium hover:bg-black/5">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">{dict.nav.callUs}: </span>
                {site.phone}
              </a>
              <LanguageToggle tone={overHero ? "light" : "dark"} />
              <CurrencySelect tone={overHero ? "light" : "dark"} />
              <Link
                href={href(lang, "/portal")}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 font-medium hover:bg-black/5"
              >
                <UserRound className="h-3.5 w-3.5" aria-hidden />
                {dict.nav.login}
              </Link>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={cn(
            "mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6",
            scrolled ? "h-16" : "h-[72px] md:h-20"
          )}
        >
          <Link href={href(lang)} aria-label={`${site.name} — ${dict.nav.home}`} className="shrink-0">
            <Logo compact={scrolled} light={overHero} />
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {links
                .filter((link) => link.desktop)
                .map((link) => (
                  <li key={link.path}>
                    <Link
                      href={href(lang, link.path)}
                      aria-current={isActive(link.path) ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                        overHero ? "text-white hover:bg-white/15" : "text-ink hover:bg-sky",
                        isActive(link.path) && (overHero ? "bg-white/20" : "bg-sky text-primary-600")
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href={href(lang, "/contact")} className="btn btn-primary btn-sm hidden sm:inline-flex">
              {dict.nav.bookNow}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full transition xl:hidden",
                overHero ? "text-white hover:bg-white/15" : "text-ink hover:bg-sky"
              )}
            >
              <Menu className="h-6 w-6" aria-hidden />
              <span className="sr-only">{dict.nav.menu}</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} isActive={isActive} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  links,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  links: { label: string; path: string }[];
  isActive: (path: string) => boolean;
}) {
  const { lang, dict } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("button, a")?.focus());
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.menu}
            className="absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo compact />
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-sky"
                aria-label={dict.nav.closeMenu}
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            {/* Language & contact always visible */}
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
              <LanguageToggle tone="dark" />
              <CurrencySelect tone="dark" />
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="flex flex-col">
                {links.map((link, i) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.035, duration: 0.3 }}
                  >
                    <Link
                      href={href(lang, link.path)}
                      onClick={onClose}
                      aria-current={isActive(link.path) ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-[17px] font-medium hover:bg-sky",
                        isActive(link.path) && "bg-sky text-primary-600"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <li>
                  <Link href={href(lang, "/portal")} onClick={onClose} className="block rounded-xl px-4 py-3 text-[17px] font-medium hover:bg-sky">
                    {dict.nav.login}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <a href={site.phoneHref} className="btn btn-outline btn-sm">
                <Phone className="h-4 w-4" aria-hidden /> {dict.contact.call}
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(dict.contact.prefill)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-sm"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
              <Link href={href(lang, "/contact")} onClick={onClose} className="btn btn-primary col-span-2">
                {dict.nav.bookNow}
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function LanguageToggle({ tone }: { tone: "light" | "dark" }) {
  const { lang, dict } = useI18n();
  const pathname = usePathname();

  const switchTo = (target: Locale) => {
    const rest = pathname.replace(/^\/(en|it)(?=\/|$)/, "");
    return `/${target}${rest}`;
  };

  return (
    <div
      role="group"
      aria-label={dict.nav.language}
      className={cn(
        "flex items-center rounded-full p-0.5",
        tone === "light" ? "bg-white/15" : "bg-sky"
      )}
    >
      <Languages className={cn("mx-1.5 h-3.5 w-3.5", tone === "light" ? "text-white" : "text-muted")} aria-hidden />
      {locales.map((loc) => (
        <Link
          key={loc}
          href={switchTo(loc)}
          hrefLang={loc}
          lang={loc}
          aria-current={loc === lang ? "true" : undefined}
          onClick={() => {
            document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; samesite=lax`;
          }}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase transition",
            loc === lang
              ? "bg-white text-primary-600 shadow-sm"
              : tone === "light"
                ? "text-white hover:bg-white/20"
                : "text-ink hover:bg-white"
          )}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}

function CurrencySelect({ tone }: { tone: "light" | "dark" }) {
  const { dict } = useI18n();
  const { currency, setCurrency } = useCurrency();
  return (
    <label className="relative">
      <span className="sr-only">{dict.nav.currency}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        suppressHydrationWarning
        className={cn(
          "cursor-pointer appearance-none rounded-full px-3 py-1 text-xs font-bold",
          tone === "light" ? "bg-white/15 text-white [&>option]:text-ink" : "bg-sky text-ink"
        )}
      >
        {Object.keys(site.currencyRates).map((c) => (
          <option key={c} value={c}>
            {c === "EUR" ? "€ EUR" : "$ USD"}
          </option>
        ))}
      </select>
    </label>
  );
}
