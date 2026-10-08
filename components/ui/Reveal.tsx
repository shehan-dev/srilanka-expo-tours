"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { easeOutExpo } from "@/lib/utils";

/**
 * Fades + slides content in once when it scrolls into view. Use `delay` to stagger siblings
 * and `as="li"` when it is a direct child of a list.
 */
export function Reveal({
  delay = 0,
  y = 24,
  as = "div",
  children,
  ...rest
}: { delay?: number; y?: number; as?: "div" | "li" } & HTMLMotionProps<"div">) {
  const Comp = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: easeOutExpo, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
