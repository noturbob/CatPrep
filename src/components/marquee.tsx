/** Full-bleed canary strip, scrolling slowly. Content is doubled so the loop is seamless. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap px-6">
          {t}
          <span aria-hidden className="ml-12 inline-block size-2 rotate-45 bg-charcoal" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee overflow-hidden border-y-2 border-charcoal bg-canary py-3 text-sub font-semibold uppercase text-charcoal">
      <div className="marquee-track flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
