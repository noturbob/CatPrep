import { barData, scatterData } from "@/content/dilr";

// Series colours validated with the dataviz palette checker: light and dark steps differ,
// CVD separation ≥ 17. Bars carry value labels and a border, which is the relief the
// contrast warning asks for — reading exact values is the point of a DI chart anyway.
// Colours live in globals.css as --bar-r24 / --bar-r25 / --bar-p25.
const SERIES = [
  { key: "r24", label: "Revenue 2024" },
  { key: "r25", label: "Revenue 2025" },
  { key: "p25", label: "Profit 2025" },
] as const;

/** Grouped horizontal bars: fits any width without scrolling, and every value is labelled. */
export function BarChart() {
  const max = 220;
  return (
    <figure className="rounded-sm border-2 border-line bg-card p-4 sm:p-5">
      <figcaption className="mb-3">
        <span className="font-semibold">Five companies: revenue in 2024 and 2025, and profit in 2025</span>
        <span className="block text-caption text-muted">All values in ₹ crore. Original practice data.</span>
      </figcaption>
      <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-caption">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span aria-hidden className="size-3 rounded-sm border border-line" style={{ background: `var(--bar-${s.key})` }} />
            {s.label}
          </li>
        ))}
      </ul>
      <ol className="space-y-4">
        {barData.map((d) => (
          <li key={d.name} className="grid gap-2 sm:grid-cols-[80px_1fr] sm:gap-4">
            <span className="font-semibold sm:pt-0.5">{d.name}</span>
            <div className="space-y-[2px] border-l-2 border-line">
              {SERIES.map((s) => (
                // The track stops 40px short of the edge so the value label always has room.
                <div key={s.key} className="pr-10" title={`${d.name}, ${s.label}: ₹${d[s.key]} crore`}>
                  <div className="relative h-4">
                    <span
                      className="block h-full min-w-[3px] rounded-r-sm border border-l-0 border-line"
                      style={{ width: `${(d[s.key] / max) * 100}%`, background: `var(--bar-${s.key})` }}
                      role="img"
                      aria-label={`${s.label} ${d[s.key]}`}
                    />
                    <span className="absolute top-1/2 ml-2 -translate-y-1/2 text-caption leading-none" style={{ left: `${(d[s.key] / max) * 100}%` }}>
                      {d[s.key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <details className="mt-4 text-caption">
        <summary className="cursor-pointer text-muted">Show as a table</summary>
        <table className="mt-2 w-full text-left">
          <thead><tr><th className="py-1">Company</th>{SERIES.map((s) => <th key={s.key} className="py-1">{s.label}</th>)}</tr></thead>
          <tbody>{barData.map((d) => <tr key={d.name}><td className="py-1">{d.name}</td><td>{d.r24}</td><td>{d.r25}</td><td>{d.p25}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}

export function ScatterPlot() {
  const S = 360, pad = 40, max = 50;
  const k = (S - 2 * pad) / max;
  const px = (v: number) => pad + v * k;
  const py = (v: number) => S - pad - v * k;
  const ticks = [0, 10, 20, 30, 40, 50];

  return (
    <figure className="rounded-sm border-2 border-line bg-card p-4 sm:p-5">
      <figcaption className="mb-3">
        <span className="font-semibold">Ten students: Test 1 score (across) against Test 2 score (up)</span>
        <span className="block text-caption text-muted">Both tests are out of 50. Points above the dashed line improved in Test 2. Original practice data.</span>
      </figcaption>
      <svg viewBox={`0 0 ${S + 60} ${S}`} className="w-full max-w-[520px]" role="img" aria-label="Scatter plot of Test 1 against Test 2 scores for students A to J; coordinates are labelled on each point">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={px(t)} x2={px(t)} y1={py(0)} y2={py(max)} stroke="var(--faint)" strokeWidth="1" />
            <line x1={px(0)} x2={px(max)} y1={py(t)} y2={py(t)} stroke="var(--faint)" strokeWidth="1" />
            <text x={px(t)} y={py(0) + 16} textAnchor="middle" fontSize="11" fill="var(--muted)">{t}</text>
            <text x={px(0) - 8} y={py(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{t}</text>
          </g>
        ))}
        <line x1={px(0)} y1={py(0)} x2={px(max)} y2={py(max)} stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={px(max) + 4} y={py(max) + 14} fontSize="10" fill="var(--muted)">same score</text>
        {scatterData.map(([name, a, b]) => (
          <g key={name}>
            <circle cx={px(a)} cy={py(b)} r="5.5" fill="var(--color-sky)" stroke="var(--line)" strokeWidth="1.5">
              <title>{`${name}: Test 1 ${a}, Test 2 ${b}`}</title>
            </circle>
            <text
              x={b > a ? px(a) - 9 : px(a) + 9}
              y={py(b) + 4}
              textAnchor={b > a ? "end" : "start"}
              fontSize="12"
              fontWeight="600"
              fill="var(--ink)"
            >
              {name} ({a}, {b})
            </text>
          </g>
        ))}
        <text x={px(25)} y={S - 4} textAnchor="middle" fontSize="11" fill="var(--muted)">Test 1 score</text>
      </svg>
    </figure>
  );
}
