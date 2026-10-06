import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { PageHeader, Part } from "@/components/ui";
import { vaPractice, vaTypes } from "@/content/varc";

export const metadata: Metadata = { title: "VARC: verbal ability" };

export default function VerbalPage() {
  const groups = [...new Set(vaPractice.map((q) => q.group))];
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="VARC guide, section 4" title="Verbal ability: the four question types">
        The 8 VA questions are the quickest marks in VARC: two of each type, and the jumbles and odd-one-outs are
        usually TITA, so a wrong answer there costs nothing. Each type has one core move.
      </PageHeader>

      <ul className="mt-10 flex flex-wrap gap-3">
        {vaTypes.map((t) => (
          <li key={t.slug}><a href={`#${t.slug}`} className="btn btn-secondary">{t.title}</a></li>
        ))}
        <li><a href="#practice" className="btn btn-primary">Practice set</a></li>
      </ul>

      {vaTypes.map((t) => (
        <Part key={t.slug} id={t.slug} title={`${t.title} (${t.format}): ${t.move.toLowerCase()}`}>
          <div className="grid gap-10 lg:grid-cols-2">
            <ol className="list-decimal space-y-3 pl-6 marker:font-semibold">
              {t.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <div className="space-y-6">
              {t.examples.map((e, i) => (
                <div key={i} className="rounded-sm border-2 border-line bg-card p-5">
                  <p className="text-caption text-muted">Example{t.examples.length > 1 ? ` ${i + 1}` : ""}</p>
                  <p className="mt-2 font-semibold">{e.prompt}</p>
                  {e.text && <p className="mt-3">{e.text}</p>}
                  <Sentences items={e.sentences} />
                  {e.options && <Options items={e.options} />}
                  <Reveal label="answer">
                    <p><strong className="font-semibold">Answer: {e.answer}.</strong> {e.why}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </Part>
      ))}

      <Part id="practice" title="Practice set: verbal ability (25 minutes, 13 questions)">
        <p className="mb-8 text-muted">Do all 13 in one sitting, then check the answers.</p>
        {groups.map((g) => (
          <div key={g} className="mt-10 first:mt-0">
            <h3 className="mb-4 font-semibold">{g}</h3>
            <ol className="space-y-4">
              {vaPractice.filter((q) => q.group === g).map((q) => (
                <li key={q.id} className="flex gap-4 rounded-sm border-2 border-line bg-card p-4">
                  <span className="w-12 shrink-0 font-semibold">{q.id}</span>
                  <div className="min-w-0 flex-1">
                    {q.prompt && <p className="font-semibold">{q.prompt}</p>}
                    {q.text && <p className={q.prompt ? "mt-2" : ""}>{q.text}</p>}
                    <Sentences items={q.sentences} />
                    {q.options && <Options items={q.options} />}
                    <Reveal label="answer"><p>{q.answer}</p></Reveal>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </Part>
    </main>
  );
}

function Sentences({ items }: { items?: string[] }) {
  if (!items) return null;
  return (
    <ol className="mt-3 space-y-2">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-sm border-2 border-line text-caption font-semibold">{i + 1}</span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

function Options({ items }: { items: string[] }) {
  return (
    <ol className="mt-3 space-y-1.5">
      {items.map((o, i) => (
        <li key={i} className="flex gap-2"><span className="text-muted">({"abcd"[i]})</span><span>{o}</span></li>
      ))}
    </ol>
  );
}
