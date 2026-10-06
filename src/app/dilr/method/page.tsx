import type { Metadata } from "next";
import Link from "next/link";
import { Tex } from "@/components/tex";
import { Bullets, PageHeader, Part } from "@/components/ui";
import { counting, cubeRule, diShortcuts, dilrChapters, fiveSteps, maxMin, notation, setTypes, vennTex } from "@/content/dilr";

export const metadata: Metadata = { title: "DILR: method and set types" };

export default function MethodPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <PageHeader eyebrow="DILR guide, sections 3–4" title="One method for any set">
        Every LR set is solved the same way: read all the rules once, draw one structure, place the certain facts, split
        into cases only when forced, then answer. DI sets follow the same idea with a table in place of the structure.
      </PageHeader>

      <Part title="The five steps">
        <ol className="grid gap-4 md:grid-cols-5">
          {fiveSteps.map((s, i) => (
            <li key={s} className="rounded-sm border-2 border-line bg-card p-4">
              <span className="grid size-7 place-items-center rounded-sm border-2 border-line bg-sky font-semibold text-charcoal">{i + 1}</span>
              <p className="mt-3">{s}</p>
            </li>
          ))}
        </ol>
      </Part>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <Part title="Notation that saves time" className=""><Bullets items={notation} /></Part>
        <Part title="DI calculation shortcuts" className=""><Bullets items={diShortcuts} /></Part>
      </div>

      <Part title="Counting tools you will need">
        <div className="grid gap-8 lg:grid-cols-2 [&>*]:min-w-0">
          <Bullets items={counting} />
          <div className="space-y-4">
            <Tex>{vennTex}</Tex>
            <p className="rounded-sm border-2 border-line bg-card p-4">{cubeRule}</p>
          </div>
        </div>
      </Part>

      <Part title="Set types CAT uses, and how to handle each">
        <p className="mb-6 max-w-[70ch] text-muted">
          CAT DILR sets fall into about a dozen families. Learn to name the family within a minute, because the family
          tells you what to draw and which shortcut applies.
        </p>
        <div className="rounded-sm border-2 border-line bg-card">
          <table className="stack-lg w-full text-left">
            <thead className="border-b-2 border-line text-caption">
              <tr>{["Set type", "Looks like", "Draw this", "Key move", "Skip on first pass if", "Worked in"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {setTypes.map(([t, looks, draw, move, skip, slug]) => (
                <tr key={t} className="border-b border-faint align-top last:border-0">
                  <td className="px-3 py-2 font-semibold">{t}</td>
                  <td data-label="Looks like" className="px-3 py-2">{looks}</td>
                  <td data-label="Draw this" className="px-3 py-2">{draw}</td>
                  <td data-label="Key move" className="px-3 py-2">{move}</td>
                  <td data-label="Skip on first pass if" className="px-3 py-2">{skip}</td>
                  <td data-label="Worked in" className="px-3 py-2">
                    <Link href={`/dilr/sets/${slug}`} className="underline decoration-2 underline-offset-4">
                      {dilrChapters.find((c) => c.slug === slug)!.short}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-[76ch] rounded-sm border-2 border-charcoal bg-canary p-4 text-charcoal">{maxMin}</p>
      </Part>
    </main>
  );
}
