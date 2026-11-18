"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { WhatsappIcon } from "@/components/ui/SocialIcons";
import { href } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { scrollToTop } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * Floating controls:
 * - desktop: WhatsApp button (WhatsApp's own green, one gentle pulse after load) + back-to-top;
 * - mobile: a sticky "WhatsApp / Book Now" bar that replaces the floating WhatsApp button. It appears
 *   once the page hero has scrolled away and hides while the contact form or the footer is on screen.
 */
export function FloatingContact() {
  const { lang, dict } = useI18n();
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [farDown, setFarDown] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(dict.contact.prefill)}`;

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.8);
      setFarDown(window.scrollY > window.innerHeight * 1.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide the mobile bar while the contact form or footer is visible, so it never covers them.
  useEffect(() => {
    const targets = document.querySelectorAll("[data-hide-actionbar], #site-footer");
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setBlocked(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  const barVisible = pastHero && !blocked;

  return (
    <>
      {/* Desktop: floating WhatsApp button */}
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.contact.whatsapp}
        className="pulse-once fixed right-6 bottom-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-150 hover:scale-105 md:grid"
      >
        <WhatsappIcon width={28} height={28} />
      </a>

      {/* Back to top: clear of the WhatsApp button (desktop) and the action bar (mobile) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={dict.common.backToTop}
        tabIndex={farDown ? 0 : -1}
        className={cn(
          "fixed right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-primary text-accent shadow-lg transition-[opacity,transform] duration-300 hover:bg-primary-600 md:right-[30px] md:bottom-24",
          barVisible ? "bottom-[calc(5rem+env(safe-area-inset-bottom))]" : "bottom-4",
          farDown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        <ArrowUp className="h-5 w-5" aria-hidden />
      </button>

      {/* Mobile: sticky action bar */}
      <div
        aria-hidden={!barVisible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-ivory-deep bg-ivory/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden",
          barVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="grid grid-cols-2 gap-2">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={barVisible ? 0 : -1}
            className="btn bg-[#25D366] text-ink"
          >
            <WhatsappIcon width={20} height={20} /> WhatsApp
          </a>
          <Link href={href(lang, "/contact")} tabIndex={barVisible ? 0 : -1} className="btn btn-primary">
            {dict.nav.bookNow}
          </Link>
        </div>
      </div>
    </>
  );
}
