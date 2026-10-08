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
| `/[lang]/tours` | Searchable catalog — category tabs, filters (region, length, price, difficulty, language), sort, grid/list, map, "show more" paging. Filters live in the URL and are server-rendered |
| `/[lang]/tours/[slug]` | Tour detail with day-by-day itinerary, map, booking sidebar, `TouristTrip` JSON-LD |
| `/[lang]/itinerary` | 5-step itinerary builder: duration → attractions (drag-and-drop day plan) → vehicle/meals/guide → summary → quote request, with a live price estimate |
| `/[lang]/discover` | Regions & destinations with map/list toggle |
| `/[lang]/services`, `/about`, `/gallery`, `/faq`, `/blog`, `/blog/[slug]`, `/contact` | As named |
| `/[lang]/legal/[slug]` | Terms, privacy, cookies, cancellation, insurance, accessibility |
| `/[lang]/portal` | Agent portal placeholder |
| `/api/booking` | Receives bookings, itinerary quotes and newsletter sign-ups |

## Where to edit things

- **Business details** (phone, WhatsApp, email, address, licence no., socials, hero video, currency rates): `lib/site.ts`
- **UI text** in both languages: `lib/i18n/dictionaries/en.ts` and `it.ts` (TypeScript makes sure Italian has every key English has)
- **Content**: `lib/data/*.ts` — tours, destinations, testimonials, blog, FAQs, gallery, vehicles, attractions, legal text
- **Itinerary-builder prices**: `lib/pricing.ts` (vehicle rates are in `lib/data/vehicles.ts`, entrance fees in `lib/data/attractions.ts`)
- **Design tokens** (colours, fonts, shadows, motion): the `@theme` block in `app/globals.css`

### Logo
`components/layout/Logo.tsx` is a placeholder wordmark. Put the real logo in `/public` (e.g. `/public/logo.svg`) and replace the component body with a `next/image`. Also replace `app/icon.svg` (favicon).

### Photos & video
Until real media is added, every image shows an illustrated scene. To use photos, put them in `/public/media/...` and set the `image` field on a tour, destination, blog post or gallery item (e.g. `image: "/media/tours/sigiriya.jpg"`). They're served through `next/image` (AVIF/WebP, lazy-loaded, blur-up). For the hero, either set `heroVideo` in `lib/site.ts` or add `image` to the slides in `components/home/HeroVideo.tsx`.

### Bookings → email / CRM
`app/api/booking/route.ts` validates each submission, generates a reference (e.g. `SLE-261001-A1B2`) and, if `BOOKING_WEBHOOK_URL` is set, POSTs the JSON to it. Point that at Zapier / Make / n8n / an Airtable or HubSpot workflow to send confirmation emails/SMS and create the CRM record. Without it, submissions are only logged to the server console.

## Before launch — placeholders to replace

- [ ] Phone, WhatsApp, Telegram, email, address, SLTDA licence number, social links — `lib/site.ts`
- [ ] **Testimonials are samples** — replace with real reviews and links (`lib/data/testimonials.ts`)
- [ ] Founder bio, years of experience, milestones (12+ years, 2,300+ travellers, 450+ tours) — dictionaries `about` section
- [ ] Deposit %, payment methods and cancellation tiers — `lib/data/faqs.ts` and `lib/data/legal.ts`
- [ ] Legal pages are templates — have them reviewed
- [ ] Tour prices and itinerary-builder rates
- [ ] Logo, favicon, photos, hero video
- [ ] `NEXT_PUBLIC_SITE_URL` (used for canonical URLs, sitemap, hreflang and JSON-LD)

## SEO & accessibility built in

- `/en/...` and `/it/...` routes with `hreflang` + `x-default`, canonical URLs, Open Graph/Twitter tags, generated OG image
- JSON-LD: `TravelAgency` (every page), `TouristTrip`, `FAQPage`, `Article`, `BreadcrumbList`
- `sitemap.xml` (with language alternates) and `robots.txt`
- `proxy.ts` sends visitors to their browser language and remembers the toggle (`NEXT_LOCALE` cookie)
- Skip link, semantic landmarks and headings, ARIA combobox / tabs / carousel / dialog patterns, focus-trapped modals, keyboard-reorderable itinerary days, `prefers-reduced-motion` respected

## Moving to a headless CMS

Types in `lib/types.ts` mirror CMS documents (Tour, Destination, Testimonial, BlogPost, Faq, GalleryItem, Vehicle). Replace the exports in `lib/data/*.ts` with Sanity/Strapi/Contentful queries that return the same shapes. Pages are statically generated, so add `revalidate` or on-demand revalidation when you connect the CMS.
