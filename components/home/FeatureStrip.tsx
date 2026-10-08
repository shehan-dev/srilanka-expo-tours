"use client";

import { motion } from "motion/react";
import { Award, BadgeCheck, CarFront, Route, ShieldCheck, Star } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TripadvisorIcon } from "@/components/ui/SocialIcons";
import { easeOutExpo } from "@/lib/utils";

const icons = [BadgeCheck, CarFront, Route, ShieldCheck];
// Small looping micro-animations (one per icon), 2–3s loops.
const loops = [
  { rotate: [0, -8, 8, 0] },
  { x: [0, 4, 0, -2, 0] },
  { y: [0, -4, 0] },
  { scale: [1, 1.12, 1] },
];

export function FeatureStrip() {
  const { dict } = useI18n();

  return (
    <section aria-labelledby="why-us" className="section bg-linear-to-b from-white to-sky/60">
      <div className="container-site">
        <SectionHeading id="why-us" title={dict.features.title} subtitle={dict.features.subtitle} />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.features.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.08 }}
                className="card group flex flex-col gap-4 p-6 transition-shadow hover:shadow-lift"
              >
                <motion.span
                  className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-white shadow-lg"
                  animate={loops[i]}
                  transition={{ duration: 2.4 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <Icon className="h-7 w-7" />
                </motion.span>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted">{item.text}</p>
              </motion.li>
            );
          })}
        </ul>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label="Trust badges">
          {[
            { label: dict.features.badges.license, Icon: Award },
            { label: dict.features.badges.tripadvisor, Icon: TripadvisorIcon },
            { label: dict.features.badges.google, Icon: Star },
          ].map(({ label, Icon }) => (
            <li key={label} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-card ring-1 ring-line">
              <Icon className="h-4 w-4 text-accent-700" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
