import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, locales, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { Wordmark } from "./Logo";

const languageNames: Record<Locale, string> = { en: "English", it: "Italiano" };

const linkClass =
  "text-ivory/85 underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-ivory hover:decoration-accent";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const explore = [
    { label: dict.nav.tours, path: "/tours" },
    { label: dict.nav.itinerary, path: "/itinerary" },
    { label: dict.nav.discover, path: "/discover" },
    { label: dict.nav.gallery, path: "/gallery" },
    { label: dict.nav.blog, path: "/blog" },
  ];
  const company = [
    { label: dict.nav.about, path: "/about" },
    { label: dict.nav.services, path: "/services" },
    { label: dict.nav.faq, path: "/faq" },
    { label: dict.nav.contact, path: "/contact" },
  ];
  const legal = [
    { label: dict.legal.terms, path: "/legal/terms" },
    { label: dict.legal.privacy, path: "/legal/privacy" },
    { label: dict.legal.cookies, path: "/legal/cookies" },
    { label: dict.legal.cancellation, path: "/legal/cancellation" },
    { label: dict.legal.insurance, path: "/legal/insurance" },
    { label: dict.legal.accessibility, path: "/legal/accessibility" },
  ];
  const socials = [
    { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  ];

  return (
    // 1px gold rule along the top edge (the lotus pattern band replaces it once that asset is supplied)
    <footer id="site-footer" className="on-green border-t border-accent bg-primary text-ivory">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-5">
          <Link href={href(lang)} className="inline-block">
            <Wordmark />
          </Link>
          <p className="tagline text-lg text-ivory">{site.tagline}</p>
          <p className="max-w-xs text-sm text-ivory/85">{dict.footer.tagline}</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href={site.phoneHref} className={`inline-flex items-center gap-2 ${linkClass}`}>
                <Phone className="h-4 w-4 text-accent" aria-hidden /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
                <Mail className="h-4 w-4 text-accent" aria-hidden /> {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-ivory/85">
              <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {site.address.street}, {site.address.city}, {site.address.region}
            </li>
          </ul>
          <ul className="flex gap-2" aria-label="Social media">
            {socials.map(({ label, href: url, Icon }) => (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-accent/60 text-accent transition-colors hover:bg-accent hover:text-primary-600"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {[
          { title: dict.footer.explore, items: explore },
          { title: dict.footer.company, items: company },
          { title: dict.footer.legal, items: legal },
        ].map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-accent-300 uppercase">{col.title}</h2>
            <ul className="flex flex-col gap-1 text-sm">
              {col.items.map((item) => (
                <li key={item.path}>
                  <Link href={href(lang, item.path)} className={`inline-block py-1.5 ${linkClass}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-ivory/15">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-ivory/80 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
            {dict.footer.license}: {site.licenseNumber}
          </p>
          <p className="max-w-md">
            <Link href={href(lang, "/legal/accessibility")} className={linkClass}>
              {dict.footer.accessibility}
            </Link>
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ul className="flex gap-3" aria-label={dict.nav.language}>
              {locales.map((loc) => (
                <li key={loc}>
                  <Link
                    href={`/${loc}`}
                    hrefLang={loc}
                    lang={loc}
                    aria-current={loc === lang ? "true" : undefined}
                    className={loc === lang ? "font-semibold text-ivory" : linkClass}
                  >
                    {languageNames[loc]}
                  </Link>
                </li>
              ))}
            </ul>
            <p>
              © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
