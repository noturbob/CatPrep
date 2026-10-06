import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header>
      {eyebrow && <p className="text-caption text-muted">{eyebrow}</p>}
      <h1 className="mt-2 text-h1 font-light">{title}</h1>
      {children && <div className="mt-4 max-w-[66ch] text-sub">{children}</div>}
    </header>
  );
}

export function Part({ id, title, children, className = "mt-16" }: { id?: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-6 ${className}`}>
      <h2 className="mb-5 text-h3 font-normal">{title}</h2>
      {children}
    </section>
  );
}

export function Bullets({ items, className = "space-y-2.5" }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((it, i) => (
        <li key={i} className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:size-2 before:rounded-sm before:bg-ink">
          {it}
        </li>
      ))}
    </ul>
  );
}

/** Bordered table; below 768px each row becomes a card with labelled values (see `table.stack`). */
export function DataTable({
  head, rows, caption, highlight, firstBold = false,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: ReactNode;
  highlight?: (row: number) => boolean;
  firstBold?: boolean;
}) {
  return (
    <figure>
      {caption && <figcaption className="pb-3 text-caption text-muted">{caption}</figcaption>}
      <div className="rounded-sm border-2 border-line bg-card">
        <table className="stack w-full text-left">
          <thead className="border-b-2 border-line text-caption">
            <tr>{head.map((h) => <th key={h} className="px-3 py-2 align-bottom font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-faint align-top last:border-0 ${highlight?.(i) ? "bg-wash" : ""}`}>
                {r.map((c, j) => (
                  <td key={j} data-label={head[j]} className={`px-3 py-2 ${j === 0 && firstBold ? "font-semibold" : ""}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** A 40-minute section plan as one horizontal bar plus a card per phase. */
export function MinutePlan({ phases }: { phases: { from: number; to: number; title: string; body: string }[] }) {
  const COLORS = ["var(--color-canary)", "var(--color-sky)", "var(--color-mint)", "var(--color-peach)"];
  return (
    <div className="lift rounded-sm border-2 border-line bg-card">
      <div className="flex border-b-2 border-line" aria-hidden>
        {phases.map((p, i) => (
          <div
            key={p.title}
            style={{ flexGrow: Math.max(p.to - p.from, 2.5), background: COLORS[i % COLORS.length] }}
            className="min-w-0 truncate border-r-2 border-line px-2 py-2 text-caption font-semibold text-charcoal last:border-0"
          >
            {p.from}–{p.to}
          </div>
        ))}
      </div>
      <ol className={`grid ${phases.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
        {phases.map((p, i) => (
          <li key={p.title} className="border-line p-5 max-md:border-b-2 max-md:last:border-0 md:border-r-2 md:last:border-0">
            <p className="text-caption text-muted">Minute {p.from} to {p.to}</p>
            <h3 className="mt-1 font-semibold">{i + 1}. {p.title}</h3>
            <p className="mt-2">{p.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
