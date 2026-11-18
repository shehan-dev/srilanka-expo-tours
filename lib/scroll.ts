/**
 * Lock page scrolling while a dialog or menu is open. Pauses smooth scrolling (Lenis clips the
 * page while stopped) and also sets body overflow for when Lenis is not running. Returns an unlock function.
 */
export function lockScroll() {
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  window.__lenis?.stop();
  return () => {
    document.body.style.overflow = previous;
    window.__lenis?.start();
  };
}

/** Scroll the page to a position, smoothly through Lenis when it is active. */
export function scrollToTop() {
  if (window.__lenis) window.__lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
