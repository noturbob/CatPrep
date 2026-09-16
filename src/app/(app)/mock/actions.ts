'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { attempts } from '@/db/schema';
import {
  assembleMock, startMockRun, endSection, submitMock, gradeRun,
  isAnswerAllowed, getRunState, FULL_BLUEPRINT, QA_SECTIONAL, type Blueprint,
} from '@/lib/mock';

export async function createMock(kind: 'full' | 'qa' | 'custom', custom?: Blueprint) {
  const blueprint: Blueprint =
    kind === 'full' ? { ...FULL_BLUEPRINT }
    : kind === 'qa' ? { ...QA_SECTIONAL }
    : custom ?? { ...QA_SECTIONAL };

  const stamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const name = kind === 'full' ? `Full mock · ${stamp}`
    : kind === 'qa' ? `QA sectional · ${stamp}`
    : `Custom mock · ${stamp}`;

  const report = await assembleMock(name, blueprint);
  revalidatePath('/mock');
  return report;
}

export async function beginRun(mockId: number) {
  const runId = await startMockRun(mockId);
  redirect(`/mock/${runId}/take`);
}

/**
 * Saves one answer. The server decides whether it is in time and in section —
 * the client's opinion about the clock is never trusted.
 */
export async function saveMockAnswer(input: {
  runId: number;
  attemptId: number;
  questionId: number;
  selected: string | null;
  timeMs: number;
  markedForReview: boolean;
}) {
  if (!(await isAnswerAllowed(input.runId, input.questionId))) {
    return { ok: false as const, reason: 'section closed' };
  }
  await db
    .update(attempts)
    .set({
      selected: input.selected,
      timeMs: input.timeMs,
      markedForReview: input.markedForReview,
      visitCount: 1,
      attemptedAt: new Date(),
    })
    .where(eq(attempts.id, input.attemptId));
  return { ok: true as const };
}

export async function endSectionAction(runId: number) {
  const st = await endSection(runId);
  if (st?.submittedAt) {
    await gradeRun(st.sessionId);
    await submitMock(runId);
    revalidatePath(`/mock/${runId}/analysis`);
  }
  revalidatePath(`/mock/${runId}/take`);
  return st;
}

export async function submitMockAction(runId: number) {
  const st = await getRunState(runId);
  if (st) {
    await gradeRun(st.sessionId);
    await submitMock(runId);
  }
  revalidatePath(`/mock/${runId}/analysis`);
  redirect(`/mock/${runId}/analysis`);
}

/** Polled by the player so an expired section closes even on an idle tab. */
export async function pollRun(runId: number) {
  const st = await getRunState(runId);
  if (st?.submittedAt) await gradeRun(st.sessionId);
  return { state: st, serverNow: Date.now() };
}
