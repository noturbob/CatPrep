import { and, eq, sql, desc, asc } from 'drizzle-orm';
import { db } from '@/db';
import {
  attempts, dailyPlan, questions, sessions, topics, contexts,
  type Section,
} from '@/db/schema';
import { localDay } from './utils';

export type PickedQuestion = typeof questions.$inferSelect & {
  topicName: string;
  topicSlug: string;
  context: typeof contexts.$inferSelect | null;
};

/** Per-question history, used to drive spaced repetition. */
type Hist = { wrongCount: number; correctCount: number; lastSeen: string | null };

async function history(): Promise<Map<number, Hist>> {
  const rows = await db
    .select({
      questionId: attempts.questionId,
      wrongCount: sql<number>`count(*) filter (where ${attempts.status} = 'wrong')::int`,
      correctCount: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
      lastSeen: sql<string | null>`max(${attempts.attemptedAt})::text`,
    })
    .from(attempts)
    .where(sql`${attempts.status} in ('correct','wrong','skipped')`)
    .groupBy(attempts.questionId);

  return new Map(rows.map((r) => [r.questionId, r]));
}

const daysSince = (iso: string | null) =>
  iso === null ? Infinity : (Date.now() - new Date(iso).getTime()) / 86400000;

/**
 * Chooses today's QA questions.
 *
 * Priority order, because a weak-quant candidate gains most from revisiting
 * what they actually got wrong rather than always meeting fresh questions:
 *   1. leeches      — wrong 2+ times, rested at least 3 days   (up to 25%)
 *   2. review       — wrong once, rested at least 2 days       (up to 25%)
 *   3. fresh        — never attempted, focus topics first, then by priority
 *   4. backfill     — anything correct but not seen for 10+ days
 */
async function pickQA(target: number, focusTopicIds: number[]): Promise<number[]> {
  if (target <= 0) return [];

  const pool = await db
    .select({
      id: questions.id,
      topicId: questions.topicId,
      priority: topics.priority,
    })
    .from(questions)
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(and(eq(questions.section, 'QA'), eq(topics.inScope, true), eq(questions.verified, true)));

  const hist = await history();
  const focus = new Set(focusTopicIds);

  const leeches: typeof pool = [];
  const review: typeof pool = [];
  const fresh: typeof pool = [];
  const stale: typeof pool = [];

  for (const q of pool) {
    const h = hist.get(q.id);
    if (!h) { fresh.push(q); continue; }
    const rest = daysSince(h.lastSeen);
    if (h.wrongCount >= 2 && rest >= 3) leeches.push(q);
    else if (h.wrongCount === 1 && rest >= 2) review.push(q);
    else if (h.correctCount > 0 && rest >= 10) stale.push(q);
  }

  // Focus topics first, then by topic priority, so Phase A really does
  // drill the topic the plan says to drill today.
  const rank = (a: { topicId: number; priority: number }, b: { topicId: number; priority: number }) => {
    const fa = focus.has(a.topicId) ? 0 : 1;
    const fb = focus.has(b.topicId) ? 0 : 1;
    return fa !== fb ? fa - fb : a.priority - b.priority;
  };
  [leeches, review, fresh, stale].forEach((l) => l.sort(rank));

  const quota = Math.max(1, Math.floor(target * 0.25));
  const out: number[] = [];
  const push = (list: typeof pool, n: number) => {
    for (const q of list) {
      if (out.length >= target || n <= 0) break;
      if (out.includes(q.id)) continue;
      out.push(q.id); n--;
    }
  };

  push(leeches, quota);
  push(review, quota);
  push(fresh, target - out.length);
  push(stale, target - out.length);
  // Last resort: repeat anything rather than hand back a short session.
  push(pool.sort(rank), target - out.length);

  return out.slice(0, target);
}

