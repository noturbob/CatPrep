/** A row of 22 cells, one per QA question. Used as the site's single recurring figure. */
export function Strip({ cells, label }: { cells: { fill: string; text?: string }[]; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ "--n": cells.length, "--m": Math.ceil(cells.length / 2) } as React.CSSProperties}
      className="grid grid-cols-[repeat(var(--m),minmax(0,1fr))] gap-1.5 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
    >
      {cells.map((c, i) => (
        <span
          key={i}
          className="cell-fill aspect-square rounded-sm border-2 border-line"
          style={{ background: c.fill, animationDelay: `${600 + i * 70}ms` }}
        />
      ))}
    </div>
  );
}

export const cells = (...runs: [number, string][]) =>
  runs.flatMap(([n, fill]) => Array.from({ length: n }, () => ({ fill })));
