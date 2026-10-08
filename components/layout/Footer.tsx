import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { href, locales, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import { FacebookIcon, InstagramIcon, TripadvisorIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const languageNames: Record<Locale, string> = { en: "English", it: "Italiano" };

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
    { label: dict.nav.login, path: "/portal" },
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
    { label: "Tripadvisor", href: site.social.tripadvisor, Icon: TripadvisorIcon },
    { label: "YouTube", href: site.social.youtube, Icon: YoutubeIcon },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="container-site relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.5fr]">
        <div className="flex flex-col gap-5">
          <Logo light />
          <p className="max-w-xs text-sm text-white/75">{dict.footer.tagline}</p>
          <ul className="flex flex-col gap-2 text-sm text-white/85">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4 text-accent" aria-hidden /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-accent" aria-hidden /> {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" aria-hidden /> {site.address.street}, {site.address.city}
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
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
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
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{col.title}</h2>
            <ul className="flex flex-col gap-2.5 text-sm text-white/75">
              {col.items.map((item) => (
                <li key={item.path}>
                  <Link href={href(lang, item.path)} className="hover:text-white hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wider text-white uppercase">{dict.footer.newsletter}</h2>
          <p className="text-sm text-white/75">{dict.footer.newsletterText}</p>
          <NewsletterForm />
          <div>
            <p className="mb-2 text-xs text-white/60">{dict.footer.payments}</p>
            <ul className="flex flex-wrap gap-2">
              {["VISA", "Mastercard", "AMEX", "SEPA", "Stripe"].map((p) => (
                <li key={p} className="rounded-md bg-white px-2 py-1 text-[11px] font-bold tracking-wide text-ink">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-white/65 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
            {dict.footer.license}: {site.licenseNumber}
          </p>
          <p className="max-w-md">
            <Link href={href(lang, "/legal/accessibility")} className="hover:text-white hover:underline">
              {dict.footer.accessibility}
            </Link>
          </p>
          <div className="flex items-center gap-4">
            <ul className="flex gap-3" aria-label={dict.nav.language}>
              {locales.map((loc) => (
                <li key={loc}>
                  <Link
                    href={`/${loc}`}
                    hrefLang={loc}
                    lang={loc}
                    aria-current={loc === lang ? "true" : undefined}
                    className={loc === lang ? "font-semibold text-white" : "hover:text-white"}
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
