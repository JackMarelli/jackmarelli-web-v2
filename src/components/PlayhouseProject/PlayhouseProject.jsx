const isVideo = (src) =>
  [".mp4", ".webm", ".ogg", ".mov", ".avi"].some((ext) =>
    src.toLowerCase().includes(ext)
  );

const PlayhouseProject = ({ project }) => {
  const openProject = () => {
    const url = `/play/${project.path}/index.html`;
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={openProject}
      className="col-span-3 flex flex-col gap-2 cursor-pointer"
    >
      <div className="w-full aspect-video overflow-hidden rounded transition-transform duration-200">
        {isVideo(project.cover) ? (
          <video
            src={project.cover}
            className="w-full h-full object-cover transform rounded hover:scale-[0.99] transition-transform duration-200"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={project.cover}
            alt={project.title}
            className="w-full h-full object-cover transform rounded hover:scale-[0.99] transition-transform duration-200"
          />
        )}
      </div>
      <div className="text-lg font-semibold">{project.title}</div>
    </div>
  );
};

export default PlayhouseProject;
