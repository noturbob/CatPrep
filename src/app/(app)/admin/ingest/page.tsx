import { eq, desc, and, ne } from 'drizzle-orm';
import { db } from '@/db';
import { questions, topics, contexts, ingestBatches } from '@/db/schema';
import { IngestForm } from '@/components/ingest-form';
import { StagedList, type StagedRow } from '@/components/staged-list';

export const dynamic = 'force-dynamic';

export default async function IngestPage() {
  const allTopics = await db.select().from(topics);
  const qaTopics = allTopics
    .filter((t) => t.section === 'QA' && t.inScope)
    .sort((a, b) => a.priority - b.priority)
    .map((t) => ({ slug: t.slug, name: t.name }));
  const dilrTopics = allTopics
    .filter((t) => t.section === 'DILR')
    .sort((a, b) => a.priority - b.priority)
    .map((t) => ({ slug: t.slug, name: t.name }));

  const stagedRows = await db
    .select({
      id: questions.id, stem: questions.stem, options: questions.options,
      answer: questions.answer, solution: questions.solution, type: questions.type,
      difficulty: questions.difficulty, topicName: topics.name,
      contextKind: contexts.kind, batchLabel: ingestBatches.label,
    })
    .from(questions)
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .leftJoin(contexts, eq(questions.contextId, contexts.id))
    .leftJoin(ingestBatches, eq(questions.ingestBatchId, ingestBatches.id))
    // Anything unverified that did not come from the authored seed bank.
    .where(and(eq(questions.verified, false), ne(questions.source, 'original')))
    .orderBy(desc(questions.id))
    .limit(200);

  const staged: StagedRow[] = stagedRows.map((r) => ({
    ...r, options: r.options ?? null, contextKind: r.contextKind ?? null,
  }));

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6">
      <h1 className="text-[13px] font-semibold">Ingest</h1>
      <p className="mb-5 mt-0.5 max-w-2xl text-[12px] text-muted">
        Paste previous-year questions you already have. They are parsed
        deterministically — no AI, no cost, and every field came from a line you can
        point at. Nothing reaches practice until you approve it.
      </p>

      <section className="mb-8 rounded border border-border bg-panel p-4">
        <IngestForm qaTopics={qaTopics} dilrTopics={dilrTopics} />

        <details className="mt-4 border-t border-border pt-3">
          <summary className="cursor-pointer text-[11px] text-muted">Format the parser understands</summary>
          <div className="prose-cat mt-2 space-y-2 text-[11px] text-faint">
            <p>
              Questions start with a number: <code>1.</code>, <code>2)</code>, <code>Q.3)</code>.
              Options may sit inline or one per line, bracketed:
              <code>(a) 54 (b) 64.8</code> or <code>(1) 24</code>.
            </p>
            <p>
              <code>Ans: b</code> resolves the letter to that option&apos;s text.
              <code>Sol:</code> starts the solution and runs until the next question.
              <code>Difficulty: easy</code> is optional.
            </p>
            <p>
              <code>PASSAGE: title</code> starts an RC passage and <code>SET: title</code> a
              DILR caselet — every question after it binds to that passage or set until the
              next header.
            </p>
            <p>
              Separate questions with a blank line. That blank line is how the parser tells the
              next question apart from a numbered step inside a solution.
            </p>
          </div>
        </details>
      </section>

      <section>
        <h2 className="text-[12px] font-semibold">
          Staging <span className="nums text-faint">({staged.length})</span>
        </h2>
        <p className="mb-3 mt-0.5 text-[11px] text-muted">
          Read each one before approving. A parser is not a proofreader — a wrong answer here
          teaches you the wrong method.
        </p>
        {staged.length === 0 ? (
          <p className="rounded border border-border bg-panel py-8 text-center text-[12px] text-faint">
            Nothing staged.
          </p>
        ) : (
          <StagedList rows={staged} />
        )}
      </section>
    </main>
  );
}
