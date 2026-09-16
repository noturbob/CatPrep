import { parseDump } from '../src/lib/ingest-parser';

type Case = { name: string; input: string; check: (r: ReturnType<typeof parseDump>) => string | null };

const cases: Case[] = [
  {
    name: 'bracketed inline options, letter answer',
    input: `1. A train 180 m long crosses a platform 270 m in 25 s. Speed in km/h?
(a) 54   (b) 64.8   (c) 72   (d) 80
Ans: b
Sol: 450 m in 25 s = 18 m/s = 64.8 km/h.`,
    check: (r) => {
      const q = r.questions[0];
      if (r.questions.length !== 1) return `expected 1 question, got ${r.questions.length}`;
      if (q.type !== 'MCQ') return 'expected MCQ';
      if (JSON.stringify(q.options) !== JSON.stringify(['54', '64.8', '72', '80']))
        return `options wrong: ${JSON.stringify(q.options)}`;
      if (q.answer !== '64.8') return `answer should resolve b -> 64.8, got ${q.answer}`;
      return null;
    },
  },
  {
    name: 'decimal in option text is not mistaken for a label',
    input: `1. Pick one.
(a) 12.4 (b) 64.8 (c) 3.1 (d) 2.2
Ans: c
Sol: because.`,
    check: (r) => {
      const o = r.questions[0].options;
      return o?.length === 4 && o[1] === '64.8' ? null : `options wrong: ${JSON.stringify(o)}`;
    },
  },
  {
    name: 'numbered steps inside a solution do not split the question',
    input: `1. First question.
Ans: 5
Sol: Do this.
1. Step one
2. Step two
So the answer is 5.

2. Second question.
Ans: 9
Sol: Nine.`,
    check: (r) => {
      if (r.questions.length !== 2) return `expected 2 questions, got ${r.questions.length}`;
      if (!r.questions[0].solution?.includes('Step two')) return 'solution lost its steps';
      if (r.questions[1].answer !== '9') return 'second question mis-parsed';
      return null;
    },
  },
  {
    name: 'one option per line with numeric labels',
    input: `1. Profit percent?
(1) 24
(2) 25
(3) 26
(4) 30
Answer: 3
Solution: CP 100, SP 126.`,
    check: (r) => {
      const q = r.questions[0];
      if (q.options?.length !== 4) return `options: ${JSON.stringify(q.options)}`;
      return q.answer === '26' ? null : `answer should resolve 3 -> 26, got ${q.answer}`;
    },
  },
  {
    name: 'TITA when no options present',
    input: `1. Find x if 2x + 6 = 20.
Ans: 7
Difficulty: easy
Sol: 2x = 14 so x = 7.`,
    check: (r) => {
      const q = r.questions[0];
      if (q.type !== 'TITA') return 'expected TITA';
      if (q.difficulty !== 'easy') return `difficulty not parsed: ${q.difficulty}`;
      return q.answer === '7' ? null : `answer ${q.answer}`;
    },
  },
  {
    name: 'RC passage binds the questions that follow',
    input: `PASSAGE: Attention
Attention is scarce. Platforms compete for it.

1. Main idea?
(a) scarcity (b) platforms (c) capital (d) none
Ans: a
Sol: Stated directly.

2. Second one?
(a) x (b) y (c) z (d) w
Ans: b
Sol: Also stated.`,
    check: (r) => {
      if (r.contexts.length !== 1) return `expected 1 context, got ${r.contexts.length}`;
      if (r.contexts[0].kind !== 'rc_passage') return 'wrong context kind';
      if (!r.contexts[0].body.includes('Platforms compete')) return 'passage body lost';
      if (r.questions.some((q) => q.contextIdx !== 0)) return 'questions not bound to passage';
      return null;
    },
  },
  {
    name: 'SET header produces a DILR caselet',
    input: `SET: Five friends
A scored more than B. C is highest.

1. Who is highest?
(a) A (b) B (c) C (d) D
Ans: c
Sol: Given.`,
    check: (r) =>
      r.contexts[0]?.kind === 'dilr_set' ? null : `kind ${r.contexts[0]?.kind}`,
  },
  {
    name: 'missing answer and solution are flagged, not silently accepted',
    input: `1. A question with nothing else.
(a) p (b) q (c) r (d) s`,
    check: (r) => {
      const w = r.questions[0].warnings.join('|');
      if (!w.includes('no answer')) return `expected a no-answer warning, got: ${w}`;
      if (!w.includes('no solution')) return `expected a no-solution warning, got: ${w}`;
      return null;
    },
  },
  {
    name: 'answer not matching any option is flagged',
    input: `1. Pick.
(a) 10 (b) 20 (c) 30 (d) 40
Ans: 99
Sol: Something long enough to count as a solution.`,
    check: (r) =>
      r.questions[0].warnings.some((w) => w.includes('does not match'))
        ? null : `warnings: ${JSON.stringify(r.questions[0].warnings)}`,
  },
  {
    name: 'three options is flagged as not four',
    input: `1. Pick.
(a) 10 (b) 20 (c) 30
Ans: a
Sol: A solution that is definitely long enough here.`,
    check: (r) =>
      r.questions[0].warnings.some((w) => w.includes('3 options'))
        ? null : `warnings: ${JSON.stringify(r.questions[0].warnings)}`,
  },
];

let failed = 0;
for (const c of cases) {
  let err: string | null;
  try { err = c.check(parseDump(c.input)); }
  catch (e) { err = `threw: ${(e as Error).message}`; }
  if (err) { failed++; console.log(`FAIL  ${c.name}\n      ${err}`); }
  else console.log(`pass  ${c.name}`);
}
console.log(`\n${cases.length - failed}/${cases.length} parser tests pass`);
if (failed) process.exit(1);
