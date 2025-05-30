import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import Lenis from "lenis";
import { useEffect } from "react";

export default function BaseLayout({ children }) {
  const lenis = new Lenis({
    autoRaf: true,
  });



  return (
    <div className="w-full h-fit min-h-screen font-medium overflow-x-hidden">
      <Navbar />
      <div className="w-full h-fit">{children}</div>
      <Footer />
    </div>
  );
}
