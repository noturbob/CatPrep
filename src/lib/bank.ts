import { and, desc, eq, exists, sql } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, questions, topics, type Section, type Difficulty, type SourceKind } from '@/db/schema';

export type BankFilters = {
  section: Section | 'all';
  topicSlug: string | 'all';
  difficulty: Difficulty | 'all';
  source: SourceKind | 'all';
  status: 'all' | 'attempted' | 'unattempted';
  page: number;
};

export const BANK_PAGE_SIZE = 25;

export type BankRow = {
  id: number;
  stem: string;
  type: 'MCQ' | 'TITA';
  difficulty: Difficulty;
  section: Section;
  source: SourceKind;
  sourceYear: number | null;
  sourceSlot: string | null;
  topicName: string;
  topicSlug: string;
  attempted: boolean;
  lastCorrect: boolean | null;
};

export async function getBankQuestions(filters: BankFilters): Promise<{ rows: BankRow[]; total: number }> {
  const attemptedExists = exists(
    db.select({ n: sql`1` }).from(attempts)
      .where(and(eq(attempts.questionId, questions.id), sql`${attempts.status} <> 'unseen'`)),
  );

  const conditions = [eq(questions.verified, true)];
  if (filters.section !== 'all') conditions.push(eq(questions.section, filters.section));
  if (filters.difficulty !== 'all') conditions.push(eq(questions.difficulty, filters.difficulty));
  if (filters.source !== 'all') conditions.push(eq(questions.source, filters.source));
  if (filters.status === 'attempted') conditions.push(attemptedExists);
  if (filters.status === 'unattempted') conditions.push(sql`not ${attemptedExists}`);

  let topicId: number | null = null;
  if (filters.topicSlug !== 'all') {
    const [t] = await db.select({ id: topics.id }).from(topics).where(eq(topics.slug, filters.topicSlug)).limit(1);
    if (!t) return { rows: [], total: 0 };
    topicId = t.id;
    conditions.push(eq(questions.topicId, topicId));
  }

  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(questions)
    .where(where);

  const rows = await db
    .select({
      id: questions.id, stem: questions.stem, type: questions.type,
      difficulty: questions.difficulty, section: questions.section,
      source: questions.source, sourceYear: questions.sourceYear, sourceSlot: questions.sourceSlot,
      topicName: topics.name, topicSlug: topics.slug,
      attempted: sql<boolean>`${attemptedExists}`,
      lastCorrect: sql<boolean | null>`(
        select ${attempts.isCorrect} from ${attempts}
        where ${attempts.questionId} = ${questions.id} and ${attempts.status} <> 'unseen'
        order by ${attempts.attemptedAt} desc nulls last limit 1
      )`,
    })
    .from(questions)
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(where)
    .orderBy(desc(questions.id))
    .limit(BANK_PAGE_SIZE)
    .offset(filters.page * BANK_PAGE_SIZE);

  return { rows, total };
}

export type BankTopic = { slug: string; name: string; section: Section; count: number };

export async function getBankTopics(): Promise<BankTopic[]> {
  const rows = await db
    .select({
      slug: topics.slug, name: topics.name, section: topics.section,
      count: sql<number>`count(*) filter (where ${questions.verified})::int`,
    })
    .from(topics)
    .leftJoin(questions, eq(questions.topicId, topics.id))
    .groupBy(topics.slug, topics.name, topics.section, topics.priority)
    .orderBy(topics.priority);
  return rows.filter((r) => r.count > 0);
}
