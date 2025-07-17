import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";
import ServiceItem from "../../components/ServiceItem/ServiceItem";

export default function About() {
  return (
    <BaseLayout>
      <GridLayout>
        <p className="col-span-full text-7xl font-serif indent-[calc(100%/4)] tracking-tight text-gray-900 mt-[64vh]">
          Somewhere between code and craft, where logic meets instinct and
          pixels hold meaning. A quiet pursuit of balance, form, and clarity,
          driven by the belief that good work takes time. An approach shaped by
          process, precision, and attention to detail.
        </p>
      </GridLayout>
      <GridLayout className="mt-64">
        <div className="col-span-4 text-lg uppercase">About me</div>
        <p className="col-span-5 col-start-6 text-lg leading-tight">
          Hi! I'm Giacomo, a front-end developer with a background in IT and
          design, and a genuine love for building things that feel thoughtful,
          clear, and well-crafted. I started exploring the web as a teenager,
          and over time, I've developed a way of working that blends technical
          skills with a designer’s eye. I see development as a form of
          craftsmanship. Every interface, animation, and interaction deserves
          care and attention, not just to look good, but to feel right.
        </p>

        <p className="col-span-5 col-start-6 text-lg mt-24 leading-tight">
          Outside of work, I'm into sound systems, combat sports, vinyl records,
          cooking, carpentry, and anything handmade. These interests remind me
          that good things take time, and the process matters just as much as
          the result. Even though I work in pixels and code, I try to stay aware
          of the bigger picture: how what we build affects people and the world
          around us. I care about doing things well, doing them with care, and
          always staying open to learning more.
        </p>
      </GridLayout>
      <GridLayout className="mt-64">
        <div className="col-span-4 text-lg uppercase">Services</div>

        <ServiceItem
          number="01"
          title="Web Development"
          items={[
            "Tailored Interfaces",
            "Pixel-perfect HTML / CSS",
            "JavaScript Development",
            "Tailwind / SCSS Styling",
            "WebGL / Three.js",
            "WordPress",
          ]}
          numberColStart="col-start-5"
          contentColStart="col-start-6"
        />

        <ServiceItem
          number="02"
          title="Hardware Projects"
          items={[
            "Sensor Integration",
            "Circuit Soldering",
            "Arduino Prototyping",
            "Physical Computing",
            "Real-Time Data Inputs",
          ]}
          numberColStart="col-start-8"
          contentColStart="col-start-9"
        />

        <ServiceItem
          number="03"
          title="Interactive"
          items={[
            "Multimedia Installations",
            "Set & Spatial Design",
            "Sound & Light Integration",
            "Creative Coding",
            "Technical Direction",
          ]}
          numberColStart="col-start-5"
          contentColStart="col-start-6"
          className="mt-24"
        />

        <ServiceItem
          number="04"
          title="Design"
          items={[
            "UI Systems & Typography",
            "Logo Design",
            "Flyer / Poster Design",
            "Figma-based Layouts",
            "Visual Identity Concepts",
          ]}
          numberColStart="col-start-8"
          contentColStart="col-start-9"
          className="mt-24"
        />

        <ServiceItem
          number="05"
          title="Tools & Workflow"
          items={[
            "Version Control / Git",
            "Local Dev Environments",
            "File & Asset Organization",
            "Hosting & Deployment",
            "Lightweight Build Pipelines",
            "SEO Fundamentals",
          ]}
          numberColStart="col-start-5"
          contentColStart="col-start-6"
          className="mt-24"
        />
      </GridLayout>
      <GridLayout className="mt-64">
        <div className="col-span-full h-fit rounded">
          <img
            className="w-full h-full"
            src="assets/media/riflessioniprogrammate/IMG-20250204-WA0005.jpg"
            alt=""
          />
        </div>
      </GridLayout>
    </BaseLayout>
  );
}
