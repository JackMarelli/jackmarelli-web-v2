import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import Work from "../../components/Work/Work";

import selfImg from "../../assets/media/0.jpg";
import works from "../../data/works.json";

export default function Landing() {
  const [milanTime, setMilanTime] = useState("");
  const [projects, setProjects] = useState([]);
  const [momentumDivs, setMomentumDivs] = useState([]);

  const lastPositionRef = useRef({ x: 0, y: 0 });
  const totalDistanceRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const velocityRef = useRef({ x: 0, y: 0 });
  const divIdRef = useRef(0);

  useEffect(() => {
    setProjects(works);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Rome",
        hour12: false,
      });
      setMilanTime(formatter.format(now));
    };

    updateTime(); // initialize immediately
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const createMomentumDiv = (x, y, velocityX, velocityY) => {
    const id = divIdRef.current++;
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const normalizedVelX = velocityX * Math.min(speed / 5, 10); // Scale and cap velocity
    const normalizedVelY = velocityY * Math.min(speed / 5, 10);

    const newDiv = {
      id,
      x,
      y,
      velocityX: normalizedVelX,
      velocityY: normalizedVelY,
      opacity: 1,
      scale: 1,
    };

    setMomentumDivs((prev) => [...prev, newDiv]);

    // Animate the div
    let startTime = Date.now();
    const movementDuration = 300; // milliseconds of movement
    const fadeDuration = 100; // millisecondsa of fade
    const totalDuration = movementDuration + fadeDuration; // 3 seconds total

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= totalDuration) {
        // Remove the div after total animation
        setMomentumDivs((prev) => prev.filter((div) => div.id !== id));
        return;
      }

      let opacity = 1;
      let movementProgress = Math.min(elapsed / movementDuration, 1);

      // Only start fading after movement duration (2000ms)
      if (elapsed > movementDuration) {
        const fadeProgress = (elapsed - movementDuration) / fadeDuration;
        opacity = 1 - fadeProgress;
      }

      // Momentum decreases over time but never goes negative (no pullback)
      const easeOutQuad = (t) => t * (2 - t); // Decelerates to 0
      const easedProgress = easeOutQuad(movementProgress);
      const throwSensitivity = 90; // Higher = longer throw, Lower = shorter throw

      const maxVelocity = 1.5; // pixels/ms
      const clampedVelocityX = Math.max(
        Math.min(velocityX, maxVelocity),
        -maxVelocity
      );
      const clampedVelocityY = Math.max(
        Math.min(velocityY, maxVelocity),
        -maxVelocity
      );

      // Then normalize those
      const speed = Math.sqrt(clampedVelocityX ** 2 + clampedVelocityY ** 2);
      const normalizedVelX = clampedVelocityX * Math.min(speed / 5, 10);
      const normalizedVelY = clampedVelocityY * Math.min(speed / 5, 10);

      setMomentumDivs((prev) =>
        prev.map((div) => {
          if (div.id === id) {
            return {
              ...div,
              x: x + normalizedVelX * easedProgress * throwSensitivity,
              y: y + normalizedVelY * easedProgress * throwSensitivity,
              opacity: opacity,
              scale: 1,
            };
          }
          return div;
        })
      );

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    const currentX = e.clientX;
    const currentY = e.clientY;
    const currentTime = Date.now();

    // Calculate distance from last position
    const deltaX = currentX - lastPositionRef.current.x;
    const deltaY = currentY - lastPositionRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calculate velocity (pixels per millisecond)
    const deltaTime = currentTime - lastTimeRef.current;
    if (deltaTime > 0) {
      velocityRef.current = {
        x: deltaX / deltaTime,
        y: deltaY / deltaTime,
      };
    }

    // Add to total distance
    totalDistanceRef.current += distance;

    // Check if we've traveled 100px or more
    if (totalDistanceRef.current >= 100) {
      console.log(
        `Mouse traveled 100px! Total distance: ${totalDistanceRef.current.toFixed(
          2
        )}px`
      );

      // Create momentum div with current velocity
      createMomentumDiv(
        currentX,
        currentY,
        velocityRef.current.x,
        velocityRef.current.y
      );

      totalDistanceRef.current = 0; // Reset counter
    }

    // Update last position and time
    lastPositionRef.current = { x: currentX, y: currentY };
    lastTimeRef.current = currentTime;
  };

  const handleMouseEnter = (e) => {
    // Initialize position when mouse enters the div
    lastPositionRef.current = { x: e.clientX, y: e.clientY };
    lastTimeRef.current = Date.now();
    totalDistanceRef.current = 0;
    velocityRef.current = { x: 0, y: 0 };
  };

  return (
    <BaseLayout>
      <div
        className="absolute w-full h-screen top-0 z-10 overflow-hiddena"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
      >
        {/* Render momentum divs */}
        {momentumDivs.map((div) => (
          <div
            key={div.id}
            className="absolute w-64 h-64 pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: div.x - 24,
              top: div.y - 24,
              opacity: div.opacity,
              transition: "none",
            }}
          >
            <img
              src={selfImg}
              alt="momentum"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <GridLayout>
        <div className="col-span-3 flex items-center h-[90vh] font-serif text-7xl">
          Creative
        </div>
        <div className="col-span-3 flex items-center h-[90vh] font-serif text-7xl">
          Web
        </div>
        <div className="col-span-3 flex items-center h-[90vh] font-serif text-7xl">
          Front-End
        </div>
        <div className="col-span-3 flex items-center justify-end h-[90vh] font-serif text-7xl">
          Developer
        </div>
      </GridLayout>
      <GridLayout>
        <div className="col-span-3 flex items-end pb-4">Milan, {milanTime}</div>

        <div className="col-span-3 col-start-7 h-[10vh] flex items-end text-lg pb-4">
          Currently working at{" "}
          <a className="ps-1" href="https://www.quantum-studio.it/">
            {" "}
            QUANTUM STUDIO
          </a>
        </div>
        <div className="col-span-3 h-[10vh] flex items-end justify-end text-lg pb-4 animate-blink">
          Scroll
        </div>
      </GridLayout>
      <GridLayout className="pt-8">
        <hr className="col-span-full border-t-2 border-black pb-8" />
        <div className="col-span-3 uppercase text-2xl">About</div>
        <div className="col-span-3 w-56 h-64 rounded overflow-hidden">
          <img src={selfImg} alt="Me" className="w-full h-full object-cover" />
        </div>
        <div className="col-span-3 col-start-10 flex justify-end uppercase text-2xl underline">
          <Link to="/about">Read all</Link>
        </div>
        <div className="col-span-full text-7xl font-serif indent-[calc(100%/4)] mt-32 tracking-tight text-gray-900">
          I'm Giacomo, a creative developer based near Milan. My work spans
          between websites, UI/UX, branding, graphic design, prototyping,
          audiovisual and interactive installations. <br />
          <br />
          Moving between design and code, concept and execution. Design and code
          are only tools of expression — shaping digital experiences that are
          thoughtful, expressive, and alive.
        </div>
      </GridLayout>
      <GridLayout className="pt-64 pb-4">
        <div className="col-span-3 uppercase text-2xl">Works</div>
        <div className="col-span-3 col-start-10 flex justify-end uppercase text-2xl underline">
          <Link to="/about">See all</Link>
        </div>
      </GridLayout>
      <GridLayout className="gap-y-32">
        {projects.slice(0, 6).map((project, index) => (
          <Work key={index} project={project} index={index} />
        ))}
      </GridLayout>
    </BaseLayout>
  );
}
