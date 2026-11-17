"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { faqs } from "@/lib/data/faqs";
import { l } from "@/lib/i18n/config";
import type { FaqCategory } from "@/lib/types";
import { cn, easeOutExpo } from "@/lib/utils";

const order: FaqCategory[] = ["booking", "visas", "health", "cancellations", "tips"];

/** Keyboard-accessible accordions grouped by category (buttons with aria-expanded/controls). */
export function FAQAccordion({ ids, grouped = true }: { ids?: string[]; grouped?: boolean }) {
  const { lang, dict } = useI18n();
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(null);
  const items = ids ? faqs.filter((f) => ids.includes(f.id)) : faqs;

  const renderItems = (list: typeof faqs) => (
    <ul className="flex flex-col border-t border-ivory-deep">
      {list.map((f) => {
        const isOpen = open === f.id;
        const panelId = `${baseId}-${f.id}`;
        return (
          <li key={f.id} className="border-b border-ivory-deep">
            <h3 className="font-sans">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-[16px] font-semibold text-primary"
              >
                {l(f.question, lang)}
                <ChevronDown
                  className={cn("h-5 w-5 shrink-0 text-accent-700 transition-transform duration-300", isOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-label={l(f.question, lang)}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.28, ease: easeOutExpo }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.08, duration: 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="measure pb-5 text-[15px] text-ink/85"
                  >
                    {l(f.answer, lang)}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );

  if (!grouped) return renderItems(items);

  return (
    <div className="flex flex-col gap-10">
      {order.map((cat) => {
        const list = items.filter((f) => f.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} aria-labelledby={`${baseId}-${cat}`}>
            <h2 id={`${baseId}-${cat}`} className="mb-4 text-xl font-semibold">
              {dict.faq.categories[cat]}
            </h2>
            {renderItems(list)}
          </section>
        );
      })}
    </div>
  );
}
