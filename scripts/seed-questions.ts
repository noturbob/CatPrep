import '../src/lib/load-env';
import { db } from '../src/db';
import { questions, topics } from '../src/db/schema';
import { SEED_QUESTIONS } from '../src/data/questions';
import { eq, and } from 'drizzle-orm';

async function main() {
  /* ---- verify before touching the database ---------------------------- */
  const problems: string[] = [];
  for (const q of SEED_QUESTIONS) {
    const got = String(q.verify());
    if (got !== q.answer) {
      problems.push(`${q.topic}: verify()=${got} but answer=${q.answer} — "${q.stem.slice(0, 60)}"`);
    }
    if (q.type === 'MCQ') {
      if (!q.options || q.options.length !== 4) problems.push(`${q.topic}: MCQ needs exactly 4 options`);
      else if (!q.options.includes(q.answer)) problems.push(`${q.topic}: answer is not among the options`);
    }
    if (q.type === 'TITA' && q.options) problems.push(`${q.topic}: TITA must not have options`);
    if (!q.solution || q.solution.length < 40) problems.push(`${q.topic}: solution too thin — "${q.stem.slice(0, 40)}"`);
  }

  if (problems.length) {
    console.error(`REFUSING TO SEED — ${problems.length} problem(s):`);
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }
  console.log(`verified ${SEED_QUESTIONS.length} questions`);

  /* ---- resolve topics -------------------------------------------------- */
  const allTopics = await db.select().from(topics);
  const bySlug = new Map(allTopics.map((t) => [t.slug, t]));

  const missing = [...new Set(SEED_QUESTIONS.map((q) => q.topic))].filter((s) => !bySlug.has(s));
  if (missing.length) {
    console.error('unknown topic slugs (run `pnpm seed` first): ' + missing.join(', '));
    process.exit(1);
  }

  /* ---- insert, skipping anything already present ----------------------- */
  let inserted = 0;
  let skipped = 0;
  for (const q of SEED_QUESTIONS) {
    const topic = bySlug.get(q.topic)!;
    const existing = await db
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.stem, q.stem), eq(questions.topicId, topic.id)))
      .limit(1);

    if (existing.length) { skipped++; continue; }

    await db.insert(questions).values({
      topicId: topic.id,
      section: topic.section,
      type: q.type,
      stem: q.stem,
      options: q.options ?? null,
      answer: q.answer,
      solution: q.solution,
      difficulty: q.difficulty,
      source: 'original',
      tags: q.tags ?? [],
      verified: true,
    });
    inserted++;
  }

  console.log(`inserted ${inserted}, skipped ${skipped} (already present)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
