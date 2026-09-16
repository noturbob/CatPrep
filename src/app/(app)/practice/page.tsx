import Link from 'next/link';
import { QuestionPlayer, type PlayerItem } from '@/components/question-player';
import { getOrCreateDailySession, getSessionQuestions, getPlanFor } from '@/lib/daily';
import { localDay } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PracticePage() {
  const today = localDay();
  const plan = await getPlanFor(today);
  const session = await getOrCreateDailySession(today);
  const rows = await getSessionQuestions(session.id);

  if (rows.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="text-[14px] font-semibold">Nothing to practise yet</h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-muted">
          The question bank has nothing matching today&apos;s targets. Add questions at{' '}
          <Link href="/admin/ingest" className="text-accent underline underline-offset-2">/admin/ingest</Link>{' '}
          or run <code className="rounded bg-panel-2 px-1">pnpm seed:questions</code>.
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
    // Answer and solution are deliberately NOT sent until the question is
    // submitted — they come back from the server action instead.
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

  const title = `Daily practice · Day ${plan?.dayNum ?? '?'} · ${plan?.phaseLabel ?? ''}`;
  return <QuestionPlayer items={items} title={title} />;
}
