import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, questions, sessions, topics, type Difficulty } from '@/db/schema';
import { localDay } from './utils';

export type DrillFilters = {
  topicSlug: string;
  difficulty: Difficulty | 'any';
  unattemptedOnly: boolean;
  count: number;
};

/**
 * Builds a one-off drill session for a single topic, outside the daily plan.
 * Unlike the daily generator this has no spaced-repetition priority — the
 * whole point of a drill is "give me N of exactly this, right now".
 */
export async function startDrillSession(filters: DrillFilters): Promise<number> {
  const [topic] = await db.select().from(topics).where(eq(topics.slug, filters.topicSlug)).limit(1);
  if (!topic) throw new Error(`unknown topic: ${filters.topicSlug}`);

  const conditions = [eq(questions.topicId, topic.id), eq(questions.verified, true)];
  if (filters.difficulty !== 'any') conditions.push(eq(questions.difficulty, filters.difficulty));

  let pool = await db.select({ id: questions.id }).from(questions).where(and(...conditions));

  if (filters.unattemptedOnly && pool.length > 0) {
    const seen = await db
      .selectDistinct({ questionId: attempts.questionId })
      .from(attempts)
      .where(and(
        inArray(attempts.questionId, pool.map((p) => p.id)),
        sql`${attempts.status} <> 'unseen'`,
      ));
    const seenIds = new Set(seen.map((s) => s.questionId));
    pool = pool.filter((p) => !seenIds.has(p.id));
  }

  // Shuffle, then cap to the requested count.
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, filters.count);

  const [session] = await db
    .insert(sessions)
    .values({
      kind: 'drill',
      day: localDay(),
      config: { topicSlug: filters.topicSlug, difficulty: filters.difficulty, count: filters.count },
    })
    .returning();

  if (shuffled.length > 0) {
    await db.insert(attempts).values(
      shuffled.map((q, i) => ({ questionId: q.id, sessionId: session.id, orderIdx: i })),
    );
  }

  return session.id;
}

export type TopicOption = {
  slug: string;
  name: string;
  area: string;
  available: number;
  attempted: number;
  accuracy: number;
};

/** Topics worth drilling, with enough context to pick one intelligently. */
export async function getDrillTopics(): Promise<TopicOption[]> {
  const rows = await db
    .select({
      slug: topics.slug,
      name: topics.name,
      area: topics.area,
      available: sql<number>`count(distinct ${questions.id}) filter (where ${questions.verified})::int`,
      attempted: sql<number>`count(*) filter (where ${attempts.status} in ('correct','wrong'))::int`,
      correct: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
    })
    .from(topics)
    .leftJoin(questions, eq(questions.topicId, topics.id))
    .leftJoin(attempts, eq(attempts.questionId, questions.id))
    .where(eq(topics.inScope, true))
    .groupBy(topics.slug, topics.name, topics.area, topics.priority)
    .orderBy(topics.priority);

  return rows
    .filter((r) => r.available > 0)
    .map((r) => ({
      slug: r.slug, name: r.name, area: r.area, available: r.available,
      attempted: r.attempted,
      accuracy: r.attempted ? Math.round((r.correct / r.attempted) * 100) : 0,
    }));
}
