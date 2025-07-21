import React from "react";
import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";
import PlayhouseProject from "../../components/PlayhouseProject/PlayhouseProject";
import projects from "../../data/play.json";

export default function Playhouse() {
  return (
    <BaseLayout>
      <GridLayout>
        <div className="col-span-full font-serif text-3xl md:text-5xl mb-6 mt-64">
          a playground of front-end mini projects – quick experiments in CSS,
          JS, and HTML.
        </div>

        {projects.map((project, index) => (
          <PlayhouseProject key={index} project={project} />
        ))}
      </GridLayout>
    </BaseLayout>
  );
}
