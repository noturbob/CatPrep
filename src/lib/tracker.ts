import { and, eq, sql, asc } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, questions, topics, sessions, mockRuns, type ErrorTag } from '@/db/schema';

/** Target seconds per question, by section. */
export const PACE_TARGET = { QA: 110, DILR: 180, VARC: 120 } as const;

export type TopicStat = {
  slug: string;
  name: string;
  area: string;
  section: string;
  priority: number;
  attempted: number;
  correct: number;
  accuracy: number;
  medianSec: number;
};

export async function getTopicStats(): Promise<TopicStat[]> {
  const rows = await db
    .select({
      slug: topics.slug,
      name: topics.name,
      area: topics.area,
      section: topics.section,
      priority: topics.priority,
      attempted: sql<number>`count(*) filter (where ${attempts.status} in ('correct','wrong'))::int`,
      correct: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
      medianMs: sql<number>`coalesce(percentile_cont(0.5) within group (
        order by ${attempts.timeMs}) filter (where ${attempts.status} in ('correct','wrong')), 0)::int`,
    })
    .from(topics)
    .leftJoin(questions, eq(questions.topicId, topics.id))
    .leftJoin(attempts, and(eq(attempts.questionId, questions.id), sql`${attempts.status} <> 'unseen'`))
    .where(eq(topics.inScope, true))
    .groupBy(topics.slug, topics.name, topics.area, topics.section, topics.priority)
    .orderBy(asc(topics.priority));

  return rows.map((r) => ({
    slug: r.slug, name: r.name, area: r.area, section: r.section, priority: r.priority,
    attempted: r.attempted, correct: r.correct,
    accuracy: r.attempted ? Math.round((r.correct / r.attempted) * 100) : 0,
    medianSec: Math.round(r.medianMs / 1000),
  }));
}

export async function getErrorTagBreakdown(): Promise<{ tag: ErrorTag; n: number }[]> {
  const rows = await db
    .select({ tag: attempts.errorTag, n: sql<number>`count(*)::int` })
    .from(attempts)
    .where(sql`${attempts.errorTag} is not null and ${attempts.errorTag} <> 'guess'`)
    .groupBy(attempts.errorTag);
  return rows
    .filter((r): r is { tag: ErrorTag; n: number } => r.tag !== null)
    .sort((a, b) => b.n - a.n);
}

/** Per-day attempt volume and accuracy, for the activity strip. */
export async function getDailyActivity(limit = 30) {
  return db
    .select({
      day: sessions.day,
      attempted: sql<number>`count(*) filter (where ${attempts.status} in ('correct','wrong'))::int`,
      correct: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
      timeMs: sql<number>`coalesce(sum(${attempts.timeMs}),0)::int`,
    })
    .from(sessions)
    .innerJoin(attempts, eq(attempts.sessionId, sessions.id))
    .groupBy(sessions.day)
    .orderBy(asc(sessions.day))
    .limit(limit);
}

export async function getMockTrend() {
  return db
    .select({ id: mockRuns.id, submittedAt: mockRuns.submittedAt, score: mockRuns.score })
    .from(mockRuns)
    .where(sql`${mockRuns.submittedAt} is not null`)
    .orderBy(asc(mockRuns.submittedAt));
}

export type LeechRow = {
  questionId: number;
  stem: string;
  topicName: string;
  wrongCount: number;
  lastSeen: string | null;
};

/** Questions gone wrong two or more times — the revision queue. */
export async function getLeeches(limit = 25): Promise<LeechRow[]> {
  const rows = await db
    .select({
      questionId: attempts.questionId,
      stem: questions.stem,
      topicName: topics.name,
      wrongCount: sql<number>`count(*) filter (where ${attempts.status} = 'wrong')::int`,
      lastSeen: sql<string | null>`max(${attempts.attemptedAt})::text`,
    })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .groupBy(attempts.questionId, questions.stem, topics.name)
    .having(sql`count(*) filter (where ${attempts.status} = 'wrong') >= 2`)
    .orderBy(sql`count(*) filter (where ${attempts.status} = 'wrong') desc`)
    .limit(limit);
  return rows;
}

export type ErrorRow = {
  attemptId: number;
  questionId: number;
  stem: string;
  answer: string;
  solution: string;
  selected: string | null;
  topicName: string;
  errorTag: ErrorTag | null;
  timeMs: number;
  attemptedAt: string | null;
  note: string | null;
};

export async function getErrorLog(limit = 100): Promise<ErrorRow[]> {
  return db
    .select({
      attemptId: attempts.id,
      questionId: questions.id,
      stem: questions.stem,
      answer: questions.answer,
      solution: questions.solution,
      selected: attempts.selected,
      topicName: topics.name,
      errorTag: attempts.errorTag,
      timeMs: attempts.timeMs,
      attemptedAt: sql<string | null>`${attempts.attemptedAt}::text`,
      note: attempts.note,
    })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(eq(attempts.status, 'wrong'))
    .orderBy(sql`${attempts.attemptedAt} desc nulls last`)
    .limit(limit);
}
