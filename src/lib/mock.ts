import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  attempts, contexts, mockQuestions, mockRuns, mocks, questions, sessions, topics,
  type Section,
} from '@/db/schema';
import { localDay } from './utils';
import { scoreSection, statusFor, type SectionScore } from './scoring';
import { estimatePercentile } from '@/data/percentiles';

/** CAT's fixed order. Candidates cannot move between sections. */
export const SECTION_ORDER: Section[] = ['VARC', 'DILR', 'QA'];
export const SECTION_MINUTES = 40;
export const FULL_BLUEPRINT = { VARC: 24, DILR: 22, QA: 22 } as const;
export const QA_SECTIONAL = { VARC: 0, DILR: 0, QA: 22 } as const;

/** Network grace on the section deadline — generous enough to never punish
 *  a slow save, far too small to be worth exploiting. */
const GRACE_MS = 3000;

export type Blueprint = { VARC: number; DILR: number; QA: number };

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

/** Context-backed sections are filled whole set at a time — a DILR set or an
 *  RC passage is never split across a mock boundary. */
async function pickContextBacked(section: Section, target: number): Promise<number[]> {
  if (target <= 0) return [];
  const kind = section === 'DILR' ? 'dilr_set' : 'rc_passage';

  const sets = await db
    .select({ id: contexts.id })
    .from(contexts)
    .where(eq(contexts.kind, kind))
    .orderBy(sql`random()`);

  const out: number[] = [];
  for (const s of sets) {
    const qs = await db
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.contextId, s.id), eq(questions.verified, true)))
      .orderBy(asc(questions.id));
    if (qs.length === 0) continue;
    if (out.length + qs.length > target && out.length > 0) continue;
    out.push(...qs.map((q) => q.id));
    if (out.length >= target) break;
  }
  return out;
}

/** VARC standalone verbal ability, and all of QA. */
async function pickStandalone(section: Section, target: number, exclude: number[]): Promise<number[]> {
  if (target <= 0) return [];
  const rows = await db
    .select({ id: questions.id })
    .from(questions)
    .where(and(
      eq(questions.section, section),
      eq(questions.verified, true),
      sql`${questions.contextId} is null`,
      exclude.length ? sql`${questions.id} <> all(${sql.raw(`array[${exclude.join(',')}]::int[]`)})` : sql`true`,
    ))
    .orderBy(sql`random()`)
    .limit(target);
  return rows.map((r) => r.id);
}

export type AssemblyReport = {
  mockId: number;
  filled: Record<Section, number>;
  requested: Blueprint;
  shortfall: Partial<Record<Section, number>>;
};

export async function assembleMock(name: string, blueprint: Blueprint): Promise<AssemblyReport> {
  const picked: Record<Section, number[]> = { VARC: [], DILR: [], QA: [] };

  for (const section of SECTION_ORDER) {
    const target = blueprint[section];
    if (target <= 0) continue;
    if (section === 'QA') {
      picked.QA = await pickStandalone('QA', target, []);
    } else {
      const ctx = await pickContextBacked(section, target);
      const rest = await pickStandalone(section, target - ctx.length, ctx);
      picked[section] = [...ctx, ...rest];
    }
  }

  const [mock] = await db
    .insert(mocks)
    .values({ name, blueprint, source: 'original' })
    .returning();

  let order = 0;
  for (const section of SECTION_ORDER) {
    for (const questionId of picked[section]) {
      await db.insert(mockQuestions).values({
        mockId: mock.id, questionId, section, orderIdx: order++,
      });
    }
  }

  const filled = {
    VARC: picked.VARC.length, DILR: picked.DILR.length, QA: picked.QA.length,
  } as Record<Section, number>;
  const shortfall: Partial<Record<Section, number>> = {};
  for (const s of SECTION_ORDER) {
    if (blueprint[s] > filled[s]) shortfall[s] = blueprint[s] - filled[s];
  }

  return { mockId: mock.id, filled, requested: blueprint, shortfall };
}

/* ------------------------------------------------------------------ */
/* Run lifecycle — the clock lives on the server                       */
/* ------------------------------------------------------------------ */

/** Sections that actually have questions, in CAT order. */
async function activeSections(mockId: number): Promise<Section[]> {
  const rows = await db
    .select({ section: mockQuestions.section, n: sql<number>`count(*)::int` })
    .from(mockQuestions)
    .where(eq(mockQuestions.mockId, mockId))
    .groupBy(mockQuestions.section);
  const have = new Set(rows.filter((r) => r.n > 0).map((r) => r.section));
  return SECTION_ORDER.filter((s) => have.has(s));
}

export async function startMockRun(mockId: number): Promise<number> {
  const qs = await db
    .select()
    .from(mockQuestions)
    .where(eq(mockQuestions.mockId, mockId))
    .orderBy(asc(mockQuestions.orderIdx));
  if (qs.length === 0) throw new Error('mock has no questions');

  const [session] = await db
    .insert(sessions)
    .values({ kind: 'mock', day: localDay(), config: { mockId } })
    .returning();

  await db.insert(attempts).values(
    qs.map((q, i) => ({ questionId: q.questionId, sessionId: session.id, orderIdx: i })),
  );

  const active = await activeSections(mockId);
  const [run] = await db
    .insert(mockRuns)
    .values({
      mockId,
      sessionId: session.id,
      currentSection: SECTION_ORDER.indexOf(active[0]),
      sectionEndsAt: new Date(Date.now() + SECTION_MINUTES * 60_000),
    })
    .returning();

  return run.id;
}

