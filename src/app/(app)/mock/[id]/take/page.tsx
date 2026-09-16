import { redirect } from 'next/navigation';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, contexts, mockQuestions, questions } from '@/db/schema';
import { getRunState } from '@/lib/mock';
import { MockPlayer, type MockItem } from '@/components/mock-player';

export const dynamic = 'force-dynamic';

export default async function TakeMockPage({ params }: PageProps<'/mock/[id]/take'>) {
  const { id } = await params;
  const runId = Number(id);
  const state = await getRunState(runId);
  if (!state) redirect('/mock');
  if (state.submittedAt || !state.currentSection) redirect(`/mock/${runId}/analysis`);

  const rows = await db
    .select({ attempt: attempts, question: questions, context: contexts })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .innerJoin(mockQuestions, and(
      eq(mockQuestions.mockId, state.mockId),
      eq(mockQuestions.questionId, questions.id),
    ))
    .leftJoin(contexts, eq(questions.contextId, contexts.id))
    .where(and(
      eq(attempts.sessionId, state.sessionId),
      eq(mockQuestions.section, state.currentSection),
    ))
    .orderBy(asc(mockQuestions.orderIdx));

  // Answers and solutions are not sent to the browser during a mock.
  const items: MockItem[] = rows.map((r) => ({
    attemptId: r.attempt.id,
    questionId: r.question.id,
    section: r.question.section,
    type: r.question.type,
    stem: r.question.stem,
    options: r.question.options ?? null,
    contextTitle: r.context?.title ?? null,
    contextBody: r.context?.body ?? null,
    selected: r.attempt.selected,
    markedForReview: r.attempt.markedForReview,
    visited: r.attempt.visitCount > 0,
  }));

  return (
    <MockPlayer
      runId={runId}
      mockName={state.mockName}
      section={state.currentSection}
      activeSections={state.activeSections}
      doneSections={state.doneSections}
      sectionEndsAt={state.sectionEndsAt!}
      serverNow={state.serverNow}
      items={items}
    />
  );
}
