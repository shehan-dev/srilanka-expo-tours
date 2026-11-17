"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Counts a stat up once when it scrolls into view (~1.2s, ease-out). Accepts display strings such as
 * "2,300+", "2.300+", "4.9★" or "4,9★". The final value is rendered on the server, so it is correct
 * without JavaScript and for screen readers (the animated digits are aria-hidden).
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const [animating, setAnimating] = useState(false);

  // Split "2,300+" into prefix/number/suffix and remember the separators used.
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);

  useEffect(() => {
    if (!inView || reduce || !match) return;
    const [, pre, num, post] = match;
    const decimalSep = /[.,]\d$/.test(num) ? num[num.length - 2] : null;
    const thousandSep = decimalSep ? null : (num.match(/[.,]/)?.[0] ?? null);
    const target = Number(decimalSep ? num.replace(decimalSep, ".") : num.replace(/[.,]/g, ""));
    if (!Number.isFinite(target)) return;

    const format = (n: number) => {
      if (decimalSep) return n.toFixed(1).replace(".", decimalSep);
      const s = String(Math.round(n));
      return thousandSep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep) : s;
    };

    setAnimating(true);
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setDisplay(`${pre}${format(n)}${post}`),
      onComplete: () => {
        setDisplay(value);
        setAnimating(false);
      },
    });
    return () => controls.stop();
  }, [inView, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className="tabular-nums">
      {animating ? (
        <>
          <span className="sr-only">{value}</span>
          <span aria-hidden>{display}</span>
        </>
      ) : (
        value
      )}
    </span>
  );
}
