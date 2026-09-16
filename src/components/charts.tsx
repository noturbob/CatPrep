import { cn } from '@/lib/utils';

/** Sequential ramp for accuracy. Single hue, monotonic lightness. */
export function accuracyFill(pct: number): string {
  if (pct >= 85) return 'var(--color-seq-5)';
  if (pct >= 70) return 'var(--color-seq-4)';
  if (pct >= 55) return 'var(--color-seq-3)';
  if (pct >= 40) return 'var(--color-seq-2)';
  return 'var(--color-seq-1)';
}

/**
 * The range row — this interface's one recurring device.
 *
 * Every quantity in CAT prep is a position relative to a target, so no
 * number is shown on its own: the track is the possible span, the fill is
 * where you are, and the tick is where you need to be.
 */
export function Range({
  label, value, max, target, fill, valueLabel, meta, targetLabel, tone = 'neutral',
}: {
  label: string;
  value: number;
  max: number;
  /** position of the target marker on the same scale as `value` */
  target?: number;
  fill?: string;
  valueLabel: string;
  meta?: string;
  targetLabel?: string;
  tone?: 'neutral' | 'ok' | 'bad';
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const tPct = target !== undefined && max > 0
    ? Math.min(100, Math.max(0, (target / max) * 100)) : null;

  return (
    <div className="py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-[13px] text-fg">{label}</span>
        <span className={cn('nums shrink-0 text-[13px]',
          tone === 'ok' && 'text-ok', tone === 'bad' && 'text-bad',
          tone === 'neutral' && 'text-fg')}>
          {valueLabel}
        </span>
      </div>

      <div className="relative mt-2 h-[5px] w-full rounded-[1px] bg-panel-2">
        <div
          className="absolute inset-y-0 left-0 rounded-[1px] transition-[width] duration-300"
          style={{ width: `${pct}%`, background: fill ?? 'var(--color-seq-4)' }}
        />
        {tPct !== null && (
          <span
            aria-hidden
            className="absolute -top-[3px] bottom-[-3px] w-px bg-accent"
            style={{ left: `${tPct}%` }}
          />
        )}
      </div>

      {(meta || targetLabel) && (
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[11px] text-faint">{meta}</span>
          {targetLabel && (
            <span className="nums text-[11px] text-accent">{targetLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * A figure with the context needed to read it. `against` is not decoration —
 * a number without its target is not information here.
 */
export function Figure({
  label, value, against, tone = 'neutral', size = 'md',
}: {
  label: string;
  value: string;
  against?: string;
  tone?: 'neutral' | 'ok' | 'bad' | 'signal';
  size?: 'md' | 'lg';
}) {
  return (
    <div>
      <p className="text-[12px] text-muted">{label}</p>
      <p className={cn('nums mt-1.5 leading-none',
        size === 'lg' ? 'text-[26px] font-light' : 'text-[19px] font-normal',
        tone === 'ok' && 'text-ok', tone === 'bad' && 'text-bad',
        tone === 'signal' && 'text-accent', tone === 'neutral' && 'text-fg')}>
        {value}
      </p>
      {against && <p className="mt-1.5 text-[11px] text-faint">{against}</p>}
    </div>
  );
}

/** Multi-series line chart with direct end labels and a single axis. */
export function TrendChart({
  series, height = 170, yMax = 100, yLabel,
}: {
  series: { name: string; color: string; points: { x: number; y: number }[] }[];
  height?: number; yMax?: number; yLabel?: string;
}) {
  const W = 560, H = height, PAD_L = 30, PAD_R = 54, PAD_T = 10, PAD_B = 20;
  const allX = series.flatMap((s) => s.points.map((p) => p.x));
  if (allX.length === 0) return null;
  const minX = Math.min(...allX), maxX = Math.max(...allX);
  const sx = (x: number) => PAD_L + (maxX === minX ? 0 : ((x - minX) / (maxX - minX)) * (W - PAD_L - PAD_R));
  const sy = (y: number) => PAD_T + (1 - y / yMax) * (H - PAD_T - PAD_B);
  const ticks = [0, 50, 90, 95, 100].filter((t) => t <= yMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label={`${yLabel ?? 'Trend'} over time for ${series.map((s) => s.name).join(', ')}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD_L} x2={W - PAD_R} y1={sy(t)} y2={sy(t)}
            stroke={t === 95 ? 'var(--color-accent)' : 'var(--color-border)'}
            strokeWidth="1" strokeDasharray={t === 95 ? '3 3' : undefined} />
          <text x={PAD_L - 6} y={sy(t) + 3} textAnchor="end"
            fill={t === 95 ? 'var(--color-accent)' : 'var(--color-faint)'}
            fontSize="9" fontFamily="var(--font-mono)">{t}</text>
        </g>
      ))}
      {series.map((s) => {
        if (s.points.length === 0) return null;
        const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x)},${sy(p.y)}`).join(' ');
        const last = s.points[s.points.length - 1];
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((p, i) => (
              <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r="3.5" fill={s.color}
                stroke="var(--color-panel)" strokeWidth="2" />
            ))}
            <text x={sx(last.x) + 8} y={sy(last.y) + 3} fill="var(--color-muted)"
              fontSize="10">{s.name}</text>
          </g>
        );
      })}
    </svg>
  );
}
