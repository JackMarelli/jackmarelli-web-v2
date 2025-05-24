import Navbar from "../../components/Navbar/Navbar";

import Lenis from "lenis";

export default function BaseLayout({ children }) {
  const lenis = new Lenis({
    autoRaf: true,
  });

  return (
    <div className="w-full h-fit min-h-screen font-medium">
      <Navbar />
      <div className="w-full h-fit">{children}</div>
    </div>
  );
}
