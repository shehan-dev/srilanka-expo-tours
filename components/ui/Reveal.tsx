import type { CSSProperties, HTMLAttributes } from "react";

/**
 * Scroll reveal (fade + 20px rise, once). A plain server-rendered element: the hidden state
 * is applied by CSS only when the inline script in the root layout has run, so content is
 * visible without JavaScript and nothing flashes on hydration. Use `delay` (seconds) to
 * stagger siblings and `as="li"` when it is a direct child of a list.
 */
export function Reveal({
  as = "div",
  delay = 0,
  variant = "up",
  style,
  children,
  ...rest
}: {
  as?: "div" | "li" | "span" | "p";
  /** Stagger delay in seconds (capped so long lists never wait). */
  delay?: number;
  variant?: "up" | "fade" | "rule" | "line" | "rise";
} & HTMLAttributes<HTMLElement>) {
  const Tag = as as "div";
  return (
    <Tag
      data-reveal={variant}
      suppressHydrationWarning
      style={{ ...style, "--reveal-delay": `${Math.round(Math.min(delay, 0.6) * 1000)}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Inline script for <head>: marks the document as JS-enabled and reveals elements as they enter the viewport. */
export const revealScript = `(function(){var d=document,h=d.documentElement;if(!("IntersectionObserver" in window))return;h.setAttribute("data-js","");var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute("data-revealed","");io.unobserve(e.target)}})},{threshold:0.12});function scan(r){if(r.querySelectorAll)r.querySelectorAll("[data-reveal]:not([data-revealed])").forEach(function(n){io.observe(n)})}function start(){scan(d);new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches("[data-reveal]:not([data-revealed])"))io.observe(n);scan(n)}})})}).observe(d.body,{childList:true,subtree:true})}if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",start);else start()})();`;
