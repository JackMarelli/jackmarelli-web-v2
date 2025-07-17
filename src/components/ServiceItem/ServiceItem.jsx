export default function ServiceItem({
  number,
  title,
  items,
  className = '',
  numberColStart = 'col-start-5',
  contentColStart = 'col-start-6',
}) {
  return (
    <>
      <span className={`col-span-1 text-end text-lg ${numberColStart} ${className}`}>{number}</span>
      <div className={`col-span-2 ${contentColStart} space-y-2 ${className}`}>
        <h3 className="text-lg uppercase text-nowrap">{title}</h3>
        <ul className="text-lg">
          {items.map((item, index) => (
            <li className="leading-tight" key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
