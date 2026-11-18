"use client";

import "lenis/dist/lenis.css";
import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Site-wide smooth (inertia) scrolling for mouse wheels and trackpads, via Lenis.
 * Touch scrolling stays native. Skipped entirely when the visitor prefers reduced motion,
 * in which case the browser's normal scrolling (and CSS smooth anchor jumps) apply.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      // Scrollable children (menus, dialogs, dropdowns, chip rows) keep their own scrolling.
      allowNestedScroll: true,
      // In-page "#" links glide to their target, clear of the fixed header.
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
      prevent: (node) => !!node.closest?.(".leaflet-container"),
    });
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
