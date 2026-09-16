import { cn } from '@/lib/utils';

/** Sequential ramp for accuracy. Single hue, monotonic lightness. */
export function accuracyFill(pct: number): string {
  if (pct >= 85) return 'var(--color-seq-5)';
  if (pct >= 70) return 'var(--color-seq-4)';
  if (pct >= 55) return 'var(--color-seq-3)';
  if (pct >= 40) return 'var(--color-seq-2)';
  return 'var(--color-seq-1)';
}

export function StatTile({
  label, value, sub, tone = 'default',
}: { label: string; value: string; sub?: string; tone?: 'default' | 'ok' | 'bad' | 'accent' }) {
  return (
    <div className="rounded border border-border bg-panel px-3 py-2.5">
      <p className="text-[11px] text-faint">{label}</p>
      <p className={cn('nums mt-1 text-[20px] font-semibold leading-none',
        tone === 'ok' && 'text-ok', tone === 'bad' && 'text-bad',
        tone === 'accent' && 'text-accent', tone === 'default' && 'text-fg')}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[11px] text-faint">{sub}</p>}
    </div>
  );
}

/**
 * Horizontal bar with the value printed at the end of the bar — the direct
 * label the palette validator requires as secondary encoding.
 */
export function BarRow({
  label, value, max, fill, valueLabel, meta, warn,
}: {
  label: string; value: number; max: number; fill: string;
  valueLabel: string; meta?: string; warn?: boolean;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 py-1">
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[12px] text-fg">{label}</span>
          {meta && <span className="nums shrink-0 text-[11px] text-faint">{meta}</span>}
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-[3px] bg-panel-2">
          <div
            className="h-full rounded-[3px]"
            style={{ width: `${pct}%`, background: fill }}
          />
        </div>
      </div>
      <span className={cn('nums w-14 text-right text-[12px]', warn ? 'text-bad' : 'text-fg')}>
        {valueLabel}
      </span>
    </div>
  );
}

/** Multi-series line chart with direct end labels and no dual axis. */
export function TrendChart({
  series, height = 160, yMax = 100, yLabel,
}: {
  series: { name: string; color: string; points: { x: number; y: number }[] }[];
  height?: number; yMax?: number; yLabel?: string;
}) {
  const W = 560, H = height, PAD_L = 34, PAD_R = 56, PAD_T = 12, PAD_B = 22;
  const allX = series.flatMap((s) => s.points.map((p) => p.x));
  if (allX.length === 0) return null;
  const minX = Math.min(...allX), maxX = Math.max(...allX);
  const sx = (x: number) => PAD_L + (maxX === minX ? 0 : ((x - minX) / (maxX - minX)) * (W - PAD_L - PAD_R));
  const sy = (y: number) => PAD_T + (1 - y / yMax) * (H - PAD_T - PAD_B);

  const ticks = [0, 25, 50, 75, 100].filter((t) => t <= yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`${yLabel ?? 'Trend'} over time for ${series.map((s) => s.name).join(', ')}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD_L} x2={W - PAD_R} y1={sy(t)} y2={sy(t)} stroke="var(--color-border)" strokeWidth="1" />
          <text x={PAD_L - 6} y={sy(t) + 3} textAnchor="end" fill="var(--color-faint)" fontSize="9">{t}</text>
        </g>
      ))}
      {series.map((s) => {
        if (s.points.length === 0) return null;
        const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x)},${sy(p.y)}`).join(' ');
        const last = s.points[s.points.length - 1];
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((p, i) => (
              <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="3.5" fill={s.color}
                stroke="var(--color-panel)" strokeWidth="2" />
            ))}
            {/* direct label — required secondary encoding for this palette */}
            <text x={sx(last.x) + 8} y={sy(last.y) + 3} fill="var(--color-muted)" fontSize="10">
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
