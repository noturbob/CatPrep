import type { Metadata } from "next";
import { PhaseChart } from "@/components/phase-chart";
import { WeekChecklist } from "@/components/week-checklist";
import { dilrFocus, varcFocus, type Focus } from "@/content/plan";

export const metadata: Metadata = { title: "The 55-day plan" };

const routine = [
  [15, "Mental-math drill", "Toolkit"],
  [45, "The day’s chapter: concepts and worked examples, attempting each example before reading its solution", ""],
  [25, "The chapter’s practice set, timed", ""],
  [60, "That chapter’s real CAT questions, 3 minutes each", ""],
  [20, "Error log and tomorrow’s redo list", ""],
] as const;

const analyse = [
  "Re-solve, untimed, every QA question in your topic list that you skipped. Any you crack in under 3 minutes is a “missed easy”; log it.",
  "Tag every wrong answer with a mistake type (concept, misread, calculation, time, selection).",
  "Compare attempts, accuracy and time per question with the exam-day targets.",
  "Pick the two weakest patterns and schedule them for the next three days.",
];

export default function PlanPage() {
  const total = routine.reduce((s, [m]) => s + m, 0);
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <h1 className="text-h1 font-light">The 55-day plan, 5 October to 28 November</h1>
      <p className="mt-4 max-w-[66ch] text-sub">
        Learn all twelve chapters by 31 October, then spend November on real CAT questions and twelve full mocks.
        The last two days are revision only.
      </p>

      <div className="mt-12">
        <PhaseChart />
      </div>

      <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-h3 font-normal">Daily routine on study days</h2>
          <p className="mt-2 text-muted">About 2¾ hours of QA. Keep VARC and DILR practice running alongside.</p>
          <div className="mt-6 flex h-4 overflow-hidden rounded-sm border-2 border-line" aria-hidden>
            {routine.map(([m], i) => (
              <span
                key={i}
                style={{ flexGrow: m, background: ["var(--color-canary)", "var(--color-sky)", "var(--color-mint)", "var(--color-periwinkle)", "var(--color-coral)"][i] }}
                className="border-r-2 border-line last:border-0"
              />
            ))}
          </div>
          <ol className="mt-6 space-y-3">
            {routine.map(([m, what]) => (
              <li key={what} className="flex gap-4">
                <span className="w-16 shrink-0 font-semibold">{m} min</span>
                <span>{what}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-caption text-muted">{total} minutes in all.</p>
        </div>
        <div id="analyse" className="scroll-mt-6 rounded-sm border-2 border-line bg-card p-6">
          <h2 className="text-h3 font-normal">How to analyse a mock</h2>
          <p className="mt-2 text-muted">Same day, 2–3 hours.</p>
          <ol className="mt-6 list-decimal space-y-3 pl-5">
            {analyse.map((a) => <li key={a}>{a}</li>)}
          </ol>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-h3 font-normal">VARC and DILR, on the same calendar</h2>
        <p className="mt-2 max-w-[66ch] text-muted">
          About an hour each a day, alongside the QA plan. Mocks follow the QA calendar above.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <FocusList title="VARC weekly focus" items={varcFocus} />
          <FocusList title="DILR weekly focus" items={dilrFocus} />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-h3 font-normal">Week-by-week checklist (QA)</h2>
        <p className="mt-2 text-muted">Ticks are saved in this browser.</p>
        <div className="mt-8">
          <WeekChecklist />
        </div>
      </section>
    </main>
  );
}

const short = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

function FocusList({ title, items }: { title: string; items: Focus[] }) {
  return (
    <div className="rounded-sm border-2 border-line bg-card p-5">
      <h3 className="font-semibold">{title}</h3>
      <ol className="mt-4 space-y-3">
        {items.map((f) => (
          <li key={f.from} className="grid grid-cols-[120px_1fr] gap-3">
            <span className="text-caption text-muted">{short(f.from)} – {short(f.to)}</span>
            <span>{f.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
