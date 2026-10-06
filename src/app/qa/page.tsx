import Link from "next/link";
import { ChapterGrid } from "@/components/chapter-grid";
import { Marquee } from "@/components/marquee";
import { Strip, cells } from "@/components/strip";
import { chapters } from "@/content/qa";

const percentiles = [
  ["99", "33", "27.1"],
  ["95", "22", "19.0"],
  ["90", "17", "14.7"],
  ["85", "13.7", "12.6"],
  ["80", "11.6", "10.4"],
];

const scenarios = [
  { line: "7 correct, 0 wrong", marks: 21, note: "About the 96th percentile in 2025, around the 94th in 2024." },
  { line: "8 correct, 2 wrong", marks: 22, note: "The 95th in 2024, about the 97th in 2025." },
  { line: "9 correct, 1 wrong", marks: 26, note: "The 97th or better in both years. This is your target.", target: true },
];

const steps = [
  "Read “Concepts” and copy the formulas onto one page (15 min).",
  "Attempt each worked example before reading its solution, then compare methods (45 min).",
  "Do the practice set timed, at about 2.5 minutes per question (25 min).",
  "Solve that chapter’s real CAT questions at 3 minutes each (60 min).",
  "Log every miss in your error log and redo it three days later.",
];

export const metadata = { title: "QA: nine right" };

export default function QaOverview() {
  return (
    <main>
      <section className="mx-auto max-w-[1200px] px-4 pb-20 pt-14 sm:px-6 lg:pt-20">
        <div>
          <h1 className="text-[clamp(30px,9vw,56px)] font-light uppercase leading-none tracking-[0.02em]">
            <span className="blur-in block">Nine right.</span>
            <span className="blur-in block [animation-delay:250ms]">One wrong, at most.</span>
          </h1>
          <p className="blur-in mt-8 max-w-[60ch] text-sub [animation-delay:500ms]">
            Your CAT 2026 quant target is 9 correct answers out of 22, about 25 marks. That cleared the 95th QA
            percentile in both 2024 and 2025. Every one of the nine comes from arithmetic and easy algebra.
          </p>

          <div className="mt-10 max-w-[720px]">
            <Strip
              label="22 questions: 9 correct, 1 wrong, 12 left alone"
              cells={cells([9, "var(--color-sky)"], [1, "var(--color-coral)"], [12, "transparent"])}
            />
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-caption">
              <Legend fill="var(--color-sky)" term="9 correct" value="+27" />
              <Legend fill="var(--color-coral)" term="1 wrong MCQ" value="−1" />
              <Legend fill="transparent" term="12 skipped" value="0" />
              <div className="font-semibold">= 26 marks</div>
            </dl>
          </div>

          <div className="mt-12 flex flex-wrap gap-6">
            <Link href="/qa/chapters" className="btn btn-primary">Open the chapters</Link>
            <Link href="/qa/strategy" className="btn btn-secondary">Read the exam-day rules</Link>
          </div>
        </div>
      </section>

      <Marquee items={chapters.map((c) => c.short)} />

      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="text-h2 font-normal">What nine correct buys you</h2>
        <p className="mt-3 max-w-[64ch] text-muted">
          Marking: +3 for a correct answer, −1 for a wrong MCQ, 0 for a wrong TITA (type-in-the-answer) or a skipped
          question.
        </p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <ul className="space-y-4">
            {scenarios.map((s) => (
              <li
                key={s.line}
                className={`rounded-sm border-2 border-line px-5 py-4 ${s.target ? "lift bg-canary text-charcoal" : "bg-card"}`}
              >
                <p className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold">{s.line}</span>
                  <span className="text-h3 font-light">{s.marks}</span>
                </p>
                <p className={`mt-1 text-caption ${s.target ? "" : "text-muted"}`}>{s.note}</p>
              </li>
            ))}
          </ul>
          <div>
            <table className="w-full border-2 border-line bg-card text-left">
              <caption className="pb-3 text-left text-caption text-muted">
                QA score needed for each percentile (scaled marks, within a few points of raw)
              </caption>
              <thead className="border-b-2 border-line text-caption">
                <tr>
                  <th className="px-4 py-2 font-semibold">Percentile</th>
                  <th className="px-4 py-2 font-semibold">CAT 2024</th>
                  <th className="px-4 py-2 font-semibold">CAT 2025 (estimate)</th>
                </tr>
              </thead>
              <tbody>
                {percentiles.map(([p, a, b]) => (
                  <tr key={p} className={`border-b border-faint last:border-0 ${p === "95" ? "bg-wash" : ""}`}>
                    <td className="px-4 py-2">{p}th</td>
                    <td className="px-4 py-2">{a}</td>
                    <td className="px-4 py-2">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-caption text-muted">
              Sectional cutoffs at most IIMs sit near the 75th–85th QA percentile for the general category, roughly
              10–14 marks. The target clears every QA cutoff with a margin.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-line bg-card">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-h2 font-normal">Where the nine come from</h2>
            <p className="mt-4 max-w-[60ch]">
              Across CAT 2021–2025, 233 of 330 QA questions (70.6%) were arithmetic or algebra. That is about 9
              arithmetic and 6–7 algebra questions in every paper: roughly 15 in your zone, of which you need 9.
            </p>
            <p className="mt-4 max-w-[60ch] text-muted">
              Geometry (about 3 a paper), number system (about 3) and P&amp;C or probability (under 1) are skipped
              unless a question looks obviously easy.
            </p>
          </div>
          <div className="self-center">
            <Strip
              label="A typical 22-question paper: about 9 arithmetic, 7 algebra, 3 geometry, 3 number system"
              cells={cells(
                [9, "var(--color-sky)"],
                [7, "var(--color-mint)"],
                [3, "var(--chalk)"],
                [3, "var(--chalk)"],
              )}
            />
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-caption">
              <Legend fill="var(--color-sky)" term="Arithmetic" value="≈ 9" />
              <Legend fill="var(--color-mint)" term="Easy algebra" value="6–7" />
              <Legend fill="var(--chalk)" term="Geometry, number system, P&C: skip" value="≈ 6" />
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="mb-10 text-h2 font-normal">The twelve chapters</h2>
            <ChapterGrid />
          </div>
          <aside className="self-start rounded-sm border-2 border-line bg-card p-6 lg:mt-20">
            <h3 className="font-semibold">How to work through a chapter</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5">
              {steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-5 text-caption text-muted">
              No chapter has anywhere near 100 real CAT questions, so volume comes from three places: the problems
              here, the real questions sorted by topic, and mocks.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Legend({ fill, term, value }: { fill: string; term: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="size-3 rounded-sm border-2 border-line" style={{ background: fill }} />
      <dt>{term}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
