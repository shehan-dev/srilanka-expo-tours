# SriLanka Expo Tours — website

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
| `/[lang]` | Long-scroll home: hero, sticky booking bar, why-us, popular carousel, catalog preview, itinerary teaser, destinations, services, about, reviews, gallery, FAQ, blog, pricing, contact |
| `/[lang]/tours` | Searchable catalog of 4–20 day tours — category tabs, filters (region, length, price), sort, grid/list, map, "show more" paging. Filters live in the URL and are server-rendered |
| `/[lang]/tours/[slug]` | Tour detail with day-by-day itinerary, map, Standard (3★) / Premium (4★ & 5★) price options, `TouristTrip` JSON-LD |
| `/[lang]/itinerary` | "Coming soon" page. The finished 5-step builder is in `components/itinerary/ItineraryBuilder.tsx`, ready to switch on |
| `/[lang]/discover` | Regions & destinations with map/list toggle |
| `/[lang]/services`, `/about`, `/gallery`, `/faq`, `/blog`, `/blog/[slug]`, `/contact` | As named |
| `/[lang]/legal/[slug]` | Terms, privacy, cookies, cancellation, insurance, accessibility |
| `/api/booking` | Receives booking and quote requests |

## Where to edit things

- **Business details** (phone, WhatsApp, email, address, licence no., socials, hero video, currency rates): `lib/site.ts`
- **UI text** in both languages: `lib/i18n/dictionaries/en.ts` and `it.ts` (TypeScript makes sure Italian has every key English has)
- **Content**: `lib/data/*.ts` — tours, destinations, testimonials, blog, FAQs, gallery, vehicles, attractions, legal text
- **Tour prices**: `prices: { standard, premium }` on each tour in `lib/data/tours.ts` (USD per person, 2 sharing)
- **Itinerary-builder prices** (for when it launches): `lib/pricing.ts` (vehicle rates are in `lib/data/vehicles.ts`, entrance fees in `lib/data/attractions.ts`)
- **Design tokens** (colours, fonts, shadows, motion): the `@theme` block in `app/globals.css`

### Logo
`components/layout/Logo.tsx` is a placeholder wordmark. Put the real logo in `/public` (e.g. `/public/logo.svg`) and replace the component body with a `next/image`. Also replace `app/icon.svg` (favicon).

### Photos & video
Tours, destinations, blog posts, the fleet and all page headers use free Unsplash photos stored in `/public/media` (credits in `public/media/CREDITS.md`). To swap one, replace the file or change the `image` field. Anything without an `image` (e.g. gallery items) shows an illustrated scene. Images are served through `next/image` (AVIF/WebP, lazy-loaded, blur-up). For the hero, either set `heroVideo` in `lib/site.ts` or edit the slides in `components/home/HeroVideo.tsx`.

### Bookings → email / CRM
`app/api/booking/route.ts` validates each submission, generates a reference (e.g. `SLE-261001-A1B2`) and, if `BOOKING_WEBHOOK_URL` is set, POSTs the JSON to it. Point that at Zapier / Make / n8n / an Airtable or HubSpot workflow to send confirmation emails/SMS and create the CRM record. Without it, submissions are only logged to the server console.

## Before launch — placeholders to replace

- [ ] Telegram username, email, SLTDA licence number, Facebook/Instagram/Google links — `lib/site.ts`
- [ ] **Testimonials are samples** — replace with real reviews and links (`lib/data/testimonials.ts`)
- [ ] Founder bio, years of experience, milestones (12+ years, 2,300+ travellers, 450+ tours) — dictionaries `about` section
- [ ] Deposit %, payment methods and cancellation tiers — `lib/data/faqs.ts` and `lib/data/legal.ts`
- [ ] Legal pages are templates — have them reviewed
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
