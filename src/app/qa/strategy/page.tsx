import type { Metadata } from "next";

export const metadata: Metadata = { title: "Exam day: 40 minutes, two rounds" };

const format = [
  "22 questions in 40 minutes on a sectional timer. QA comes last, after VARC and DILR, so you will be tired: always take QA last in mocks too.",
  "In CAT 2025 the QA section had 14 MCQs and 8 TITAs.",
  "A basic on-screen calculator is available. It is mouse-driven and slow, so use it only for ugly multiplications.",
];

const rounds = [
  { from: 0, to: 20, color: "var(--color-sky)", title: "Round 1: pick the easy ones",
    body: "Go through all 22 in order. Read the question and its final ask; if it is arithmetic or easy algebra and you see the method within 30 seconds, solve it. Otherwise mark it for review and move on. Expect 6–8 solved." },
  { from: 20, to: 36, color: "var(--color-mint)", title: "Round 2: the familiar leftovers",
    body: "Return to marked questions you recognised but parked for time. Attempt the 3–4 most familiar, using the options where possible." },
  { from: 36, to: 40, color: "var(--color-canary)", title: "Last 4 minutes: TITA cleanup",
    body: "Enter your best reasoned answer in any TITA you worked on, since a wrong TITA costs nothing. Do not blind-guess MCQs." },
];

const rules = [
  ["The 2-minute check", "If you have no equation written after 2 minutes, skip. You can come back in Round 2."],
  ["Skip on sight", "Unless it is a one-line giveaway: geometry with a busy figure, permutations and combinations, remainders of huge powers, function graphs."],
  ["MCQ guessing", "A random guess among 4 options is worth zero on average (0.25 × 3 − 0.75 × 1 = 0). With 2 options left it is worth +1 on average, so guess only after eliminating two."],
  ["Verify before you click", "Plug your answer back into the question (10 seconds). Accuracy is the whole game at a 9-correct target."],
];

const options = [
  ["Backsolving", "Substitute each option into the question, starting with the middle value, so the result tells you to go higher or lower."],
  ["Elimination", "Reject options with the wrong unit digit, the wrong parity (odd/even) or an impossible size."],
  ["Assume values", "When the answer is a percentage or a ratio, set the unknown base to 100 (or an LCM) and work with real numbers."],
];

const metrics = [
  ["QA attempts", "10–12"],
  ["Accuracy", "85% or higher"],
  ["Wrong MCQs", "2 or fewer"],
  ["Easy questions you skipped (found in analysis)", "1 or fewer"],
  ["Questions where you spent over 4 minutes", "0"],
];

export default function StrategyPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <h1 className="text-h1 font-light">Exam day: 40 minutes, two rounds</h1>
      <p className="mt-4 max-w-[64ch] text-sub">
        Attempt 10–12 questions in two passes and never spend more than 3 minutes on one. Your score comes from
        choosing well, not from solving everything.
      </p>

      <section className="mt-14">
        <h2 className="sr-only">The two-round plan</h2>
        <div className="lift rounded-sm border-2 border-line bg-card">
          <div className="flex border-b-2 border-line" aria-hidden>
            {rounds.map((r) => (
              <div key={r.title} style={{ flexGrow: r.to - r.from, background: r.color }} className="border-r-2 border-line px-3 py-2 text-caption font-semibold text-charcoal last:border-0">
                {r.from}–{r.to} min
              </div>
            ))}
          </div>
          <ol className="grid md:grid-cols-3">
            {rounds.map((r, i) => (
              <li key={r.title} className="border-line p-6 max-md:border-b-2 max-md:last:border-0 md:border-r-2 md:last:border-0">
                <p className="text-caption text-muted">Minute {r.from} to {r.to}</p>
                <h3 className="mt-1 font-semibold">{i + 1}. {r.title}</h3>
                <p className="mt-3">{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-h3 font-normal">Decision rules</h2>
          <dl className="mt-6 space-y-5">
            {rules.map(([t, d]) => (
              <div key={t}>
                <dt className="font-semibold">{t}</dt>
                <dd className="mt-1">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-h3 font-normal">The format you will face</h2>
          <ul className="mt-6 space-y-3">
            {format.map((f) => (
              <li key={f} className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:size-2 before:rounded-sm before:bg-ink">{f}</li>
            ))}
          </ul>
          <h2 className="mt-12 text-h3 font-normal">Three ways to use the options</h2>
          <dl className="mt-6 space-y-5">
            {options.map(([t, d]) => (
              <div key={t}>
                <dt className="font-semibold">{t}</dt>
                <dd className="mt-1">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-h3 font-normal">What to track in every mock</h2>
        <table className="mt-6 w-full max-w-[760px] border-2 border-line bg-card text-left">
          <thead className="border-b-2 border-line text-caption">
            <tr>
              <th className="px-4 py-2 font-semibold">Metric</th>
              <th className="px-4 py-2 font-semibold">Target by mid-November</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map(([m, t]) => (
              <tr key={m} className="border-b border-faint last:border-0">
                <td className="px-4 py-2.5">{m}</td>
                <td className="px-4 py-2.5 font-semibold">{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
