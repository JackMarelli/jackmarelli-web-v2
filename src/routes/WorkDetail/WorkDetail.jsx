import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import works from "../../data/works.json";

export default function WorkDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    // Find project by URL slug
    const foundProject = works.find((work) => work.url === `/work/${slug}`);
    setProject(foundProject);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <BaseLayout>
        <GridLayout className="pt-8">
          <div className="col-span-full text-center">Loading...</div>
        </GridLayout>
      </BaseLayout>
    );
  }

  if (!project) {
    return (
      <BaseLayout>
        <GridLayout className="pt-8">
          <div className="col-span-full text-center">
            <h1 className="text-4xl mb-4">Project Not Found</h1>
            <Link to="/work" className="text-xl underline">
              Back to Works
            </Link>
          </div>
        </GridLayout>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      {/* Project Metadata */}
      <GridLayout className="pt-48 pb-8">
        <div className="col-span-5 h-64">
          <h1 className="text-6xl font-serif mb-4 leading-[80%]">
            {project.title}
          </h1>
        </div>
        <div className="col-span-5 col-start-7">
          {project.subtitle && <h2 className="text-6xl mb-8 font-serif">{project.subtitle}</h2>}
        </div>
        <div className="col-span-3 col-start-7">
          <div className="flex flex-col">
            {project.expertises.map((expertise, index) => (
              <span key={index} className="text-xl">
                {expertise}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-3"></div>
      </GridLayout>

      {/* Project Gallery */}
      <GridLayout className="gap-y-8 pb-32">
        {project.gallery.map((item, index) => {
          const colSpanClass = `col-span-${item.cols}`;

          return (
            <div key={index} className={colSpanClass}>
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={`${project.title} - ${index + 1}`}
                  className="w-full h-auto object-cover rounded"
                  loading="lazy"
                />
              ) : item.type === "video" ? (
                <video
                  src={item.src}
                  controls
                  className="w-full h-auto object-cover rounded"
                  poster={item.poster}
                >
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>
          );
        })}
      </GridLayout>

      {/* Next Project Section */}
      <GridLayout className="pt-32 pb-32">
        <div className="col-span-full mb-8">
          <h2 className=" uppercase">Next Project</h2>
        </div>
        {(() => {
          // Find next project using the "next" attribute
          const nextProject = works.find((work) => work.url === project.next);

          if (!nextProject) return null;

          return (
            <GridLayout
              onClick={() => {
                navigate(nextProject.url);
              }}
            >
              <div className="col-span-6">
                <h3 className="text-6xl font-serif">{nextProject.title}</h3>
              </div>
              <div className="col-span-6">
                <div className="overflow-hidden rounded">
                  {nextProject.cover.endsWith(".mp4") ? (
                    <video
                      src={nextProject.cover}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={nextProject.cover}
                      alt={nextProject.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </GridLayout>
          );
        })()}
      </GridLayout>
    </BaseLayout>
  );
}