/** DILR sets and RC passages are selected whole — you never do half a set. */
async function pickContextQuestions(
  section: Section,
  setTarget: number,
): Promise<number[]> {
  if (setTarget <= 0) return [];

  const kind = section === 'DILR' ? 'dilr_set' : 'rc_passage';
  const hist = await history();

  const sets = await db
    .select({ id: contexts.id })
    .from(contexts)
    .where(eq(contexts.kind, kind))
    .orderBy(asc(contexts.id));

  // Prefer sets whose questions have been seen least recently.
  const scored = await Promise.all(
    sets.map(async (s) => {
      const qs = await db
        .select({ id: questions.id })
        .from(questions)
        .where(eq(questions.contextId, s.id));
      const rest = Math.min(...qs.map((q) => daysSince(hist.get(q.id)?.lastSeen ?? null)));
      return { id: s.id, qs: qs.map((q) => q.id), rest: Number.isFinite(rest) ? rest : Infinity };
    }),
  );

  scored.sort((a, b) => b.rest - a.rest);
  return scored.slice(0, setTarget).flatMap((s) => s.qs);
}

export async function getPlanFor(day: string) {
  const [row] = await db.select().from(dailyPlan).where(eq(dailyPlan.day, day)).limit(1);
  return row ?? null;
}

/**
 * Idempotent: returns today's session, creating and populating it once.
 * Safe to call on every page load.
 */
export async function getOrCreateDailySession(day = localDay()) {
  const existing = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.kind, 'daily'), eq(sessions.day, day)))
    .limit(1);

  if (existing.length) return existing[0];

  const plan = await getPlanFor(day);
  const qaTarget = plan?.qaTarget ?? 20;
  const dilrTarget = plan?.dilrTarget ?? 3;
  const varcTarget = plan?.varcTarget ?? 3;

  const [session] = await db
    .insert(sessions)
    .values({
      kind: 'daily',
      day,
      config: { qaTarget, dilrTarget, varcTarget, phase: plan?.phase ?? null },
    })
    .returning();

  const qaIds = await pickQA(qaTarget, plan?.focusTopicIds ?? []);
  const dilrIds = await pickContextQuestions('DILR', dilrTarget);
  const varcIds = await pickContextQuestions('VARC', varcTarget);

  const all = [...qaIds, ...dilrIds, ...varcIds];
  if (all.length) {
    await db.insert(attempts).values(
      all.map((questionId, i) => ({ questionId, sessionId: session.id, orderIdx: i })),
    );
  }

  return session;
}

/** Full session payload for the player, in display order. */
export async function getSessionQuestions(sessionId: number) {
  const rows = await db
    .select({
      attempt: attempts,
      question: questions,
      topicName: topics.name,
      topicSlug: topics.slug,
      context: contexts,
    })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .leftJoin(contexts, eq(questions.contextId, contexts.id))
    .where(eq(attempts.sessionId, sessionId))
    .orderBy(asc(attempts.orderIdx));

  return rows;
}

/** Counts for the dashboard rings, derived from attempts — never stored. */
export async function getDayProgress(day = localDay()) {
  const rows = await db
    .select({
      section: questions.section,
      total: sql<number>`count(*)::int`,
      done: sql<number>`count(*) filter (where ${attempts.status} <> 'unseen')::int`,
      correct: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
      timeMs: sql<number>`coalesce(sum(${attempts.timeMs}),0)::int`,
    })
    .from(attempts)
    .innerJoin(sessions, eq(attempts.sessionId, sessions.id))
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .where(and(eq(sessions.day, day), eq(sessions.kind, 'daily')))
    .groupBy(questions.section);

  const base: Record<Section, { total: number; done: number; correct: number; timeMs: number }> = {
    QA: { total: 0, done: 0, correct: 0, timeMs: 0 },
    DILR: { total: 0, done: 0, correct: 0, timeMs: 0 },
    VARC: { total: 0, done: 0, correct: 0, timeMs: 0 },
  };
  for (const r of rows) base[r.section] = r;
  return base;
}

/** Consecutive days (ending today or yesterday) with at least one attempt. */
export async function getStreak(): Promise<number> {
  const rows = await db
    .select({ day: sessions.day })
    .from(sessions)
    .innerJoin(attempts, eq(attempts.sessionId, sessions.id))
    .where(sql`${attempts.status} <> 'unseen'`)
    .groupBy(sessions.day)
    .orderBy(desc(sessions.day));

  const days = new Set(rows.map((r) => r.day));
  let streak = 0;
  const cur = new Date();
  if (!days.has(localDay(cur))) cur.setDate(cur.getDate() - 1);
  while (days.has(localDay(cur))) { streak++; cur.setDate(cur.getDate() - 1); }
  return streak;
}
