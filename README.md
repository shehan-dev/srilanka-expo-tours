# Lankavé Tours website

*Feel Sri Lanka. Live the Journey.*

Bilingual (English / Italian) tour-agency site built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Motion** (Framer Motion) and **Leaflet** maps.

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /en or /it
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` (and optionally `BOOKING_WEBHOOK_URL`).

## Pages

| Route | What it is |
| --- | --- |
| `/[lang]` | Long-scroll home: hero, search card + trust strip, popular tours, catalog preview, destinations, why-us (green band), itinerary teaser, services, about, reviews, gallery, FAQ, blog, contact |
| `/[lang]/tours` | Searchable catalog of 4–20 day tours: category tabs, filters (region, length, price), sort, grid/list, map, "show more" paging. Filters live in the URL and are server-rendered |
| `/[lang]/tours/[slug]` | Tour detail with day-by-day itinerary, map, Standard (3★) / Premium (4★ & 5★) price options, `TouristTrip` JSON-LD |
| `/[lang]/itinerary` | "Coming soon" page. The finished 5-step builder is in `components/itinerary/ItineraryBuilder.tsx`, ready to switch on |
| `/[lang]/discover` | Regions & destinations with map/list toggle |
| `/[lang]/services`, `/about`, `/gallery`, `/faq`, `/blog`, `/blog/[slug]`, `/contact` | As named |
| `/[lang]/legal/[slug]` | Terms, privacy, cookies, cancellation, insurance, accessibility |
| `/api/booking` | Receives booking and quote requests |

## Where to edit things

- **Business details** (phone, WhatsApp, address, opening hours, socials, Google review link, hero video, currency rates): `lib/site.ts`
- **UI text** in both languages: `lib/i18n/dictionaries/en.ts` and `it.ts` (TypeScript makes sure Italian has every key English has)
- **Content**: `lib/data/*.ts`: tours, destinations, testimonials, blog, FAQs, gallery, vehicles, attractions, legal text
- **Tour prices**: `prices: { standard, premium }` on each tour in `lib/data/tours.ts` (USD per person, 2 sharing)
- **Itinerary-builder prices** (for when it launches): `lib/pricing.ts` (vehicle rates are in `lib/data/vehicles.ts`, entrance fees in `lib/data/attractions.ts`)
- **Design tokens** (colours, fonts, shadows, motion): the `@theme` block in `app/globals.css`

## Brand (Lankavé Tours)

Brand files used by the site live in `public/brand/`:

| File | Use |
| --- | --- |
| `public/brand/logo-primary-notagline.png` | Header logo, 404 page and share image (`components/layout/Logo.tsx`) |
| `public/brand/icon-192-maskable.png`, `icon-512-maskable.png` | Web app manifest icons |

Original source files (the supplied logo, the trimmed logo with tagline and the brand kit sheet) are kept locally in `brand/`, which is git-ignored and never shipped.
`assets/fonts/` holds the two TTFs the generated share image needs (Lora Italic, Montserrat Medium).

**Temporary fallbacks still in place** (replace when the files arrive):
- **Reversed (white) logo:** missing. The footer uses a text wordmark (`Wordmark` in `components/layout/Logo.tsx`).
- **Monogram:** missing. `app/icon.png`, `app/favicon.ico`, `app/apple-icon.png` and the maskable icons in `public/brand/` are a temporary Playfair "L" on ivory.
- **Lotus pattern:** missing. The footer's top edge is a 1px gold rule.

### Colour tokens (`app/globals.css`)

| Token | Hex | Role |
| --- | --- | --- |
| `primary` (Tea Green) | `#0F4A3C` | headings, primary buttons, links, top bar, footer |
| `primary-600` (green-dark) | `#0A3329` | hover, text on gold |
| `primary-50` (green-tint) | `#E3EDE8` | chips, washes |
| `accent` (Golden Sand) | `#D4A24A` | rules, icons, stars, focus ring on green; never text on light surfaces |
| `accent-300` (gold-light) | `#E6C27A` | small gold text on green |
| `accent-700` (gold-dark) | `#7E5A1D` | gold-coloured text on ivory/white |
| `cinnamon` / `cinnamon-dark` | `#B85C38` / `#9A4A2B` | hero CTA / small tags with white text |
| `ocean` / `ocean-dark` | `#2F7E84` / `#27696E` | coast accents / beach chips with white text |
| `ivory` / `ivory-deep` | `#F7F2E7` / `#EDE5D3` | page background / panels |
| `line` | `#E0D6BF` | borders |
| `ink` / `muted` | `#1C2B26` / `#55635D` | body / secondary text |

The brief's suggested gold-dark `#8A6420` measured 4.27:1 on ivory-deep, so it was darkened to `#7E5A1D`.

### Measured contrast (WCAG AA)

| Pair | Ratio |
| --- | --- |
| Ivory on Tea Green | 9.1:1 |
| Tea Green on ivory / white | 9.1:1 / 10.2:1 |
| Ink on ivory | 13.2:1 |
| Muted on ivory / white / ivory-deep | 5.7 / 6.3 / 5.0:1 |
| White on cinnamon (16px semibold hero CTA only) | 4.5:1 |
| White on cinnamon-dark (tags) | 6.2:1 |
| White on ocean-dark | 6.3:1 |
| Golden Sand on Tea Green (large text, icons) | 4.4:1 |
| Gold-light on Tea Green (small text) | 6.0:1 |
| Gold-dark on ivory / white | 5.2 / 5.8:1 |
| Green-dark on Golden Sand (gold buttons) | 6.0:1 |

### Typography and motion
- **Fonts** (`next/font`, latin + latin-ext for the É): Playfair Display for headings, Montserrat for UI and body, Lora italic for the tagline and quotes, Lora for blog article bodies. `assets/fonts/` holds TTFs used only by the generated share image.
- **Scroll reveals:** `components/ui/Reveal.tsx` is server-rendered. A small inline script hides elements only when JavaScript runs, so all content is visible without JS.
- **Motion:** uses the existing Motion library for presence, layout and gestures. `prefers-reduced-motion` is handled centrally in `globals.css`.

### Photos & video
Tours, destinations, blog posts, the fleet and all page headers use free Unsplash photos stored in `/public/media` (credits in `public/media/CREDITS.md`). To swap one, replace the file or change the `image` field. Anything without an `image` (e.g. gallery items) shows an illustrated scene. Images are served through `next/image` (AVIF/WebP, lazy-loaded, blur-up). For the hero, either set `heroVideo` in `lib/site.ts` or edit the slides in `components/home/HeroVideo.tsx`.

### Booking API → emails
The on-site booking form has been removed (enquiries now go to WhatsApp and phone; tour and booking-bar links prefill the WhatsApp message). The endpoint is kept, unused, in case a form returns, e.g. with the itinerary builder: `POST /api/booking`:

```
app/api/
├── booking/route.ts        # the endpoint: rate limit → validate → email team + guest → optional webhook
└── _lib/                   # private helpers (not routes)
    ├── booking.ts          # validation, booking reference (e.g. LKV-261116-7F3A), webhook payload
    ├── email-templates.ts  # team notification + guest confirmation (English / Italian)
    ├── mailer.ts           # Nodemailer SMTP transport
    └── rate-limit.ts       # 5 requests / 10 min per IP
```

For each request the team gets a notification (reply goes straight to the guest), and the guest gets a confirmation with their reference in the language they were browsing. To enable it, set the `SMTP_*`, `MAIL_FROM` and `BOOKING_NOTIFY_TO` variables from `.env.example`, both in `.env.local` and in Vercel → Settings → Environment Variables. Any SMTP provider works; for Gmail/Google Workspace, create an App Password. Optionally set `BOOKING_WEBHOOK_URL` to also send every request to a CRM or Zapier. Without SMTP or a webhook, requests are only logged to the server console.

## Before launch · placeholders to replace

- [ ] **Testimonials are samples** · replace with real reviews and links (`lib/data/testimonials.ts`)
- [ ] Founder bio, years of experience, milestones · dictionaries `about` section
- [ ] Deposit %, payment methods and cancellation tiers · `lib/data/faqs.ts` and `lib/data/legal.ts`
- [ ] Legal pages are templates · have them reviewed
- [ ] Logo and favicon
- [ ] `NEXT_PUBLIC_SITE_URL` (used for canonical URLs, sitemap, hreflang and JSON-LD)

## SEO & accessibility built in

- `/en/...` and `/it/...` routes with `hreflang` + `x-default`, canonical URLs, Open Graph/Twitter tags, generated OG image
- JSON-LD: `TravelAgency` (every page), `TouristTrip`, `FAQPage`, `Article`, `BreadcrumbList`
- `sitemap.xml` (with language alternates) and `robots.txt`
- `proxy.ts` sends visitors to their browser language and remembers the toggle (`NEXT_LOCALE` cookie)
- Skip link, semantic landmarks and headings, ARIA combobox / tabs / carousel / dialog patterns, focus-trapped modals, keyboard-reorderable itinerary days, `prefers-reduced-motion` respected

## Moving to a headless CMS

Types in `lib/types.ts` mirror CMS documents (Tour, Destination, Testimonial, BlogPost, Faq, GalleryItem, Vehicle). Replace the exports in `lib/data/*.ts` with Sanity/Strapi/Contentful queries that return the same shapes. Pages are statically generated, so add `revalidate` or on-demand revalidation when you connect the CMS.
