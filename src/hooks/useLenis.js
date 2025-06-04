// src/hooks/useLenis.js
import { useRef, useEffect } from "react";
import Lenis from "lenis";

export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose globally for ScrollToTop to access
    window.lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
