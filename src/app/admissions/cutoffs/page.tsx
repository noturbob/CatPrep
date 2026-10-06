import type { Metadata } from "next";
import { Bullets, DataTable, PageHeader, Part } from "@/components/ui";
import { CATEGORIES, abcMinimums, callRanges, lowestAdmits, nonIimRanges, officialMinimums, weightage } from "@/content/admissions";

export const metadata: Metadata = { title: "Admissions: weightage and cutoffs" };

// Label ink per segment: white only where it clears 4.5:1 on the fill.
const PARTS = [
  { key: "CAT", color: "var(--w-cat)", ink: "#ffffff" },
  { key: "Interview", color: "var(--w-pi)", ink: "#383838" },
  { key: "WAT/GD", color: "var(--w-wat)", ink: "#383838" },
  { key: "Profile", color: "var(--w-profile)", ink: "#383838" },
];

export default function CutoffsPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="Admissions guide, sections 3–4" title="How IIMs weigh you, and what each category needs">
        In the final selection, CAT carries only 25–30% of the weight at IIM Ahmedabad, Bangalore, Calcutta, Lucknow and
        Visakhapatnam, where the interview counts for 40–50%. At Ranchi, Rohtak, Mumbai and Udaipur, CAT carries 55–65%,
        so a high score does more of the work there.
      </PageHeader>

      <Part id="weightage" title="Final-selection weightage by IIM, sorted by CAT weight">
        <figure className="rounded-sm border-2 border-line bg-card p-5">
          <ul className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-caption">
            {PARTS.map((p) => (
              <li key={p.key} className="flex items-center gap-2">
                <span aria-hidden className="size-3 rounded-sm border border-line" style={{ background: p.color }} />
                {p.key === "Profile" ? "Profile (academics, work-ex, diversity)" : p.key === "Interview" ? "Interview (PI)" : p.key}
              </li>
            ))}
          </ul>
          <ol className="space-y-1.5">
            {weightage.map(([iim, cat, pi, wat, prof]) => (
              <li key={iim} className="grid grid-cols-[110px_1fr] items-center gap-3 sm:grid-cols-[140px_1fr]">
                <span className="truncate text-caption">{iim}</span>
                <div className="flex h-6 gap-[2px]" role="img" aria-label={`${iim}: CAT ${cat}%, interview ${pi}%${wat ? `, WAT/GD ${wat}%` : ""}, profile ${prof}%`}>
                  {[cat, pi, wat ?? 0, prof].map((v, i) =>
                    v > 0 ? (
                      <span key={i} title={`${PARTS[i].key} ${v}%`} className="flex items-center overflow-hidden rounded-sm px-1 text-[11px] font-semibold" style={{ width: `${v}%`, background: PARTS[i].color, color: PARTS[i].ink }}>
                        <span className={v < 15 ? "max-sm:hidden" : ""}>{v >= 8 ? `${v}%` : ""}</span>
                      </span>
                    ) : null,
                  )}
                </div>
              </li>
            ))}
          </ol>
          <figcaption className="mt-4 text-caption text-muted">
            Amritsar uses separate pre-interview and post-interview composite scores. Source: Cracku, IIM admission
            criteria 2026, compiled from the IIMs’ admission policies.
          </figcaption>
        </figure>
        <details className="mt-3 text-caption">
          <summary className="cursor-pointer text-muted">Show as a table</summary>
          <div className="mt-3">
            <DataTable head={["IIM", "CAT", "Interview (PI)", "WAT/GD", "Profile"]} rows={weightage.map(([a, b, c, d, e]) => [a, `${b}%`, `${c}%`, d === null ? "—" : `${d}%`, `${e}%`])} firstBold />
          </div>
        </details>
      </Part>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="The rules every IIM shares" className="">
          <Bullets items={[
            "Eligibility: a bachelor’s degree of at least three years with 50% marks (45% for SC, ST and PwD). Final-year students can apply.",
            "Reservation: NC-OBC 27%, SC 15%, ST 7.5%, EWS 10% and PwD 5% of seats, under the central government policy.",
            "Shortlisting formulas are separate from this table. Each IIM’s admission policy lists the points it gives for 10th, 12th and graduation marks, work experience and diversity before interviews.",
          ]} />
        </Part>
        <Part title="How to use this" className="">
          <Bullets items={[
            <><strong className="font-semibold">Average academics?</strong> Lean towards IIMs where CAT carries 50% or more: Ranchi, Rohtak, Mumbai, Udaipur, Trichy, Bodh Gaya.</>,
            <><strong className="font-semibold">Strong speaker?</strong> IIM Ahmedabad, Bangalore, Calcutta and Visakhapatnam put 40–50% on the interview.</>,
            <><strong className="font-semibold">Profile-heavy schools</strong> (Sirmaur 45%, Raipur 40%, Sambalpur 35%) reward academics and work experience most.</>,
          ]} />
        </Part>
      </div>

      <Part id="cutoffs" title="Three different numbers all get called “the cutoff”">
        <p className="mb-6 max-w-[70ch]">
          Plan with the practical call range in table A, not the official minimum in table B. The official minimum only
          makes you eligible; the general-category call range at the old IIMs is 99–100, and 92–98 at most newer ones.
        </p>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["Practical call range (A)", "What shortlisted candidates usually score. Use this for planning."],
            ["Official minimum (B and C)", "The eligibility floor each IIM publishes."],
            ["Lowest percentile admitted (D)", "The single lowest admit per category, from RTI replies. Usually candidates with exceptional academics or diversity points, not typical admits."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-sm border-2 border-line bg-card p-4"><p className="font-semibold">{t}</p><p className="mt-1">{d}</p></li>
          ))}
        </ol>
      </Part>

      <Part title="A. Practical call range by category (CAT percentile, expected for CAT 2026)">
        <DataTable head={["IIM", ...CATEGORIES]} rows={callRanges} firstBold caption="Source: Cracku, CAT cutoff 2026 (estimates, not official figures)." />
      </Part>

      <Part title="B. Official minimum percentile, general category (CAT 2025 cycle)">
        <DataTable head={["IIM", "VARC", "DILR", "QA", "Overall"]} rows={officialMinimums} firstBold />
        <p className="mt-4 max-w-[76ch] text-caption text-muted">
          Source: Cracku, compiled from the IIMs’ policies. At Rohtak, Raipur, Ranchi, Tiruchirappalli, Kashipur, Nagpur
          and Bodh Gaya, the published overall minimum sits at or above the low end of the call range in table A, so there
          the minimum itself is the real bar.
        </p>
      </Part>

      <Part title="C. Official minimums for every category at IIM A, B and C (2026–28 policies)">
        <DataTable head={["IIM", ...CATEGORIES]} rows={abcMinimums} firstBold caption="Overall minimum, with the VARC–DILR–QA minimums in brackets where published." />
        <p className="mt-4 max-w-[76ch] text-caption text-muted">
          Source: Cracku, Top 10 MBA colleges 2026, citing the official policies. For every other IIM and category, read
          that IIM’s admission policy for the 2027–29 batch; reserved-category minimums are always lower than the general
          ones.
        </p>
      </Part>

      <Part title="D. Lowest percentile admitted, 2025 admissions (RTI data)">
        <DataTable head={["IIM", ...CATEGORIES]} rows={lowestAdmits} firstBold caption="Source: Cracku, CAT cutoff 2026, RTI section. IIMs not listed had no 2025 RTI data there." />
        <p className="mt-4 max-w-[76ch]">
          <strong className="font-semibold">Women and non-engineers.</strong> IIMs do not publish separate cutoffs for
          them. They add diversity points inside the shortlist composite, which is a big reason the lowest general admits
          in table D sit far below the general call ranges in table A.
        </p>
      </Part>

      <Part title="E. Non-IIMs with category-wise call ranges">
        <DataTable head={["Institute", ...CATEGORIES]} rows={nonIimRanges} firstBold />
        <p className="mt-4 max-w-[76ch] text-caption text-muted">
          Source: Cracku, CAT cutoff 2026. Cracku lists SPJIMR (85–98), MDI (95–98), IMT Ghaziabad (90–96) and XIMB (91–96)
          with the same range for every category.
        </p>
      </Part>
    </main>
  );
}
