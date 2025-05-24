import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import Work from "../../components/Work/Work";

import selfImg from "../../assets/media/0.jpg";
import works from "../../data/works.json";

export default function Landing() {
  const [milanTime, setMilanTime] = useState("");
  const [projects, setProjects] = useState([]);

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

  return (
    <BaseLayout>
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
      <GridLayout className="pt-64">
        <div className="col-span-3 uppercase text-2xl">Works</div>
        <div className="col-span-3 col-start-10 flex justify-end uppercase text-2xl underline">
          <Link to="/about">See all</Link>
        </div>
        {projects.slice(0, 3).map((project, index) => (
          <Work key={index} project={project} index={index} />
        ))}
      </GridLayout>
    </BaseLayout>
  );
}