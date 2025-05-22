export default function GridLayout({ children, className = "" }) {
  const addictionalClasses = className;
  return (
    <div
      className={`w-full h-fit grid grid-cols-12 gap-4 px-4 ${addictionalClasses}`}
    >
      {children}
    </div>
  );
}
