import type { Metadata } from "next";
import { ErrorLog } from "@/components/error-log";
import { Bullets, PageHeader, Part } from "@/components/ui";
import { varcLog } from "@/content/logs";
import { varcFocus } from "@/content/plan";
import { varcRoutine } from "@/content/varc";

export const metadata: Metadata = { title: "VARC: practice and error log" };

const short = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export default function VarcPracticePage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="VARC guide, section 5" title="Practice plan, reading and your VARC error log">
        An hour a day is enough: two timed passages, four VA questions and twenty minutes of long-form reading, with
        every wrong answer explained in one line.
      </PageHeader>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="Daily routine, about 1 hour" className="">
          <ol className="list-decimal space-y-3 pl-6 marker:font-semibold">
            {varcRoutine.map((r) => <li key={r}>{r}</li>)}
          </ol>
        </Part>
        <Part title="Weekly focus (same calendar as QA)" className="">
          <ol className="space-y-3">
            {varcFocus.map((f) => (
              <li key={f.from} className="grid grid-cols-[120px_1fr] gap-3">
                <span className="text-caption text-muted">{short(f.from)} – {short(f.to)}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ol>
        </Part>
      </div>

      <Part title="Where to read and practise">
        <Bullets items={[
          <><strong className="font-semibold">Real passages and VA questions:</strong> Cracku CAT previous papers, slot-wise CAT 2017–2025 papers with solutions.</>,
          <><strong className="font-semibold">Long-form essays in CAT’s register:</strong> Aeon, Psyche and The Guardian’s Long Read. Mix science, history, economics and the arts so that no topic feels foreign on exam day.</>,
        ]} />
      </Part>

      <Part title="Your VARC error log">
        <ErrorLog config={varcLog} />
        <div className="mt-8 max-w-[70ch] text-muted">
          <Bullets items={[
            "Flaw types: extreme, out of scope, distorted, half-right, misread, time (right, but too slow).",
            "Every Sunday, count your flaw types. The most frequent one becomes next week’s focus.",
            "In the last five days, read only the “Lesson in one line” column.",
          ]} />
        </div>
      </Part>

      <p className="mt-16 text-caption text-muted">
        Sources: IMS CAT 2025 overall analysis (VARC structure, passage ratings, 2025 percentile estimates); Cracku CAT
        2024 score vs percentile.
      </p>
    </main>
  );
}
