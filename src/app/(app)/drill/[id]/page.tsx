import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { getSessionQuestions } from '@/lib/daily';
import { QuestionPlayer, type PlayerItem } from '@/components/question-player';

export const dynamic = 'force-dynamic';

export default async function DrillSessionPage({ params }: PageProps<'/drill/[id]'>) {
  const { id } = await params;
  const sessionId = Number(id);

  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!session || session.kind !== 'drill') notFound();

  const rows = await getSessionQuestions(sessionId);
  const config = session.config as { difficulty?: string; count?: number };

  if (rows.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12">
        <h1 className="text-[19px] font-normal text-fg">Nothing to drill</h1>
        <p className="mt-3 max-w-[54ch] text-[13px] leading-relaxed text-muted">
          That combination of topic, difficulty{config.difficulty && config.difficulty !== 'any' ? ` (${config.difficulty})` : ''}
          {' '}and &quot;unattempted only&quot; matched nothing in the bank. Try widening the filter.
        </p>
      </main>
    );
  }

  const items: PlayerItem[] = rows.map((r) => ({
    attemptId: r.attempt.id,
    questionId: r.question.id,
    section: r.question.section,
    type: r.question.type,
    difficulty: r.question.difficulty,
    stem: r.question.stem,
    options: r.question.options ?? null,
    topicName: r.topicName,
    contextTitle: r.context?.title ?? null,
    contextBody: r.context?.body ?? null,
    status: r.attempt.status,
    selected: r.attempt.selected,
    timeMs: r.attempt.timeMs,
    visitCount: r.attempt.visitCount,
    markedForReview: r.attempt.markedForReview,
    errorTag: r.attempt.errorTag,
  }));

  const title = `Drill — ${rows[0].topicName}`;
  return <QuestionPlayer items={items} title={title} />;
}
