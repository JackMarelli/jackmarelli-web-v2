import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import Work from "../../components/Work/Work";

import works from "../../data/works.json";

export default function Works() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(works);
  }, []);

  return (
    <BaseLayout>
      <GridLayout className="gap-y-24 pt-64">
        <div className="col-span-full text-7xl indent-[calc(100%/4)] font-serif">
          My expertise lies in crafting and bringing to life digital experiences
          that engage and inspire.
        </div>
        {projects.map((project, index) => (
          <Work key={index} project={project} index={index} />
        ))}
      </GridLayout>
    </BaseLayout>
  );
}