export type RunState = {
  runId: number;
  mockId: number;
  mockName: string;
  sessionId: number;
  currentSection: Section | null;
  sectionEndsAt: string | null;
  submittedAt: string | null;
  activeSections: Section[];
  /** sections already closed, so the UI can grey them out */
  doneSections: Section[];
  /** server clock at read time — the client trusts this, not its own */
  serverNow: number;
};

/**
 * Reads the run and **self-heals**: if the section clock has expired while the
 * client was away (laptop shut, tab killed, network gone), the server rolls
 * forward here rather than trusting the client to report it. A refresh can
 * therefore never buy time, and an abandoned mock auto-submits.
 */
export async function getRunState(runId: number): Promise<RunState | null> {
  const [row] = await db
    .select({ run: mockRuns, mock: mocks })
    .from(mockRuns)
    .innerJoin(mocks, eq(mockRuns.mockId, mocks.id))
    .where(eq(mockRuns.id, runId))
    .limit(1);
  if (!row) return null;

  const active = await activeSections(row.run.mockId);
  let run = row.run;

  while (!run.submittedAt && run.sectionEndsAt.getTime() <= Date.now()) {
    const curIdx = active.indexOf(SECTION_ORDER[run.currentSection]);
    const next = active[curIdx + 1];
    if (!next) {
      run = await finishRun(run.id);
      break;
    }
    // Start the next section from the moment the previous one expired, not
    // from "now" — otherwise a late return would silently extend the exam.
    const nextEnd = new Date(run.sectionEndsAt.getTime() + SECTION_MINUTES * 60_000);
    const [updated] = await db
      .update(mockRuns)
      .set({ currentSection: SECTION_ORDER.indexOf(next), sectionEndsAt: nextEnd })
      .where(eq(mockRuns.id, run.id))
      .returning();
    run = updated;
  }

  const curIdx = run.submittedAt ? -1 : active.indexOf(SECTION_ORDER[run.currentSection]);
  return {
    runId: run.id,
    mockId: run.mockId,
    mockName: row.mock.name,
    sessionId: run.sessionId,
    currentSection: curIdx >= 0 ? active[curIdx] : null,
    sectionEndsAt: run.submittedAt ? null : run.sectionEndsAt.toISOString(),
    submittedAt: run.submittedAt?.toISOString() ?? null,
    activeSections: active,
    doneSections: curIdx >= 0 ? active.slice(0, curIdx) : active,
    serverNow: Date.now(),
  };
}

/** Ends the current section early, at the candidate's request. */
export async function endSection(runId: number): Promise<RunState | null> {
  const [run] = await db.select().from(mockRuns).where(eq(mockRuns.id, runId)).limit(1);
  if (!run || run.submittedAt) return getRunState(runId);

  const active = await activeSections(run.mockId);
  const curIdx = active.indexOf(SECTION_ORDER[run.currentSection]);
  const next = active[curIdx + 1];

  if (!next) { await finishRun(runId); return getRunState(runId); }

  await db
    .update(mockRuns)
    .set({
      currentSection: SECTION_ORDER.indexOf(next),
      sectionEndsAt: new Date(Date.now() + SECTION_MINUTES * 60_000),
    })
    .where(eq(mockRuns.id, runId));
  return getRunState(runId);
}

