import type { Metadata } from "next";
import { ErrorLog } from "@/components/error-log";
import { PageHeader, Part } from "@/components/ui";
import { dilrRoutine, dilrSources, selectionDrill } from "@/content/dilr";
import { dilrLog } from "@/content/logs";
import { dilrFocus } from "@/content/plan";

export const metadata: Metadata = { title: "DILR: practice and error log" };

const short = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export default function DilrPracticePage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="DILR guide, section 12" title="Practice plan, real CAT sets and your DILR error log">
        Two timed sets a day from real CAT papers, with as much time spent analysing each set as solving it, is enough
        to reach 2.5 sets by late November. Selection gets its own drill from Week 3.
      </PageHeader>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="Daily routine, about 1 hour" className="">
          <ol className="list-decimal space-y-3 pl-6 marker:font-semibold">{dilrRoutine.map((r) => <li key={r}>{r}</li>)}</ol>
        </Part>
        <Part title="Weekly focus (same calendar as QA)" className="">
          <ol className="space-y-3">
            {dilrFocus.map((f) => (
              <li key={f.from} className="grid grid-cols-[120px_1fr] gap-3">
                <span className="text-caption text-muted">{short(f.from)} – {short(f.to)}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ol>
        </Part>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="The selection drill (twice a week from Week 3)" className="">
          <ol className="list-decimal space-y-3 pl-6 marker:font-semibold">{selectionDrill.map((r) => <li key={r}>{r}</li>)}</ol>
        </Part>
        <Part title="Where to get real CAT DILR sets" className="">
          <dl className="space-y-4">
            {dilrSources.map(([t, d]) => (
              <div key={t}><dt className="font-semibold">{t}</dt><dd className="mt-1">{d}</dd></div>
            ))}
          </dl>
        </Part>
      </div>

      <Part title="Your DILR error log">
        <ErrorLog config={dilrLog} />
        <p className="mt-8 max-w-[70ch] text-muted">
          Causes: missed rule, wrong case (a case dropped too early), misread question, calculation, bad pick (should
          have skipped the set). In the last five days, read only the “Lesson in one line” column.
        </p>
      </Part>

      <p className="mt-16 text-caption text-muted">
        Sources: IMS CAT 2025 overall analysis (DILR structure, set names, difficulty ratings, 2025 percentile
        estimates); Cracku CAT 2024 score vs percentile.
      </p>
    </main>
  );
}
