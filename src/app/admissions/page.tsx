import type { Metadata } from "next";
import { PercentileCalculator } from "@/components/percentile-calculator";
import { Bullets, PageHeader, Part } from "@/components/ui";
import { stages } from "@/content/admissions";

export const metadata: Metadata = { title: "Admissions: score to percentile" };

export default function AdmissionsPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="Admissions guide" title="From CAT score to an offer">
        If you hit the 95th percentile in all three sections, your total (about 78–80 marks) lands near the 97th–98th
        percentile overall. That puts the newer IIMs, MDI, the IIT B-schools and many strong non-IIMs in range; the old
        IIMs (A, B, C) usually call general candidates at 99+.
      </PageHeader>

      <Part title="The five stages, from CAT score to offer">
        <ol className="grid gap-4 md:grid-cols-5">
          {stages.map((s, i) => (
            <li key={s.title} className="rounded-sm border-2 border-line bg-card p-4">
              <span className="grid size-7 place-items-center rounded-sm border-2 border-line bg-sky font-semibold text-charcoal">{i + 1}</span>
              <p className="mt-3 font-semibold">{s.title}</p>
              <p className="mt-1">{s.body}</p>
            </li>
          ))}
        </ol>
      </Part>

      <Part title="What this means for a general-category non-engineer">
        <div className="max-w-[76ch]">
          <Bullets items={[
            "Non-engineers and women receive diversity credit at several schools, so they often get calls at lower percentiles than general engineer males with similar academics.",
            "One coaching estimate for IIM Kozhikode puts the call range at 99.5–99.9 for general engineer males but about 99–99.1 for general non-engineer males with strong Class 12 marks (iQuanta). Treat such profile figures as rough guides; IIMs do not publish them.",
            "Your 10th, 12th and graduation marks move your call chances as much as a point of percentile does. Check each target IIM’s academic weightage before deciding where to apply.",
          ]} />
        </div>
      </Part>

      <Part id="calculator" title="Percentile calculator: score vs percentile">
        <p className="mb-6 max-w-[70ch]">
          Enter mock scores to convert them. In both years the 95th percentile sat near 30 in VARC, 24–27 in DILR, 22–23
          in QA and 67–70 marks overall.
        </p>
        <PercentileCalculator />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Scaled, not raw.", "These are scaled scores after slot normalisation. Your raw marks (+3 per correct, −1 per wrong MCQ) usually land within a few marks of them."],
            ["Overall uses your total.", "Add your three section scores and read the Overall row, not an average of section percentiles."],
            ["2025 figures are initial estimates.", "IMS published them slot by slot on exam day; the 2024 curve comes from actual results."],
          ].map(([t, d]) => (
            <p key={t} className="rounded-sm border-2 border-line bg-card p-4"><strong className="font-semibold">{t}</strong> {d}</p>
          ))}
        </div>
        <p className="mt-6 max-w-[70ch] rounded-sm border-2 border-charcoal bg-canary p-4 text-charcoal">
          A mock platform’s own percentile reflects only its own test-takers, so convert mock scores with these curves
          instead.
        </p>
        <p className="mt-4 text-caption text-muted">
          Sources: Cracku (CAT 2024 results), IMS (CAT 2025 initial estimates, 3 slots). The QA guide’s own 2025 table uses
          Cracku’s estimates, which put the 95th at 19.0 rather than IMS’s 23.
        </p>
      </Part>
    </main>
  );
}
