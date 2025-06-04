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
            <h1 className="text-4xl mb-4">Project Not Found</h1>
            <Link to="/work" className="text-xl underline">
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
      <GridLayout className="pt-48 pb-8">
        <div className="col-span-2 text-xl mt-20">{project.when}</div>
        <div className="col-span-5 col-start-7 h-64 mt-20 mb-16">
          <h1 className="text-6xl font-serif mb-4 leading-[80%]">
            {project.title}{project.subtitle && ` - ${project.subtitle}`}
          </h1>
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
      <GalleryRenderer project={project} />

      {/* Next Project Section */}
      {nextProject && (
        <Link to={nextProject.url}>
          <GridLayout className="pt-32 pb-32 cursor-pointer">
            <div className="col-span-6 mb-8">
              <p className="uppercase text-xl">Next Project</p>
            </div>
            <div className="col-span-5 col-start-7 font-serif text-5xl">
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
    <GridLayout className="gap-y-8 pb-32">
      {blocks.map((block, blockIndex) => {
        if (block.type === "full") {
          return (
            <>
              <div key={blockIndex} className="col-span-full">
                <MediaRenderer item={block.item} title={project.title} index={blockIndex} />
              </div>
              {!descriptionInserted && (
                <div key={`desc-${blockIndex}`} className="col-span-6 col-start-7 mb-64">
                  <p className="text-xl leading-relaxed">{project.description}</p>
                </div>
              )}
              {descriptionInserted = true}
            </>
          );
        }

        return (
          <div key={blockIndex} className="col-span-full flex gap-8">
            {block.items.map((item, index) => (
              <div key={index} className="flex-1">
                <MediaRenderer item={item} title={project.title} index={index} />
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
    const isFull = item.cols === "full";
    return (
      <img
        src={item.src}
        alt={`${title} - ${index + 1}`}
        className={`w-full ${isFull ? "h-auto object-contain" : "h-full object-cover"} rounded`}
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
        className="w-full h-full object-cover rounded"
        poster={item.poster}
      >
        Your browser does not support the video tag.
      </video>
    );
  } else {
    return null;
  }
}
