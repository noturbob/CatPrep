import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Strip, cells } from "@/components/strip";
import { Bullets, DataTable, MinutePlan, PageHeader, Part } from "@/components/ui";
import { abandonRule, dilrPercentiles, inQuestions, leaveForLater, pickFirst, plan40, questionOrder, scan, why25 } from "@/content/dilr";

export const metadata: Metadata = { title: "DILR: 2.5 sets" };

export default function DilrOverview() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="DILR guide" title="Two and a half sets">
        Your DILR target is 2.5 sets: two complete sets plus two questions from a third, about 11 attempts with 9
        correct (25–27 marks). That matched the 95th DILR percentile in CAT 2024 and beat it in every CAT 2025 slot.
      </PageHeader>

      <div className="mt-12 max-w-[720px]">
        <Strip label="22 questions: 9 correct, 2 wrong, 11 left alone" cells={cells([9, "var(--color-sky)"], [2, "var(--color-coral)"], [11, "transparent"])} />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="What that means in questions" className=""><Bullets items={inQuestions} /></Part>
        <Part title="What the target is worth" className="">
          <DataTable
            caption="DILR score needed for each percentile"
            head={["Percentile", "CAT 2024", "CAT 2025 (initial estimates, by slot)"]}
            rows={dilrPercentiles.map(([p, a, b]) => [`${p}th`, a, b])}
            highlight={(i) => i === 1}
          />
          <p className="mt-4 text-caption text-muted">Sources: Cracku (CAT 2024) and IMS (CAT 2025 initial estimates, so treat them as approximate).</p>
        </Part>
      </div>

      <Part title="Why 2.5 sets is realistic">
        <div className="max-w-[76ch] space-y-4">{why25.map((p) => <p key={p}>{p}</p>)}</div>
      </Part>

      <Part title="Exam day: choose first, solve second">
        <p className="mb-6 max-w-[70ch]">
          Spend the first 5 minutes choosing, not solving. Picking the right two sets is worth more than any technique,
          and most low DILR scores come from sinking 20 minutes into one bad set.
        </p>
        <MinutePlan phases={plan40} />
      </Part>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-sm border-2 border-mint bg-card p-6">
          <h3 className="font-semibold">Pick first</h3>
          <div className="mt-4"><Bullets items={pickFirst} /></div>
        </div>
        <div className="rounded-sm border-2 border-coral bg-card p-6">
          <h3 className="font-semibold">Leave for later</h3>
          <div className="mt-4"><Bullets items={leaveForLater} /></div>
        </div>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="The abandon rule" className="">
          <p className="rounded-sm border-2 border-charcoal bg-canary p-5 text-sub text-charcoal">{abandonRule}</p>
        </Part>
        <Part title="Order of questions inside a set" className=""><Bullets items={questionOrder} /></Part>
      </div>

      <Part id="scan" title="Worked example: ranking five sets in five minutes">
        <p className="mb-6 text-muted">These are the kinds of opening lines you see when you open a DILR section. Rank the five sets before opening the answer.</p>
        <dl className="grid gap-4 md:grid-cols-2">
          {scan.sets.map(([name, body]) => (
            <div key={name} className="rounded-sm border-2 border-line bg-card p-4">
              <dt className="font-semibold">{name}</dt>
              <dd className="mt-1">{body}</dd>
            </div>
          ))}
        </dl>
        <Reveal label="ranking and why">
          <ol className="list-decimal space-y-2 pl-6">
            {scan.ranking.map(([t, d]) => <li key={t}><strong className="font-semibold">{t}.</strong> {d}</li>)}
          </ol>
          <p className="mt-4"><strong className="font-semibold">Takeaway.</strong> {scan.takeaway}</p>
        </Reveal>
      </Part>

      <div className="mt-16 flex flex-wrap gap-6">
        <Link href="/dilr/method" className="btn btn-primary">The five-step method</Link>
        <Link href="/dilr/sets" className="btn btn-secondary">Open the worked sets</Link>
      </div>
    </main>
  );
}
