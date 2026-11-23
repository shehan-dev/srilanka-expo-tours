import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { HeroVideo } from "@/components/home/HeroVideo";
import { BookingBar } from "@/components/home/BookingBar";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { CarouselPopularTours } from "@/components/home/CarouselPopularTours";
import { ToursTeaser } from "@/components/home/ToursTeaser";
import { ItineraryTeaser } from "@/components/home/ItineraryTeaser";
import { DestinationExplorer } from "@/components/discover/DestinationExplorer";
import { ServicesGrid } from "@/components/sections/Services";
import { MissionCards, Milestones, TeamMembers, TeamProfile } from "@/components/sections/TeamProfile";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { GalleryMasonry } from "@/components/sections/GalleryMasonry";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BlogCards } from "@/components/sections/BlogCards";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { posts } from "@/lib/data/blog";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";

/**
 * Home page. Sections alternate ivory (page background) and white; "Why travel with us" is the one
 * full Tea Green band. Content is unchanged from the previous layout, only order and styling differ.
 */
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const viewAll = (label: string, path: string) => (
    <Link href={href(lang, path)} className="inline-flex min-h-11 shrink-0 items-center gap-1 font-semibold text-primary hover:underline">
      {label} <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );

  return (
    <>
      {/* Hero */}
      <HeroVideo />

      {/* Search card overlapping the hero + trust strip (ivory) */}
      <div className="pb-14 md:pb-20">
        <BookingBar />
      </div>

      {/* Popular tours: large feature cards (white) */}
      <CarouselPopularTours />

      {/* All tours: compact filterable list (ivory) */}
      <ToursTeaser />

      {/* Discover Sri Lanka: editorial destination grid (white) */}
      <section id="discover" aria-labelledby="discover-title" className="section bg-white">
        <div className="container-site">
          <SectionHeading
            id="discover-title"
            eyebrow={dict.discover.eyebrow}
            title={dict.discover.title}
            subtitle={dict.discover.subtitle}
          />
          <DestinationExplorer limit={5} showViewAll />
        </div>
      </section>

      {/* Why travel with us: Tea Green band */}
      <FeatureStrip dict={dict} />

      {/* Custom itinerary (white) */}
      <ItineraryTeaser lang={lang} dict={dict} />

      {/* Services (ivory) */}
      <section id="services" aria-labelledby="services-title" className="section">
        <div className="container-site">
          <SectionHeading id="services-title" eyebrow={dict.services.eyebrow} title={dict.services.title} subtitle={dict.services.subtitle} />
          <ServicesGrid dict={dict} lang={lang} showLink />
        </div>
      </section>

      {/* About (white) */}
      <section id="about" aria-labelledby="about-title" className="section bg-white">
        <div className="container-site flex flex-col gap-16 md:gap-20">
          <SectionHeading id="about-title" eyebrow={dict.about.eyebrow} title={dict.about.title} subtitle={dict.about.story} />
          <TeamProfile dict={dict} lang={lang} />
          <TeamMembers dict={dict} />
          <MissionCards dict={dict} />
          <div>
            <h3 className="mb-6 text-center text-2xl font-semibold">{dict.about.milestonesTitle}</h3>
            <Milestones dict={dict} />
          </div>
        </div>
      </section>

      {/* Reviews (ivory) */}
      <TestimonialsSlider />

      {/* Gallery (white) */}
      <section id="gallery" aria-labelledby="gallery-title" className="section bg-white">
        <div className="container-site">
          <SectionHeading
            id="gallery-title"
            eyebrow={dict.gallery.eyebrow}
            title={dict.gallery.title}
            align="left"
            action={viewAll(dict.gallery.viewAll, "/gallery")}
          />
          <GalleryMasonry limit={8} />
        </div>
      </section>

      {/* FAQs: heading + link left, accordion right (ivory) */}
      <section id="faq" aria-labelledby="faq-title" className="section">
        <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col items-start gap-3 lg:sticky lg:top-28 lg:self-start">
            <Reveal as="span" className="eyebrow">
              {dict.faq.eyebrow}
            </Reveal>
            <Reveal delay={0.08}>
              <h2 id="faq-title" className="h2">
                {dict.faq.title}
              </h2>
            </Reveal>
            <Reveal as="span" variant="rule" delay={0.16} className="rule-taper" aria-hidden />
            <Reveal as="p" delay={0.24} className="text-lg text-muted">
              {dict.faq.subtitle}
            </Reveal>
            <Reveal delay={0.3}>{viewAll(dict.faq.viewAll, "/faq")}</Reveal>
          </div>
          <FAQAccordion ids={["deposit", "visa", "safety", "cancel", "plugs", "food-it"]} grouped={false} />
        </div>
      </section>

      {/* Blog (white) */}
      <section id="blog" aria-labelledby="blog-title" className="section bg-white">
        <div className="container-site">
          <SectionHeading
            id="blog-title"
            eyebrow={dict.blog.eyebrow}
            title={dict.blog.title}
            subtitle={dict.blog.subtitle}
            align="left"
            action={viewAll(dict.blog.viewAll, "/blog")}
          />
          <BlogCards posts={posts.slice(0, 3)} lang={lang} dict={dict} />
        </div>
      </section>

      {/* Contact / Book now: Tea Green details panel + office map (ivory) */}
      <section id="contact" aria-labelledby="contact-title" className="section">
        <div className="container-site">
          <SectionHeading id="contact-title" eyebrow={dict.contact.eyebrow} title={dict.contact.title} subtitle={dict.contact.subtitle} />
          <ContactDetails dict={dict} />
        </div>
      </section>
    </>
  );
}
