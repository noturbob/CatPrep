import '../src/lib/load-env';
import { db } from '../src/db';
import {
  topics, institutes, dailyPlan, percentileMap, settings,
} from '../src/db/schema';
import { TOPICS } from '../src/data/topics';
import { INSTITUTES } from '../src/data/institutes';
import { PERCENTILE_ANCHORS } from '../src/data/percentiles';
import { buildPlan } from '../src/lib/plan';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('seeding...');

  /* topics ---------------------------------------------------------- */
  await db
    .insert(topics)
    .values(TOPICS.map((t) => ({ ...t, conceptNotes: t.conceptNotes ?? null })))
    .onConflictDoUpdate({
      target: topics.slug,
      set: {
        name: sql`excluded.name`,
        catWeightAvg: sql`excluded.cat_weight_avg`,
        inScope: sql`excluded.in_scope`,
        priority: sql`excluded.priority`,
        conceptNotes: sql`excluded.concept_notes`,
      },
    });
  const allTopics = await db.select().from(topics);
  const bySlug = new Map(allTopics.map((t) => [t.slug, t.id]));
  console.log(`  topics        ${allTopics.length} (${allTopics.filter((t) => t.inScope && t.section === 'QA').length} in-scope QA)`);

  /* institutes ------------------------------------------------------ */
  await db
    .insert(institutes)
    .values(INSTITUTES)
    .onConflictDoUpdate({
      target: institutes.short,
      set: { domains: sql`excluded.domains`, tier: sql`excluded.tier`, name: sql`excluded.name` },
    });
  console.log(`  institutes    ${INSTITUTES.length} (${INSTITUTES.filter((i) => i.isIim).length} IIMs + CAT admin)`);

  /* the 74-day plan -------------------------------------------------- */
  const plan = buildPlan().map((d) => ({
    day: d.day,
    dayNum: d.dayNum,
    daysLeft: d.daysLeft,
    phase: d.phase,
    phaseLabel: d.phaseLabel,
    focusTopicIds: d.focusSlugs.map((s) => bySlug.get(s)).filter((n): n is number => !!n),
    qaTarget: d.qaTarget,
    dilrTarget: d.dilrTarget,
    varcTarget: d.varcTarget,
    isMockDay: d.isMockDay,
    note: d.note,
  }));
  await db
    .insert(dailyPlan)
    .values(plan)
    .onConflictDoUpdate({
      target: dailyPlan.day,
      set: {
        phase: sql`excluded.phase`,
        phaseLabel: sql`excluded.phase_label`,
        focusTopicIds: sql`excluded.focus_topic_ids`,
        qaTarget: sql`excluded.qa_target`,
        dilrTarget: sql`excluded.dilr_target`,
        varcTarget: sql`excluded.varc_target`,
        isMockDay: sql`excluded.is_mock_day`,
        note: sql`excluded.note`,
      },
    });
  console.log(`  daily_plan    ${plan.length} days (${plan.filter((d) => d.isMockDay).length} mock days)`);

  /* percentile map --------------------------------------------------- */
  const rows = Object.entries(PERCENTILE_ANCHORS).flatMap(([scope, pts]) =>
    pts.map(([score, percentile]) => ({ scope, score, percentile })),
  );
  await db.delete(percentileMap);
  await db.insert(percentileMap).values(rows);
  console.log(`  percentiles   ${rows.length} anchors`);

  /* settings --------------------------------------------------------- */
  await db
    .insert(settings)
    .values([
      { key: 'targets', value: { qa: 20, dilr: 3, varc: 3 } },
      { key: 'goal', value: { qaPercentile: 95, overallPercentile: 95 } },
      { key: 'gmail', value: { historyId: null, lastSyncAt: null } },
    ])
    .onConflictDoNothing();
  console.log('  settings      targets / goal / gmail');

  console.log('done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
