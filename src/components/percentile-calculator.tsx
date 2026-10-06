"use client";

import { useState } from "react";
import { curves, percentileFor, type Curve, type CurvePanel, type Reading } from "@/content/admissions";

const show = (r: Reading) =>
  r.kind === "at" ? `${r.p.toFixed(1)}` : r.kind === "above" ? "99+" : `below ${r.floor}`;

/** Score → percentile from the guide's 2024 results and 2025 estimates, with the curves drawn. */
export function PercentileCalculator() {
  const [scores, setScores] = useState({ VARC: "32", DILR: "26", QA: "25" });
  const nums = Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, parseFloat(v)])) as Record<string, number>;
  const valid = Object.values(nums).every((n) => Number.isFinite(n));
  const total = valid ? nums.VARC + nums.DILR + nums.QA : NaN;
  const scoreOf = (name: string) => (name === "Overall" ? total : nums[name]);

  return (
    <div className="space-y-8">
      <div className="lift rounded-sm border-2 border-line bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {(["VARC", "DILR", "QA"] as const).map((k) => (
            <label key={k} className="space-y-1">
              <span className="text-caption text-muted">{k} score</span>
              <input
                inputMode="decimal"
                value={scores[k]}
                onChange={(e) => setScores({ ...scores, [k]: e.target.value })}
                className="w-full rounded-sm border-2 border-line bg-card px-3 py-2 text-sub focus:border-sky focus:outline-none"
              />
            </label>
          ))}
          <div className="space-y-1">
            <span className="text-caption text-muted">Total</span>
            <p className="rounded-sm border-2 border-line bg-chalk px-3 py-2 text-sub font-semibold">{valid ? +total.toFixed(1) : "—"}</p>
          </div>
        </div>

        <table className="mt-6 w-full text-left" aria-live="polite">
          <thead className="border-b-2 border-line text-caption">
            <tr><th className="py-2 font-semibold">Section</th><th className="py-2 font-semibold">Score</th><th className="py-2 font-semibold">%ile, 2024</th><th className="py-2 font-semibold">2025 est.</th></tr>
          </thead>
          <tbody>
            {curves.map((c) => {
              const s = scoreOf(c.name);
              return (
                <tr key={c.name} className={`border-b border-faint last:border-0 ${c.name === "Overall" ? "font-semibold" : ""}`}>
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{Number.isFinite(s) ? +s.toFixed(1) : "—"}</td>
                  <td className="py-2">{Number.isFinite(s) ? show(percentileFor(c.y2024, s)) : "—"}</td>
                  <td className="py-2">{Number.isFinite(s) ? show(percentileFor(c.y2025, s)) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-4 text-caption text-muted">
          Scores are scaled marks (+3 correct, −1 wrong MCQ, then slot normalisation); raw marks usually land within a few
          marks of them. Percentiles between the guide’s data points are interpolated in a straight line.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {curves.map((c) => <Panel key={c.name} c={c} score={scoreOf(c.name)} />)}
      </div>
      <ul className="flex flex-wrap gap-x-8 gap-y-2 text-caption">
        <li className="flex items-center gap-2"><svg width="24" height="10" aria-hidden><line x1="0" y1="5" x2="24" y2="5" stroke="var(--ink)" strokeWidth="2" /><circle cx="12" cy="5" r="3.5" fill="var(--ink)" /></svg>CAT 2024 results</li>
        <li className="flex items-center gap-2"><svg width="24" height="10" aria-hidden><line x1="0" y1="5" x2="24" y2="5" stroke="var(--color-sky)" strokeWidth="2" strokeDasharray="4 3" /><circle cx="12" cy="5" r="3.5" fill="var(--card)" stroke="var(--color-sky)" strokeWidth="2" /></svg>CAT 2025 initial estimates</li>
        <li className="flex items-center gap-2"><span className="inline-block h-3 w-0.5 bg-coral" aria-hidden />Your score</li>
        <li className="flex items-center gap-2"><span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-muted" aria-hidden />95th percentile</li>
      </ul>
    </div>
  );
}

function Panel({ c, score }: { c: CurvePanel; score: number }) {
  const W = 300, H = 180, l = 30, r = 10, t = 10, b = 26;
  const xmax = c.name === "Overall" ? 130 : 60;
  const x = (s: number) => l + (Math.min(s, xmax) / xmax) * (W - l - r);
  const y = (p: number) => t + ((100 - p) / 25) * (H - t - b);
  const path = (cv: Curve) => cv.map(([s, p], i) => `${i ? "L" : "M"}${x(s)},${y(p)}`).join("");
  const xticks = c.name === "Overall" ? [0, 40, 80, 120] : [0, 20, 40, 60];

  return (
    <figure className="rounded-sm border-2 border-line bg-card p-4">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{c.name}</span>
        {c.note && <span className="text-caption text-muted">{c.note}</span>}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label={`${c.name}: percentile against scaled score, 2024 and 2025`}>
        {[75, 80, 85, 90, 95, 99].map((p) => (
          <g key={p}>
            <line x1={l} x2={W - r} y1={y(p)} y2={y(p)} stroke={p === 95 ? "var(--muted)" : "var(--faint)"} strokeDasharray={p === 95 ? "4 3" : undefined} strokeWidth="1" />
            <text x={l - 6} y={y(p) + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{p}</text>
          </g>
        ))}
        {xticks.map((s) => <text key={s} x={x(s)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">{s}</text>)}
        <path d={path(c.y2024)} fill="none" stroke="var(--ink)" strokeWidth="2" />
        <path d={path(c.y2025)} fill="none" stroke="var(--color-sky)" strokeWidth="2" strokeDasharray="4 3" />
        {c.y2024.map(([s, p]) => (
          <circle key={`a${s}`} cx={x(s)} cy={y(p)} r="3.5" fill="var(--ink)"><title>{`2024: score ${s} → ${p}th`}</title></circle>
        ))}
        {c.y2025.map(([s, p]) => (
          <circle key={`b${s}`} cx={x(s)} cy={y(p)} r="3.5" fill="var(--card)" stroke="var(--color-sky)" strokeWidth="2"><title>{`2025 estimate: score ${s} → ${p}th`}</title></circle>
        ))}
        {Number.isFinite(score) && score >= 0 && (
          <line x1={x(score)} x2={x(score)} y1={t} y2={H - b} stroke="var(--color-coral)" strokeWidth="2" />
        )}
      </svg>
    </figure>
  );
}
