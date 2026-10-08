"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useI18n } from "@/components/providers/AppProviders";
import { faqs } from "@/lib/data/faqs";
import { l } from "@/lib/i18n/config";
import type { FaqCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const order: FaqCategory[] = ["booking", "visas", "health", "cancellations", "tips"];

/** Keyboard-accessible accordions grouped by category (buttons with aria-expanded/controls). */
export function FAQAccordion({ ids, grouped = true }: { ids?: string[]; grouped?: boolean }) {
  const { lang, dict } = useI18n();
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(null);
  const items = ids ? faqs.filter((f) => ids.includes(f.id)) : faqs;

  const renderItems = (list: typeof faqs) => (
    <ul className="flex flex-col gap-3">
      {list.map((f) => {
        const isOpen = open === f.id;
        const panelId = `${baseId}-${f.id}`;
        return (
          <li key={f.id} className={cn("card overflow-hidden transition-shadow", isOpen && "shadow-lift")}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-semibold"
              >
                {l(f.question, lang)}
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky text-primary transition-transform duration-300",
                    isOpen && "rotate-45 bg-primary text-white"
                  )}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-label={l(f.question, lang)}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.9, 0.2, 1] }}
                >
                  <p className="px-5 pb-5 text-[15px] text-ink/80">{l(f.answer, lang)}</p>
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
