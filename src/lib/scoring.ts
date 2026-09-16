import type { AttemptStatus, QuestionType, Section } from '@/db/schema';

/**
 * TITA answers are compared numerically when both sides parse as numbers,
 * so "64.80", "64.8" and " 64.8 " all count. MCQ compares the option text.
 */
export function isAnswerCorrect(given: string, expected: string, type: QuestionType): boolean {
  const a = given.trim();
  const b = expected.trim();
  if (a === '' ) return false;
  if (a.toLowerCase() === b.toLowerCase()) return true;
  if (type === 'TITA') {
    const na = Number(a.replace(/,/g, ''));
    const nb = Number(b.replace(/,/g, ''));
    if (Number.isFinite(na) && Number.isFinite(nb)) return Math.abs(na - nb) < 1e-9;
  }
  return false;
}

export function statusFor(selected: string | null, expected: string, type: QuestionType): AttemptStatus {
  if (selected === null || selected.trim() === '') return 'skipped';
  return isAnswerCorrect(selected, expected, type) ? 'correct' : 'wrong';
}

/** CAT marking: +3 correct, -1 wrong MCQ, TITA never negative. */
export function markFor(status: AttemptStatus, type: QuestionType): number {
  if (status === 'correct') return 3;
  if (status === 'wrong' && type === 'MCQ') return -1;
  return 0;
}

export type SectionScore = {
  section: Section;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  accuracy: number;
  /** in-scope only — the numbers that reflect the actual strategy */
  inScopeAttempted: number;
  inScopeCorrect: number;
  attemptableAccuracy: number;
  outOfScopeSkipped: number;
};

export function scoreSection(
  section: Section,
  rows: { status: AttemptStatus; type: QuestionType; inScope: boolean }[],
): SectionScore {
  let correct = 0, wrong = 0, skipped = 0, score = 0;
  let inScopeAttempted = 0, inScopeCorrect = 0, outOfScopeSkipped = 0;

  for (const r of rows) {
    score += markFor(r.status, r.type);
    if (r.status === 'correct') correct++;
    else if (r.status === 'wrong') wrong++;
    else skipped++;

    if (r.inScope) {
      if (r.status === 'correct' || r.status === 'wrong') {
        inScopeAttempted++;
        if (r.status === 'correct') inScopeCorrect++;
      }
    } else if (r.status !== 'correct' && r.status !== 'wrong') {
      outOfScopeSkipped++;
    }
  }

  const attempted = correct + wrong;
  return {
    section, attempted, correct, wrong, skipped, score,
    accuracy: attempted ? Math.round((correct / attempted) * 1000) / 10 : 0,
    inScopeAttempted, inScopeCorrect,
    attemptableAccuracy: inScopeAttempted
      ? Math.round((inScopeCorrect / inScopeAttempted) * 1000) / 10
      : 0,
    outOfScopeSkipped,
  };
}
