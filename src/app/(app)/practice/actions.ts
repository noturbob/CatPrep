'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { attempts, questions, type ErrorTag } from '@/db/schema';
import { statusFor } from '@/lib/scoring';

export async function submitAnswer(input: {
  attemptId: number;
  selected: string | null;
  timeMs: number;
  visitCount: number;
}) {
  const [row] = await db
    .select({ attempt: attempts, question: questions })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .where(eq(attempts.id, input.attemptId))
    .limit(1);

  if (!row) throw new Error('attempt not found');

  const status = statusFor(input.selected, row.question.answer, row.question.type);
  const answered = status !== 'skipped';
  const correct = status === 'correct';

  await db
    .update(attempts)
    .set({
      selected: answered ? input.selected : null,
      isCorrect: answered ? correct : null,
      status,
      timeMs: input.timeMs,
      visitCount: input.visitCount,
      attemptedAt: new Date(),
    })
    .where(eq(attempts.id, input.attemptId));

  revalidatePath('/practice');
  revalidatePath('/');

  return {
    status,
    correct,
    answer: row.question.answer,
    solution: row.question.solution,
  };
}

export async function setErrorTag(attemptId: number, tag: ErrorTag | null) {
  await db.update(attempts).set({ errorTag: tag }).where(eq(attempts.id, attemptId));
  revalidatePath('/errors');
}

export async function toggleMarked(attemptId: number, marked: boolean) {
  await db.update(attempts).set({ markedForReview: marked }).where(eq(attempts.id, attemptId));
}

export async function saveNote(attemptId: number, note: string) {
  await db.update(attempts).set({ note: note.slice(0, 2000) }).where(eq(attempts.id, attemptId));
  revalidatePath('/errors');
}
