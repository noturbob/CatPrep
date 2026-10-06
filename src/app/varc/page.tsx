import type { Metadata } from "next";
import Link from "next/link";
import { Strip, cells } from "@/components/strip";
import { Bullets, DataTable, MinutePlan, PageHeader, Part } from "@/components/ui";
import { choosing, format, guessing, plan40, timeTraps, varcPercentiles } from "@/content/varc";

export const metadata: Metadata = { title: "VARC: 12 correct" };

export default function VarcOverview() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="VARC guide" title="Twelve correct, one passage left alone">
        Your VARC target is 12 correct answers out of 24 with at most 4 wrong MCQs, about 32 marks. That was at or above
        the 95th VARC percentile in CAT 2024 and in every CAT 2025 slot, and you can reach it while skipping one of the
        four passages.
      </PageHeader>

      <div className="mt-12 max-w-[760px]">
        <Strip label="24 questions: 12 correct, 4 wrong, 8 left alone" cells={cells([12, "var(--color-sky)"], [4, "var(--color-coral)"], [8, "transparent"])} />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="A safe route to 12 correct" className="">
          <ol className="space-y-4">
            <li className="rounded-sm border-2 border-line bg-card px-5 py-4">
              <p className="flex justify-between gap-4"><span className="font-semibold">Three passages, 12 questions, 75% accuracy</span><span className="text-h3 font-light">24</span></p>
              <p className="mt-1 text-caption text-muted">9 correct and 3 wrong: 27 − 3 = 24 marks.</p>
            </li>
            <li className="rounded-sm border-2 border-line bg-card px-5 py-4">
              <p className="flex justify-between gap-4"><span className="font-semibold">All 8 VA questions attempted</span><span className="text-h3 font-light">+8</span></p>
              <p className="mt-1 text-caption text-muted">Even 3 correct with 1 wrong MCQ adds 9 − 1 = 8 marks.</p>
            </li>
            <li className="lift rounded-sm border-2 border-line bg-canary px-5 py-4 text-charcoal">
              <p className="flex justify-between gap-4"><span className="font-semibold">12 correct, 4 wrong MCQs</span><span className="text-h3 font-light">32</span></p>
              <p className="mt-1 text-caption">A fourth passage or a stronger VA showing is margin.</p>
            </li>
          </ol>
        </Part>
        <Part title="What the target is worth" className="">
          <DataTable
            caption="VARC score needed for each percentile"
            head={["Percentile", "CAT 2024", "CAT 2025 (initial estimates, by slot)"]}
            rows={varcPercentiles.map(([p, a, b]) => [`${p}th`, a, b])}
            highlight={(i) => i === 1}
          />
          <p className="mt-4 text-caption text-muted">Sources: Cracku (CAT 2024) and IMS (CAT 2025 initial estimates, so treat them as approximate).</p>
        </Part>
      </div>

      <Part title="The format you will face">
        <div className="max-w-[76ch]"><Bullets items={format} /></div>
      </Part>

      <Part title="Exam day: three passages, all eight VA questions">
        <p className="mb-6 max-w-[70ch]">
          Read three passages carefully, attempt all eight VA questions, and leave the hardest passage alone. Rushing
          through four passages usually costs more marks in wrong answers than it earns.
        </p>
        <MinutePlan phases={plan40} />
      </Part>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="Choosing your three passages" className="">
          <p>{choosing.context}</p>
          <dl className="mt-6 space-y-4">
            <div className="rounded-sm border-2 border-mint bg-card p-4"><dt className="font-semibold">Pick</dt><dd className="mt-1">{choosing.pick}</dd></div>
            <div className="rounded-sm border-2 border-coral bg-card p-4"><dt className="font-semibold">Leave</dt><dd className="mt-1">{choosing.leave}</dd></div>
          </dl>
        </Part>
        <div>
          <Part title="Guessing rules" className=""><Bullets items={guessing} /></Part>
          <Part title="Two time traps" className="mt-12"><Bullets items={timeTraps} /></Part>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap gap-6">
        <Link href="/varc/reading" className="btn btn-primary">Learn the reading method</Link>
        <Link href="/varc/verbal" className="btn btn-secondary">The four VA question types</Link>
      </div>
    </main>
  );
}