/** True when the answer arrived inside its own section's window. */
export async function isAnswerAllowed(runId: number, questionId: number): Promise<boolean> {
  const [run] = await db.select().from(mockRuns).where(eq(mockRuns.id, runId)).limit(1);
  if (!run || run.submittedAt) return false;
  if (run.sectionEndsAt.getTime() + GRACE_MS <= Date.now()) return false;

  const [mq] = await db
    .select({ section: mockQuestions.section })
    .from(mockQuestions)
    .where(and(eq(mockQuestions.mockId, run.mockId), eq(mockQuestions.questionId, questionId)))
    .limit(1);
  return !!mq && mq.section === SECTION_ORDER[run.currentSection];
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

export type MockScore = {
  sections: SectionScore[];
  total: number;
  totalPercentile: number;
  sectionPercentiles: Record<string, number>;
  timeMs: number;
  wrongTimeMs: number;
  slowest: { stem: string; timeMs: number; status: string }[];
  /**
   * How closely this paper resembles a real one. A mock drawn from a bank that
   * is mostly TITA and entirely in-scope will OVERSTATE the score: negative
   * marking barely bites, and none of the questions are ones you would skip by
   * design. The scorecard says so rather than letting a flattering percentile
   * stand unqualified.
   */
  calibration: {
    mcqShare: number;
    realMcqShare: number;
    outOfScopeCount: number;
    realistic: boolean;
    notes: string[];
  };
};

export async function computeScore(sessionId: number): Promise<MockScore> {
  const rows = await db
    .select({
      status: attempts.status,
      selected: attempts.selected,
      timeMs: attempts.timeMs,
      type: questions.type,
      section: questions.section,
      answer: questions.answer,
      stem: questions.stem,
      inScope: topics.inScope,
    })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(eq(attempts.sessionId, sessionId));

  const sections: SectionScore[] = [];
  const sectionPercentiles: Record<string, number> = {};
  let total = 0;

  for (const section of SECTION_ORDER) {
    const inSection = rows.filter((r) => r.section === section);
    if (inSection.length === 0) continue;
    const s = scoreSection(section, inSection.map((r) => ({
      status: r.status, type: r.type, inScope: r.inScope,
    })));
    sections.push(s);
    sectionPercentiles[section] = estimatePercentile(section, s.score);
    total += s.score;
  }

  const timeMs = rows.reduce((a, r) => a + r.timeMs, 0);
  const wrongTimeMs = rows.filter((r) => r.status === 'wrong').reduce((a, r) => a + r.timeMs, 0);
  const slowest = [...rows]
    .sort((a, b) => b.timeMs - a.timeMs)
    .slice(0, 5)
    .map((r) => ({ stem: r.stem, timeMs: r.timeMs, status: r.status }));

  const mcqShare = rows.length ? rows.filter((r) => r.type === 'MCQ').length / rows.length : 0;
  const outOfScopeCount = rows.filter((r) => !r.inScope).length;
  const REAL_MCQ_SHARE = 0.64; // ~48 MCQ of 68 in a real paper

  const notes: string[] = [];
  if (mcqShare < REAL_MCQ_SHARE - 0.15) {
    notes.push(
      `Only ${Math.round(mcqShare * 100)}% of this paper was MCQ against about ${Math.round(REAL_MCQ_SHARE * 100)}% in a real CAT. `
      + 'TITA carries no negative marking, so wrong answers cost you far less here than they will on exam day.',
    );
  }
  if (outOfScopeCount === 0) {
    notes.push(
      'Every question came from your in-scope topics. A real paper carries five to seven Geometry, '
      + 'Number System and Modern Math questions you would skip, so the real section is tighter on time than this.',
    );
  }

  return {
    sections, total,
    totalPercentile: estimatePercentile('OVERALL', total),
    sectionPercentiles, timeMs, wrongTimeMs, slowest,
    calibration: {
      mcqShare: Math.round(mcqShare * 100) / 100,
      realMcqShare: REAL_MCQ_SHARE,
      outOfScopeCount,
      realistic: notes.length === 0,
      notes,
    },
  };
}

async function finishRun(runId: number) {
  const [run] = await db.select().from(mockRuns).where(eq(mockRuns.id, runId)).limit(1);
  const score = await computeScore(run.sessionId);
  await db
    .update(sessions)
    .set({ endedAt: new Date() })
    .where(eq(sessions.id, run.sessionId));
  const [updated] = await db
    .update(mockRuns)
    .set({
      submittedAt: new Date(),
      score: {
        total: score.total,
        ...Object.fromEntries(score.sections.map((s) => [s.section, s.score])),
      },
    })
    .where(eq(mockRuns.id, runId))
    .returning();
  return updated;
}

export async function submitMock(runId: number) {
  const [run] = await db.select().from(mockRuns).where(eq(mockRuns.id, runId)).limit(1);
  if (!run || run.submittedAt) return;
  await finishRun(runId);
}

/** Grades every attempt in the run. Called once, at submission. */
export async function gradeRun(sessionId: number) {
  const rows = await db
    .select({ id: attempts.id, selected: attempts.selected, answer: questions.answer, type: questions.type })
    .from(attempts)
    .innerJoin(questions, eq(attempts.questionId, questions.id))
    .where(eq(attempts.sessionId, sessionId));

  for (const r of rows) {
    const status = statusFor(r.selected, r.answer, r.type);
    await db
      .update(attempts)
      .set({ status, isCorrect: r.selected === null ? null : status === 'correct' })
      .where(eq(attempts.id, r.id));
  }
}

export async function listMocks() {
  return db
    .select({
      id: mocks.id, name: mocks.name, blueprint: mocks.blueprint, createdAt: mocks.createdAt,
      runId: mockRuns.id, submittedAt: mockRuns.submittedAt, score: mockRuns.score,
      total: sql<number>`(select count(*) from ${mockQuestions} where ${mockQuestions.mockId} = ${mocks.id})::int`,
    })
    .from(mocks)
    .leftJoin(mockRuns, eq(mockRuns.mockId, mocks.id))
    .orderBy(sql`${mocks.createdAt} desc`);
}

/** How many questions a full/sectional mock could actually be built from. */
export async function bankAvailability() {
  const rows = await db
    .select({ section: questions.section, n: sql<number>`count(*)::int` })
    .from(questions)
    .where(eq(questions.verified, true))
    .groupBy(questions.section);
  const out: Record<Section, number> = { VARC: 0, DILR: 0, QA: 0 };
  for (const r of rows) out[r.section] = r.n;
  return out;
}
