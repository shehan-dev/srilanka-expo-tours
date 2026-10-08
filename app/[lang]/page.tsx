import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroVideo } from "@/components/home/HeroVideo";
import { BookingBar } from "@/components/home/BookingBar";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { CarouselPopularTours } from "@/components/home/CarouselPopularTours";
import { ToursTeaser } from "@/components/home/ToursTeaser";
import { ItineraryTeaser } from "@/components/home/ItineraryTeaser";
import { DestinationExplorer } from "@/components/discover/DestinationExplorer";
import { ServicesGrid } from "@/components/sections/Services";
import { MissionCards, Milestones, TeamProfile } from "@/components/sections/TeamProfile";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { GalleryMasonry } from "@/components/sections/GalleryMasonry";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BlogCards } from "@/components/sections/BlogCards";
import { PricingTable } from "@/components/sections/PricingTable";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactDetails } from "@/components/sections/ContactDetails";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { posts } from "@/lib/data/blog";
import { getDictionary } from "@/lib/i18n";
import { hasLocale, href } from "@/lib/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      {/* 1. Hero */}
      <HeroVideo />

      {/* Everything after the hero shares one container so the booking bar can stay sticky. */}
      <div className="relative">
        {/* 2. Quick search / booking bar */}
        <BookingBar />

        {/* 3. Why travel with us */}
        <FeatureStrip />

        {/* 4. Popular tour packages */}
        <CarouselPopularTours />

        {/* 5. All tour packages (preview of the catalog) */}
        <ToursTeaser />

        {/* 6. Custom itinerary builder */}
        <ItineraryTeaser lang={lang} dict={dict} />

        {/* 7. Discover Sri Lanka */}
        <section id="discover" aria-labelledby="discover-title" className="section bg-sky/50">
          <div className="container-site">
            <SectionHeading id="discover-title" eyebrow={dict.discover.eyebrow} title={dict.discover.title} subtitle={dict.discover.subtitle} />
            <DestinationExplorer limit={6} showViewAll />
          </div>
        </section>

        {/* 8. Services */}
        <section id="services" aria-labelledby="services-title" className="section">
          <div className="container-site">
            <SectionHeading id="services-title" eyebrow={dict.services.eyebrow} title={dict.services.title} subtitle={dict.services.subtitle} />
            <ServicesGrid dict={dict} lang={lang} showLink />
          </div>
        </section>

        {/* 9. About us */}
        <section id="about" aria-labelledby="about-title" className="section bg-linear-to-b from-white via-sky/50 to-white">
          <div className="container-site flex flex-col gap-16">
            <SectionHeading id="about-title" eyebrow={dict.about.eyebrow} title={dict.about.title} subtitle={dict.about.story} />
            <MissionCards dict={dict} />
            <TeamProfile dict={dict} lang={lang} />
            <div>
              <h3 className="mb-6 text-center text-2xl font-semibold">{dict.about.milestonesTitle}</h3>
              <Milestones dict={dict} />
            </div>
          </div>
        </section>

        {/* 10. Testimonials */}
        <TestimonialsSlider />

        {/* 11. Gallery */}
        <section id="gallery" aria-labelledby="gallery-title" className="section">
          <div className="container-site">
            <SectionHeading id="gallery-title" eyebrow={dict.gallery.eyebrow} title={dict.gallery.title} />
            <GalleryMasonry limit={8} />
          </div>
        </section>

        {/* 12. FAQs */}
        <section id="faq" aria-labelledby="faq-title" className="section bg-sky/50">
          <div className="container-site max-w-3xl">
            <SectionHeading id="faq-title" eyebrow={dict.faq.eyebrow} title={dict.faq.title} subtitle={dict.faq.subtitle} />
            <FAQAccordion ids={["deposit", "visa", "safety", "cancel", "plugs", "food-it"]} grouped={false} />
            <div className="mt-8 text-center">
              <Link href={href(lang, "/faq")} className="btn btn-outline">
                {dict.faq.viewAll} →
              </Link>
            </div>
          </div>
        </section>

        {/* 13. Blog */}
        <section id="blog" aria-labelledby="blog-title" className="section">
          <div className="container-site">
            <SectionHeading
              id="blog-title"
              eyebrow={dict.blog.eyebrow}
              title={dict.blog.title}
              subtitle={dict.blog.subtitle}
              align="left"
              action={
                <Link href={href(lang, "/blog")} className="btn btn-outline btn-sm">
                  {dict.blog.viewAll} →
                </Link>
              }
            />
            <BlogCards posts={posts.slice(0, 3)} lang={lang} dict={dict} />
          </div>
        </section>

        {/* 14. Pricing comparison */}
        <section id="pricing" aria-labelledby="pricing-title" className="section bg-sky/50">
          <div className="container-site">
            <SectionHeading id="pricing-title" eyebrow={dict.pricing.eyebrow} title={dict.pricing.title} subtitle={dict.pricing.subtitle} />
            <PricingTable dict={dict} lang={lang} />
          </div>
        </section>

        {/* 15. Contact / Book now */}
        <section id="contact" aria-labelledby="contact-title" className="section">
          <div className="container-site">
            <SectionHeading id="contact-title" eyebrow={dict.contact.eyebrow} title={dict.contact.title} subtitle={dict.contact.subtitle} />
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <ContactForm />
              <ContactDetails dict={dict} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
