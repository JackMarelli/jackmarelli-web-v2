import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function BaseLayout({ children }) {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis once
    if (!lenisRef.current) {
      lenisRef.current = new Lenis({
        autoRaf: true,
      });
    }

    // Multiple scroll attempts with different timings
    const scrollToTop = () => {
      // Immediate scroll attempts
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Lenis scroll
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    };

    // Execute immediately
    scrollToTop();

    // Execute after a short delay
    const timer1 = setTimeout(scrollToTop, 10);
    return () => {
      clearTimeout(timer1);
    };
  }, [location.pathname]);

  // Cleanup Lenis on unmount
  useEffect(() => {
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-fit min-h-screen font-medium overflow-x-hidden">
      <Navbar />
      <div className="w-full h-fit">{children}</div>
      <Footer />
    </div>
  );
}