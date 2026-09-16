'use server';

import { eq, inArray, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { questions, contexts, topics, ingestBatches } from '@/db/schema';
import { parseDump, type ParseResult } from '@/lib/ingest-parser';

export async function previewDump(raw: string): Promise<ParseResult> {
  return parseDump(raw);
}

/**
 * Parses and stages. Everything lands with `verified: false`, which the daily
 * generator filters out — so nothing reaches practice until it is approved.
 */
export async function stageDump(input: {
  raw: string;
  label: string;
  qaTopicSlug: string;
  dilrTopicSlug: string;
  /** 'pyq' only when this really is a past paper — otherwise 'imported'. */
  source: 'pyq' | 'imported';
  year: number | null;
  slot: string | null;
}) {
  const parsed = parseDump(input.raw);
  if (parsed.questions.length === 0) {
    return { ok: false as const, error: 'Nothing parsed. Check the format hints below the box.' };
  }

  const allTopics = await db.select().from(topics);
  const bySlug = new Map(allTopics.map((t) => [t.slug, t]));

  const qaTopic = bySlug.get(input.qaTopicSlug);
  const rcTopic = bySlug.get('rc');
  const dilrTopic = bySlug.get(input.dilrTopicSlug) ?? bySlug.get('lr-arrangements');
  if (!qaTopic || !rcTopic || !dilrTopic) {
    return { ok: false as const, error: 'Topics are not seeded. Run `pnpm seed` first.' };
  }

  const [batch] = await db
    .insert(ingestBatches)
    .values({
      label: input.label || null,
      rawText: input.raw.slice(0, 200_000),
      parsedCount: parsed.questions.length,
      model: 'deterministic-parser',
      status: 'parsed',
    })
    .returning();

  // Contexts first, so questions can point at real ids.
  const ctxIds: number[] = [];
  for (const c of parsed.contexts) {
    const [row] = await db
      .insert(contexts)
      .values({
        kind: c.kind,
        title: c.title,
        body: c.body,
        source: input.source,
        sourceYear: input.year,
        sourceSlot: input.slot,
        wordCount: c.body.split(/\s+/).filter(Boolean).length,
      })
      .returning({ id: contexts.id });
    ctxIds.push(row.id);
  }

  let staged = 0;
  for (const q of parsed.questions) {
    const ctx = q.contextIdx !== null ? parsed.contexts[q.contextIdx] : null;
    const topic = ctx === null ? qaTopic : ctx.kind === 'rc_passage' ? rcTopic : dilrTopic;

    await db.insert(questions).values({
      topicId: topic.id,
      contextId: q.contextIdx !== null ? ctxIds[q.contextIdx] : null,
      section: topic.section,
      type: q.type,
      stem: q.stem,
      options: q.options,
      answer: q.answer ?? '',
      solution: q.solution ?? '',
      difficulty: q.difficulty,
      source: input.source,
      sourceYear: input.year,
      sourceSlot: input.slot,
      tags: [],
      ingestBatchId: batch.id,
      verified: false,
    });
    staged++;
  }

  revalidatePath('/admin/ingest');
  return {
    ok: true as const,
    staged,
    contexts: parsed.contexts.length,
    withWarnings: parsed.questions.filter((q) => q.warnings.length > 0).length,
  };
}

export async function updateStaged(id: number, fields: {
  stem?: string; answer?: string; solution?: string; topicSlug?: string; difficulty?: string;
}) {
  const patch: Record<string, unknown> = {};
  if (fields.stem !== undefined) patch.stem = fields.stem;
  if (fields.answer !== undefined) patch.answer = fields.answer;
  if (fields.solution !== undefined) patch.solution = fields.solution;
  if (fields.difficulty !== undefined) patch.difficulty = fields.difficulty;
  if (fields.topicSlug) {
    const [t] = await db.select().from(topics).where(eq(topics.slug, fields.topicSlug)).limit(1);
    if (t) { patch.topicId = t.id; patch.section = t.section; }
  }
  if (Object.keys(patch).length) {
    await db.update(questions).set(patch).where(eq(questions.id, id));
  }
  revalidatePath('/admin/ingest');
}

/** Refuses to approve anything that would be unusable in practice. */
export async function approveStaged(ids: number[]) {
  if (ids.length === 0) return { ok: true as const, approved: 0, rejected: [] as string[] };

  const rows = await db.select().from(questions).where(inArray(questions.id, ids));
  const good: number[] = [];
  const rejected: string[] = [];

  for (const q of rows) {
    if (!q.answer?.trim()) { rejected.push(`#${q.id}: no answer`); continue; }
    if (!q.solution?.trim()) { rejected.push(`#${q.id}: no solution`); continue; }
    if (q.type === 'MCQ') {
      if (!q.options || q.options.length < 2) { rejected.push(`#${q.id}: MCQ without options`); continue; }
      if (!q.options.includes(q.answer)) { rejected.push(`#${q.id}: answer is not one of the options`); continue; }
    }
    good.push(q.id);
  }

  if (good.length) {
    await db.update(questions).set({ verified: true }).where(inArray(questions.id, good));
  }
  revalidatePath('/admin/ingest');
  revalidatePath('/practice');
  return { ok: true as const, approved: good.length, rejected };
}

export async function discardStaged(ids: number[]) {
  if (ids.length === 0) return;
  await db.delete(questions).where(and(inArray(questions.id, ids), eq(questions.verified, false)));
  // Drop contexts left with no questions pointing at them.
  await db.execute(sql`
    delete from contexts c
    where not exists (select 1 from questions q where q.context_id = c.id)
  `);
  revalidatePath('/admin/ingest');
}
