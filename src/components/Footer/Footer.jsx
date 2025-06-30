import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import GridLayout from "../../layouts/GridLayout/GridLayout";

export default function Footer({ intensity = 100 }) {
  const containerRef = useRef(null);
  const text = "©2025";
  const [positions, setPositions] = useState(
    Array(text.length).fill({ x: 0, y: 0 })
  );

  useEffect(() => {
    function handleMouseMove(e) {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPositions = Array.from(containerRef.current.children).map((el) => {
        const charRect = el.getBoundingClientRect();
        const charX = charRect.left + charRect.width / 2 - rect.left;
        const charY = charRect.top + charRect.height / 2 - rect.top;

        const dx = mouseX - charX;
        const dy = mouseY - charY;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

        const force = Math.min((intensity * 10) / dist, intensity);
        const angle = Math.atan2(dy, dx);

        return {
          x: -Math.cos(angle) * force,
          y: -Math.sin(angle) * force,
        };
      });

      setPositions(newPositions);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [intensity]);

  return (
    <div className="h-[30vh] md:h-screen flex items-end overflow-hidden">
      <GridLayout>
        <div
          ref={containerRef}
          className="col-span-full h-fit leading-none uppercase flex gap-1 text-[27.2vw] md:text-[29.8vw] relative"
        >
          {text.split("").map((char, i) => (
            <motion.div
              key={i}
              className="relative"
              animate={{
                x: positions[i]?.x || 0,
                y: positions[i]?.y || 0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              {char}
            </motion.div>
          ))}
        </div>
      </GridLayout>
    </div>
  );
}
