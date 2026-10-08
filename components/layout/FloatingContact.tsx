"use client";

import { motion } from "motion/react";
import { useI18n } from "@/components/providers/AppProviders";
import { TelegramIcon, WhatsappIcon } from "@/components/ui/SocialIcons";
import { site } from "@/lib/site";

/** Floating WhatsApp / Telegram buttons with a message prefilled in the visitor's language. */
export function FloatingContact() {
  const { dict } = useI18n();
  const text = encodeURIComponent(dict.contact.prefill);

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      <motion.a
        href={`https://t.me/${site.telegram}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.contact.telegram}
        className="grid h-12 w-12 place-items-center rounded-full bg-[#229ED9] text-white shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <TelegramIcon width={22} height={22} />
      </motion.a>
      <motion.a
        href={`https://wa.me/${site.whatsapp}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.contact.whatsapp}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 [animation-duration:2.5s]" />
        <WhatsappIcon width={28} height={28} />
      </motion.a>
    </div>
  );
}
