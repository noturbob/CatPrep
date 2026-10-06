import type { Metadata } from "next";
import { Mcq } from "@/components/mcq";
import { DataTable, PageHeader, Part } from "@/components/ui";
import { howToRead, passages, questionTypes, wrongOptions } from "@/content/varc";

export const metadata: Metadata = { title: "VARC: reading comprehension" };

export default function ReadingPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="VARC guide, section 3" title="Reading comprehension: read for the argument">
        Read for the author’s argument, not for facts. Most CAT RC questions ask what the author thinks, implies or
        would accept, and the wrong options are built from the passage’s own words bent out of shape.
      </PageHeader>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <Part title="How to read a passage" className="">
          <ol className="list-decimal space-y-3 pl-6 marker:font-semibold">
            {howToRead.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </Part>
        <Part title="The four kinds of wrong option" className="">
          <dl className="grid gap-3 sm:grid-cols-2">
            {wrongOptions.map(([t, d], i) => (
              <div key={t} className="rounded-sm border-2 bg-card p-4" style={{ borderColor: ["#f38e84", "#f5b161", "#b291de", "#7597ee"][i] }}>
                <dt className="font-semibold">{t}</dt>
                <dd className="mt-1">{d}</dd>
              </div>
            ))}
          </dl>
        </Part>
      </div>

      <Part title="Question types and how to answer them">
        <DataTable head={["Type", "What it asks", "How to answer"]} rows={questionTypes} firstBold />
      </Part>

      {passages.map((p) => (
        <Part key={p.slug} id={p.slug} title={p.title}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              {p.intro && <p className="mb-4 text-muted">{p.intro}</p>}
              <article className="rounded-sm border-2 border-line bg-card p-6 lg:sticky lg:top-6">
                <p className="mb-3 text-caption text-muted">Passage{p.kind === "practice" ? ", timed" : ""}</p>
                <div className="space-y-4 text-body-lg leading-relaxed">
                  {p.paragraphs.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </article>
            </div>
            <div>
              <ol className="space-y-4">
                {p.questions.map((q, i) => (
                  <Mcq key={i} n={i + 1} q={q.q} options={q.options} answer={<p><strong className="font-semibold">({q.answer}).</strong> {q.why}</p>} />
                ))}
              </ol>
              {p.takeaway && (
                <p className="mt-6 rounded-sm border-2 border-charcoal bg-canary p-4 text-charcoal">
                  <span className="font-semibold">Takeaway. </span>{p.takeaway}
                </p>
              )}
            </div>
          </div>
        </Part>
      ))}
    </main>
  );
}
