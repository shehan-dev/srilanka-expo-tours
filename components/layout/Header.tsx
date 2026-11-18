"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, X, Languages } from "lucide-react";
import { useCurrency, useI18n } from "@/components/providers/AppProviders";
import { WhatsappIcon } from "@/components/ui/SocialIcons";
import { href, locales, type Locale } from "@/lib/i18n/config";
import { site, type Currency } from "@/lib/site";
import { lockScroll } from "@/lib/scroll";
import { cn, easeOutExpo } from "@/lib/utils";
import { Logo } from "./Logo";

const FOCUSABLE = 'a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])';

export function Header() {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
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
    { label: dict.nav.itinerary, path: "/itinerary", desktop: true, soon: true },
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
        className="sr-only z-[200] rounded-full bg-primary px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {dict.nav.skipToContent}
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
          scrolled && "shadow-[0_8px_24px_-16px_rgb(15_74_60/0.45)]"
        )}
      >
        {/* Top bar (Tea Green): scrolls away after the first 80px */}
        <div
          className={cn(
            "on-green hidden overflow-hidden bg-primary text-ivory transition-[max-height,opacity] duration-300 md:block",
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          )}
        >
          <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-4 px-6 text-[13px]">
            <p className="flex items-center gap-2 font-medium">
              <span aria-hidden>🇮🇹</span> {dict.hero.badge}
            </p>
            <div className="flex items-center gap-3">
              <a href={site.phoneHref} className="flex items-center gap-1.5 font-medium hover:underline">
                <Phone className="h-3.5 w-3.5 text-accent" aria-hidden />
                <span className="sr-only">{dict.nav.callUs}: </span>
                {site.phone}
              </a>
              <span aria-hidden className="h-4 w-px bg-accent/50" />
              <LanguageToggle tone="green" />
              <CurrencySelect tone="green" />
            </div>
          </div>
        </div>

        {/* Main bar (Ivory): stays fixed and shrinks slightly */}
        <div className="border-b border-ivory-deep bg-ivory">
          <div
            className={cn(
              "mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6",
              scrolled ? "h-[60px]" : "h-16 md:h-[72px]"
            )}
          >
            <Link href={href(lang)} className="shrink-0" aria-label={`${site.name}: ${dict.nav.home}`}>
              <Logo compact={scrolled} priority />
            </Link>

            <nav aria-label="Main" className="hidden xl:block">
              <ul className="flex items-center">
                {links
                  .filter((link) => link.desktop)
                  .map((link) => (
                    <li key={link.path}>
                      <Link
                        href={href(lang, link.path)}
                        aria-current={isActive(link.path) ? "page" : undefined}
                        className={cn(
                          "nav-link block px-2.5 py-2 text-[13.5px] font-medium text-ink transition-colors hover:text-primary",
                          isActive(link.path) && "text-primary"
                        )}
                      >
                        {link.label}
                        {link.soon && (
                          <span className="absolute -top-1.5 right-0 rounded-full bg-accent-50 px-1.5 text-[9px] leading-4 font-bold tracking-wide text-accent-700 uppercase">
                            {dict.nav.soon}
                          </span>
                        )}
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
                className="grid h-11 w-11 place-items-center rounded-full text-primary transition-colors hover:bg-ivory-deep xl:hidden"
              >
                <Menu className="h-6 w-6" aria-hidden />
                <span className="sr-only">{dict.nav.menu}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} isActive={isActive} />
    </>
  );
}

/** Full-height slide-in panel: scroll lock, focus trap, Esc to close, closes on route change. */
function MobileMenu({
  open,
  onClose,
  links,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  links: { label: string; path: string; soon?: boolean }[];
  isActive: (path: string) => boolean;
}) {
  const { lang, dict } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const unlock = lockScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const raf = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus());

    return () => {
      cancelAnimationFrame(raf);
      unlock();
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <motion.div
            className="absolute inset-0 bg-primary-600/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.menu}
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: easeOutExpo }}
          >
            <div className="flex items-center justify-between border-b border-ivory-deep px-5 py-3">
              <Logo compact />
              <button
                type="button"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center rounded-full text-primary hover:bg-ivory-deep"
                aria-label={dict.nav.closeMenu}
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col">
                {links.map((link, i) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + Math.min(i, 6) * 0.06, duration: 0.28, ease: easeOutExpo }}
                    className="border-b border-ivory-deep/70"
                  >
                    <Link
                      href={href(lang, link.path)}
                      onClick={onClose}
                      aria-current={isActive(link.path) ? "page" : undefined}
                      className={cn(
                        "flex min-h-12 items-center gap-2 py-2.5 font-heading text-[22px] font-medium text-primary",
                        isActive(link.path) && "underline decoration-accent decoration-2 underline-offset-8"
                      )}
                    >
                      {link.label}
                      {link.soon && (
                        <span className="rounded-full bg-accent-50 px-2 py-0.5 font-sans text-[10px] font-bold tracking-wide text-accent-700 uppercase">
                          {dict.nav.soon}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <LanguageToggle tone="light" />
                <CurrencySelect tone="light" />
              </div>
            </nav>

            <div className="grid grid-cols-2 gap-2 border-t border-ivory-deep p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a href={site.phoneHref} className="btn btn-outline btn-sm">
                <Phone className="h-4 w-4" aria-hidden /> {dict.contact.call}
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(dict.contact.prefill)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <WhatsappIcon width={18} height={18} /> WhatsApp
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

function LanguageToggle({ tone }: { tone: "green" | "light" }) {
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
      className={cn("flex items-center rounded-full p-0.5", tone === "green" ? "bg-ivory/10" : "border border-line bg-white")}
    >
      <Languages className={cn("mx-1.5 h-3.5 w-3.5", tone === "green" ? "text-accent" : "text-muted")} aria-hidden />
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
            "rounded-full text-xs font-bold uppercase transition-colors",
            tone === "green" ? "px-2.5 py-0.5" : "px-3.5 py-2",
            loc === lang
              ? tone === "green"
                ? "bg-ivory text-primary"
                : "bg-primary text-ivory"
              : tone === "green"
                ? "text-ivory hover:bg-ivory/15"
                : "text-ink hover:bg-ivory"
          )}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}

function CurrencySelect({ tone }: { tone: "green" | "light" }) {
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
          "cursor-pointer appearance-none rounded-full text-xs font-bold",
          tone === "green"
            ? "bg-ivory/10 px-3 py-1 text-ivory [&>option]:text-ink"
            : "border border-line bg-white px-4 py-2.5 text-ink"
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
