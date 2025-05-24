import React from "react";

const Work = ({ project, index }) => {
  // Helper function to determine if a file is a video
  const isVideo = (src) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return videoExtensions.some((ext) => src.toLowerCase().includes(ext));
  };

  // Helper function to render media (image or video)
  const renderMedia = (src, alt, className) => {
    console.log("rendering ", project.title);

    if (isVideo(src)) {
      return (
        <video src={src} className={className} autoPlay loop muted playsInline>
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <img src={src} alt={alt} className={className} />;
    }
  };

  return (
    <div className="col-span-4 flex flex-col gap-4 cursor-pointer">
      {project.cover ? (
        <div className="w-full rounded overflow-hidden">
          {renderMedia(project.cover, project.title, "w-full object-contain")}
        </div>
      ) : (
        <div className="w-full aspect-[4/3] bg-gray-200 rounded" />
      )}
      <div className="flex flex-col">
        <div className="text-xl uppercase">{project.title}</div>
        <div className="text-xl capitalize">
          {project.expertises.map((exp, i) => (
            <span key={i}>
              {exp}
              {i < project.expertises.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
