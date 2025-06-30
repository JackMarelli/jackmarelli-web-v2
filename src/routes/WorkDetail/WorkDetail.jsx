import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import BaseLayout from "../../layouts/BaseLayout/BaseLayout";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import works from "../../data/works.json";

export default function WorkDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const foundProject = works.find((work) => work.url === `/work/${slug}`);
    setProject(foundProject);
  }, [slug]);

  if (!project) {
    return (
      <BaseLayout>
        <GridLayout className="pt-8">
          <div className="col-span-full text-center">
            <h1 className="text-2xl md:text-4xl mb-4">Project Not Found</h1>
            <Link to="/work" className="text-base md:text-xl underline">
              Back to Works
            </Link>
          </div>
        </GridLayout>
      </BaseLayout>
    );
  }

  const nextProject = works.find((work) => work.url === project.next);

  return (
    <BaseLayout>
      {/* Project Metadata */}
      <GridLayout className="gap-y-0 pt-16 pb-4 md:pt-48 md:pb-8">
        <div className="md:order-none col-span-full text-base md:col-span-2 md:text-xl mt-32 md:mb-0 md:mt-20">
          {project.when}
        </div>
        <div className="order-1 col-span-full md:col-span-5 md:col-start-7 md:h-64 mb-24 md:mt-20 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-serif leading-[90%] md:leading-[80%]">
            {project.title}
            {project.subtitle && ` - ${project.subtitle}`}
          </h1>
        </div>
        <div className="order-2 col-span-full md:col-span-3 md:col-start-7 md:mt-0">
          <div className="flex flex-col flex-wrap">
            {project.expertises.map((expertise, index) => (
              <span key={index} className="text-base md:text-xl">
                {expertise}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-3 hidden md:block"></div>
      </GridLayout>

      {/* Project Gallery */}
      <GalleryRenderer project={project} />

      {/* Next Project Section */}
      {nextProject && (
        <Link to={nextProject.url}>
          <GridLayout className="pt-16 pb-16 md:pt-32 md:pb-32 cursor-pointer gap-y-0 md:gap-y-4">
            <div className="mb-4 col-span-6 md:mb-8">
              <p className="uppercase text-base md:text-xl">Next Project</p>
            </div>
            <div className="col-span-5 col-start-7 font-serif text-3xl md:text-5xl leading-[100%]">
              {nextProject.title}
            </div>
            <div className="col-span-6 col-start-7">
              <div className="overflow-hidden rounded">
                {nextProject.cover.endsWith(".mp4") ? (
                  <video
                    src={nextProject.cover}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-contain rounded md:h-full md:object-cover"
                  />
                ) : (
                  <img
                    src={nextProject.cover}
                    alt={nextProject.title}
                    className="w-full h-auto object-contain rounded md:h-full md:object-cover"
                  />
                )}
              </div>
            </div>
          </GridLayout>
        </Link>
      )}
    </BaseLayout>
  );
}

// --- Smart GalleryRenderer ---

function GalleryRenderer({ project }) {
  const gallery = project.gallery;

  // Group items into fulls and 6-cols blocks
  const blocks = [];
  let sixColsBuffer = [];

  gallery.forEach((item) => {
    if (item.cols === "full") {
      if (sixColsBuffer.length) {
        blocks.push({ type: "sixCols", items: [...sixColsBuffer] });
        sixColsBuffer = [];
      }
      blocks.push({ type: "full", item });
    } else {
      sixColsBuffer.push(item);
    }
  });

  if (sixColsBuffer.length) {
    blocks.push({ type: "sixCols", items: [...sixColsBuffer] });
  }

  let descriptionInserted = false;

  return (
    <GridLayout className="gap-y-8 pb-16 md:pb-32">
      {blocks.map((block, blockIndex) => {
        if (block.type === "full") {
          return (
            <>
              <div key={blockIndex} className="col-span-full">
                <MediaRenderer
                  item={block.item}
                  title={project.title}
                  index={blockIndex}
                />
              </div>
              {!descriptionInserted &&
                (() => {
                  const words = project.description.split(/\s+/);
                  const firstPart = words.slice(0, 100).join(" ");
                  const secondPart =
                    words.length > 100 ? words.slice(100).join(" ") : null;
                  return (
                    <>
                      <div
                        key={`desc-${blockIndex}-first`}
                        className="col-span-full text-base md:col-span-3 md:col-start-7 md:mb-8"
                      >
                        <p className="leading-relaxed">{firstPart}</p>
                      </div>
                      {secondPart && (
                        <div
                          key={`desc-${blockIndex}-second`}
                          className="col-span-full text-base md:col-span-3 md:col-start-10 md:mb-64"
                        >
                          <p className="leading-relaxed">{secondPart}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              {(descriptionInserted = true)}
            </>
          );
        }

        return (
          <div
            key={blockIndex}
            className="col-span-full flex flex-col gap-4 md:flex-row md:gap-8"
          >
            {block.items.map((item, index) => (
              <div key={index} className="flex-1">
                <MediaRenderer
                  item={item}
                  title={project.title}
                  index={index}
                />
              </div>
            ))}
          </div>
        );
      })}
    </GridLayout>
  );
}

function MediaRenderer({ item, title, index }) {
  if (item.type === "image") {
    return (
      <img
        src={item.src}
        alt={`${title} - ${index + 1}`}
        className="w-full h-auto object-contain rounded md:h-full md:object-cover"
        loading="lazy"
      />
    );
  } else if (item.type === "video") {
    return (
      <video
        src={item.src}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop
        className="w-full h-auto object-contain rounded md:h-full md:object-cover"
        poster={item.poster}
      >
        Your browser does not support the video tag.
      </video>
    );
  } else {
    return null;
  }
}
