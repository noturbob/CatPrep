import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, Solution } from "@/components/reveal";
import { Tex } from "@/components/tex";
import { chapterBySlug, chapters } from "@/content/qa";

export const dynamicParams = false;

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/qa/[slug]">): Promise<Metadata> {
  const c = chapterBySlug((await params).slug);
  return { title: c?.title, description: c?.lede };
}

const parts = [
  ["asked", "How CAT asks it"],
  ["concepts", "Concepts"],
  ["thought", "Thought process"],
  ["patterns", "Patterns CAT repeats"],
  ["examples", "Worked examples"],
  ["traps", "Traps"],
  ["practice", "Practice set"],
];

export default async function ChapterPage({ params }: PageProps<"/qa/[slug]">) {
  const c = chapterBySlug((await params).slug);
  if (!c) notFound();
  const i = chapters.indexOf(c);
  const prev = chapters[i - 1];
  const next = chapters[i + 1];

  return (
    <main className="mx-auto grid max-w-[1200px] gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <nav aria-label="Chapters" className="sticky top-6 space-y-8 text-caption">
          <ul className="space-y-1">
            {parts.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded-sm px-2 py-1 hover:bg-wash">{label}</a>
              </li>
            ))}
          </ul>
          <ul className="space-y-1 border-t-2 border-line pt-6">
            {chapters.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/qa/${o.slug}`}
                  aria-current={o === c ? "page" : undefined}
                  className="flex gap-2 rounded-sm px-2 py-1 hover:bg-wash aria-[current=page]:bg-sky aria-[current=page]:text-charcoal"
                >
                  <span className="w-5 text-muted">{o.n}</span>
                  {o.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <article className="min-w-0 max-w-[76ch]">
        <p className="text-caption text-muted">
          Section {c.n}, {c.group === "Algebra" ? "easy algebra" : "arithmetic"}
        </p>
        <h1 className="mt-2 text-h1 font-light">{c.title}</h1>
        <p className="mt-6 text-sub">{c.lede}</p>

        <Part id="asked" title="How CAT asks it">
          <p>{c.asked}</p>
        </Part>

        <Part id="concepts" title="Concepts you must know">
          <div className="space-y-6">
            {c.concepts.map((g, gi) => (
              <div key={gi}>
                {g.title && <h3 className="mb-3 font-semibold">{g.title}</h3>}
                <ul className="space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:size-2 before:rounded-sm before:bg-ink">
                      {it}
                    </li>
                  ))}
                </ul>
                {g.tex && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                    {g.tex.map((t) => <Tex key={t}>{t}</Tex>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Part>

        <Part id="thought" title="Thought process">
          <ol className="list-decimal space-y-2 pl-6 marker:font-semibold">
            {c.thought.map((t) => <li key={t}>{t}</li>)}
          </ol>
        </Part>

        <Part id="patterns" title="Patterns CAT repeats">
          <p className="mb-4 text-caption text-muted">Numbered so your error log can point at them: “Pattern 2”.</p>
          <ol className="divide-y divide-faint rounded-sm border-2 border-line bg-card">
            {c.patterns.map((p, pi) => (
              <li key={p} className="flex gap-4 px-4 py-3">
                <span className="w-6 shrink-0 font-semibold">{pi + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
          {c.evidence && (
            <div className="mt-6 rounded-sm border-2 border-charcoal bg-canary p-5 text-charcoal">
              <p className="font-semibold">What the real papers show</p>
              <p className="mt-2">{c.evidence}</p>
            </div>
          )}
        </Part>

        <Part id="examples" title="Worked examples">
          <p className="mb-6 text-muted">Attempt each one before opening its solution, then compare methods.</p>
          <ol className="space-y-6">
            {c.examples.map((e, ei) => (
              <li key={ei} className="rounded-sm border-2 border-line bg-card p-5">
                <p className="text-caption text-muted">
                  Example {ei + 1}{e.tag && `, ${e.tag}`}
                </p>
                <p className="mt-2 text-body-lg">{e.q}</p>
                <Reveal label="solution">
                  <Solution text={e.a} />
                </Reveal>
              </li>
            ))}
          </ol>
        </Part>

        <Part id="traps" title="Traps">
          <ul className="space-y-3">
            {c.traps.map((t) => (
              <li key={t} className="rounded-sm border-2 border-coral bg-card px-4 py-3">{t}</li>
            ))}
          </ul>
        </Part>

        <Part id="practice" title="Practice set">
          <p className="mb-6 text-muted">Timed, about 2.5 minutes per question. Log every miss in the error log.</p>
          <ol className="space-y-4">
            {c.practice.map((p, pi) => (
              <li key={pi} className="flex gap-4 rounded-sm border-2 border-line bg-card p-4">
                <span className="w-6 shrink-0 font-semibold">{pi + 1}</span>
                <div className="min-w-0 flex-1">
                  <p>{p.q}</p>
                  <Reveal label="answer">
                    <p>{p.a}</p>
                  </Reveal>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-6">
            <Link href="/qa/error-log" className="btn btn-primary">Log a miss</Link>
            <Link href="/qa/error-log#sources" className="btn btn-secondary">Find this chapter’s real CAT questions</Link>
          </div>
        </Part>

        <nav aria-label="Previous and next chapter" className="mt-20 grid gap-6 border-t-2 border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`/qa/${prev.slug}`} className="btn btn-secondary flex-col items-start">
              <span className="text-caption text-muted">Previous, section {prev.n}</span>
              {prev.title}
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/qa/${next.slug}`} className="btn btn-secondary flex-col items-start sm:text-right sm:items-end">
              <span className="text-caption text-muted">Next, section {next.n}</span>
              {next.title}
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}

function Part({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16">
      <h2 className="mb-5 text-h3 font-normal">{title}</h2>
      {children}
    </section>
  );
}
