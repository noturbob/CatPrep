import { localDay } from './utils';

export const CAT_DATE = '2026-11-29'; // Sunday
export const PREP_START = '2026-09-16';

export type PhaseKey = 'A' | 'B' | 'C' | 'D' | 'EXAM';

export const PHASES: Record<PhaseKey, { label: string; blurb: string }> = {
  A: {
    label: 'Phase A · Concept build',
    blurb:
      'One Arithmetic topic every three days, in weightage order. Concept notes, then easy drill, then mixed drill.',
  },
  B: {
    label: 'Phase B · Algebra + mixed',
    blurb:
      'Algebra whitelist at four days per topic, difficulty ramping to CAT level, weekly full mock.',
  },
  C: {
    label: 'Phase C · Mock intensive',
    blurb:
      'Two mocks a week with deep analysis. Error log and leech list drive every revision session. No new topics.',
  },
  D: {
    label: 'Phase D · Taper',
    blurb:
      'Formula sheet, light revision, one half-mock, fix the sleep schedule. Nothing new goes in.',
  },
  EXAM: { label: 'CAT 2026', blurb: 'Exam day.' },
};

/** Arithmetic first (Phase A), then Algebra (Phase B) — by slug. */
const PHASE_A_TOPICS = [
  'tsd',
  'time-work',
  'percentages',
  'profit-loss',
  'ratio-proportion',
  'averages-mixtures',
  'si-ci',
  'word-problems',
];

const PHASE_B_TOPICS = [
  'equations',
  'inequalities',
  'functions',
  'logarithms',
  'progressions',
  'maxima-minima',
  'polynomials',
];

export type PlanDay = {
  day: string;
  dayNum: number;
  daysLeft: number;
  phase: PhaseKey;
  phaseLabel: string;
  /** topic slugs — resolved to ids by the seed script */
  focusSlugs: string[];
  qaTarget: number;
  dilrTarget: number;
  varcTarget: number;
  isMockDay: boolean;
  note: string;
};

function parse(d: string) {
  const [y, m, dd] = d.split('-').map(Number);
  return new Date(y, m - 1, dd);
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function phaseFor(day: Date): PhaseKey {
  const d = localDay(day);
  if (d >= CAT_DATE) return 'EXAM';
  if (d >= '2026-11-24') return 'D';
  if (d >= '2026-11-10') return 'C';
  if (d >= '2026-10-13') return 'B';
  return 'A';
}

/**
 * Builds the full prep calendar from PREP_START to CAT day.
 *
 * DILR and RC run every single day in every phase — those two are stamina
 * and pattern recognition, and cannot be crammed in the last fortnight.
 */
export function buildPlan(): PlanDay[] {
  const start = parse(PREP_START);
  const exam = parse(CAT_DATE);
  const total = daysBetween(start, exam); // 74
  const out: PlanDay[] = [];

  let aIdx = 0;
  let aCount = 0;
  let bIdx = 0;
  let bCount = 0;

  for (let i = 0; i <= total; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    const phase = phaseFor(cur);
    const dow = cur.getDay(); // 0 = Sunday
    const daysLeft = total - i;

    let focusSlugs: string[] = [];
    let isMockDay = false;
    let qaTarget = 20;
    let note = '';

    if (phase === 'A') {
      focusSlugs = [PHASE_A_TOPICS[Math.min(aIdx, PHASE_A_TOPICS.length - 1)]];
      aCount++;
      if (aCount >= 3 && aIdx < PHASE_A_TOPICS.length - 1) {
        aIdx++;
        aCount = 0;
      }
      // Sunday from 20 Sep: consolidate the fortnight, no new topic.
      if (dow === 0) {
        note = 'Revision day — redo every question you got wrong this week.';
      }
    } else if (phase === 'B') {
      focusSlugs = [PHASE_B_TOPICS[Math.min(bIdx, PHASE_B_TOPICS.length - 1)]];
      bCount++;
      if (bCount >= 4 && bIdx < PHASE_B_TOPICS.length - 1) {
        bIdx++;
        bCount = 0;
      }
      if (dow === 0) {
        isMockDay = true;
        qaTarget = 10;
        note = 'Full mock today. Analyse it the same evening, not tomorrow.';
      }
    } else if (phase === 'C') {
      // Everything in scope; the generator leans on the leech list.
      focusSlugs = [...PHASE_A_TOPICS, ...PHASE_B_TOPICS];
      if (dow === 0 || dow === 3) {
        isMockDay = true;
        qaTarget = 10;
        note = 'Mock + full analysis. Two a week from here.';
      } else {
        note = 'Error log and leech list only. No new topics.';
      }
    } else if (phase === 'D') {
      focusSlugs = [...PHASE_A_TOPICS, ...PHASE_B_TOPICS];
      qaTarget = 10;
      note = 'Taper. Formula sheet and light revision. Sleep on exam timing.';
      if (localDay(cur) === '2026-11-25') {
        isMockDay = true;
        note = 'Last half-mock. One section only, just to stay warm.';
      }
      if (localDay(cur) === '2026-11-28') {
        qaTarget = 0;
        note = 'Rest. Admit card, ID, test centre route. Nothing academic.';
      }
    } else {
      qaTarget = 0;
      note = 'CAT 2026. Go.';
    }

    out.push({
      day: localDay(cur),
      dayNum: i + 1,
      daysLeft,
      phase,
      phaseLabel: PHASES[phase].label,
      focusSlugs,
      qaTarget,
      dilrTarget: phase === 'EXAM' ? 0 : isMockDay ? 0 : 3,
      varcTarget: phase === 'EXAM' ? 0 : isMockDay ? 0 : 3,
      isMockDay,
      note,
    });
  }

  return out;
}

export function daysToCat(from: Date = new Date()): number {
  const [y, m, d] = CAT_DATE.split('-').map(Number);
  return Math.max(
    0,
    Math.round(
      (new Date(y, m - 1, d).getTime() -
        new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()) /
        86400000,
    ),
  );
}
