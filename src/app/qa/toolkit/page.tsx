import type { Metadata } from "next";
import { FractionDrill } from "@/components/fraction-drill";

export const metadata: Metadata = { title: "Beginner’s toolkit" };

const fractions = [
  ["1/2", "50"], ["1/3", "33.33"], ["1/4", "25"], ["1/5", "20"], ["1/6", "16.67"], ["1/7", "14.29"], ["1/8", "12.5"],
  ["1/9", "11.11"], ["1/10", "10"], ["1/11", "9.09"], ["1/12", "8.33"], ["1/15", "6.67"], ["1/16", "6.25"], ["1/20", "5"],
];
const multiples = [["3/8", "37.5"], ["5/8", "62.5"], ["2/7", "28.57"], ["3/7", "42.86"], ["5/6", "83.33"], ["4/9", "44.44"], ["5/12", "41.67"]];
const factors = [["+25%", "×5/4"], ["−20%", "×4/5"], ["+12.5%", "×9/8"], ["+33.33%", "×4/3"], ["−16.67%", "×5/6"], ["+14.29%", "×8/7"]];
const powers = ["1.1² = 1.21", "1.1³ = 1.331", "1.1⁴ = 1.4641", "1.05² = 1.1025", "1.2² = 1.44", "1.2³ = 1.728", "1.08² = 1.1664", "0.9² = 0.81", "0.9³ = 0.729"];
const squares = Array.from({ length: 20 }, (_, i) => [i + 11, (i + 11) ** 2]);
const cubes = Array.from({ length: 12 }, (_, i) => [i + 1, (i + 1) ** 3]);

const methods = [
  ["Assume a convenient value", "Take 100 for percentages, the LCM of the days for work, the LCM of the times for speed."],
  ["Hold one quantity fixed", "If distance is fixed, speed and time are inversely proportional; if time is fixed, distance and speed are directly proportional. The same logic covers price × quantity and rate × time."],
  ["Write equations before calculating", "One unknown per sentence of the question, then solve."],
  ["Alligation (weighted average)", "If A (value a) and B (value b) mix to give an average m, then A : B = (b − m) : (m − a). Section 10 teaches it fully."],
  ["Use the options", "Backsolve and eliminate (see Exam day)."],
];

const mental = [
  ["Multiply by 5", "Multiply by 10, then halve. Multiply by 25: multiply by 100, then divide by 4."],
  ["Two-digit number × 11", "34 × 11 = 3 | (3 + 4) | 4 = 374."],
  ["Percent of a number by pieces", "17% of 240 = 24 (10%) + 12 (5%) + 4.8 (2%) = 40.8."],
  ["Near-square products", "49 × 51 = 50² − 1 = 2499."],
];

export default function ToolkitPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <p className="text-caption text-muted">Section 4, days 1–2</p>
      <h1 className="mt-2 text-h1 font-light">Beginner’s toolkit</h1>
      <p className="mt-4 max-w-[66ch] text-sub">
        Most CAT arithmetic is solved with five tools: fraction–percent conversions, multiplying factors, assumed
        values, the LCM trick and alligation. Make them automatic in the first two days; every later chapter leans
        on them.
      </p>

      <section className="mt-14 grid gap-12 lg:grid-cols-[1fr_440px]">
        <div>
          <h2 className="text-h3 font-normal">Fraction ↔ percentage table</h2>
          <p className="mt-2 text-muted">Memorise these.</p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {fractions.map(([f, p]) => (
              <li key={f} className="rounded-sm border-2 border-line bg-card px-3 py-2 text-center">
                <span className="block text-sub font-semibold">{f}</span>
                <span className="text-muted">{p}%</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-8 font-semibold">Also learn the multiples</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {multiples.map(([f, p]) => (
              <li key={f} className="rounded-sm border-2 border-line bg-chalk px-3 py-2 text-center">
                <span className="block font-semibold">{f}</span>
                <span className="text-muted">{p}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:pt-12">
          <FractionDrill />
        </div>
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-h3 font-normal">Multiplying factors</h2>
          <p className="mt-4">
            An increase of r% means multiply by (1 + r/100); a decrease of r% means multiply by (1 − r/100). Prefer
            fractions:
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {factors.map(([c, f]) => (
              <li key={c}><span className="font-semibold">{c}</span> = {f}</li>
            ))}
          </ul>
          <p className="mt-6">Powers that keep appearing:</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {powers.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-h3 font-normal">Squares, cubes and powers</h2>
          <h3 className="mt-4 font-semibold">Squares 11–30</h3>
          <ul className="mt-2 grid grid-cols-5 gap-1.5 text-center">
            {squares.map(([n, s]) => (
              <li key={n} className="rounded-sm border border-line bg-card py-1">
                <span className="block text-caption text-muted">{n}²</span>{s}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold">Cubes 1–12</h3>
          <ul className="mt-2 grid grid-cols-6 gap-1.5 text-center">
            {cubes.map(([n, c]) => (
              <li key={n} className="rounded-sm border border-line bg-card py-1">
                <span className="block text-caption text-muted">{n}³</span>{c}
              </li>
            ))}
          </ul>
          <p className="mt-6">2¹⁰ = 1024, 3⁵ = 243, 3⁶ = 729, 5⁴ = 625.</p>
        </div>
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-h3 font-normal">Five methods used in every chapter</h2>
          <ol className="mt-6 space-y-4">
            {methods.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-sm border-2 border-line bg-sky font-semibold text-charcoal">{i + 1}</span>
                <div><p className="font-semibold">{t}</p><p className="mt-1">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="self-start rounded-sm border-2 border-line bg-card p-6">
          <h2 className="text-h3 font-normal">Daily mental-math drill, 15 minutes</h2>
          <dl className="mt-6 space-y-4">
            {mental.map(([t, d]) => (
              <div key={t}><dt className="font-semibold">{t}</dt><dd className="mt-1">{d}</dd></div>
            ))}
          </dl>
          <p className="mt-6 rounded-sm bg-canary px-4 py-3 text-charcoal">
            Every day: 20 fraction-to-percent conversions, 20 squares, 10 successive-percentage calculations.
          </p>
        </div>
      </section>
    </main>
  );
}
