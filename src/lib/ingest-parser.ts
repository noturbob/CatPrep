import type { Difficulty, QuestionType } from '@/db/schema';

/**
 * Deterministic parser for pasted previous-year question dumps.
 *
 * Handles the shapes these actually arrive in — numbered stems, options
 * written inline or on their own lines, `Ans:` / `Answer:` lines, optional
 * `Sol:` blocks, and `PASSAGE:` / `SET:` headers that bind the questions
 * that follow to a shared RC passage or DILR caselet.
 *
 * No AI, no cost, and the result is auditable: every field came from a line
 * you can point at. The AI path exists only for input too messy for this.
 */

export type ParsedQuestion = {
  stem: string;
  options: string[] | null;
  answer: string | null;
  solution: string | null;
  type: QuestionType;
  difficulty: Difficulty;
  /** index into ParseResult.contexts, or null for a standalone question */
  contextIdx: number | null;
  warnings: string[];
};

export type ParsedContext = {
  kind: 'rc_passage' | 'dilr_set';
  title: string | null;
  body: string;
};

export type ParseResult = {
  contexts: ParsedContext[];
  questions: ParsedQuestion[];
};

const CONTEXT_RE = /^\s*(PASSAGE|RC|SET|CASELET|DILR)\s*(?:\d+)?\s*[:\-]\s*(.*)$/i;
const Q_START_RE = /^\s*(?:Q\.?\s*)?(\d{1,3})\s*[.)\]]\s*(.+)$/i;
const ANSWER_RE = /^\s*(?:Ans(?:wer)?|Correct(?:\s*Answer)?|Key)\s*[:.\-]?\s*(.+?)\s*$/i;
const SOLUTION_RE = /^\s*(?:Sol(?:ution)?|Explanation|Expl)\s*[:.\-]?\s*(.*)$/i;
const DIFF_RE = /^\s*(?:Difficulty|Level)\s*[:.\-]?\s*(easy|medium|hard)\s*$/i;

/**
 * Option labels, handled in two shapes:
 *   bracketed inline — `(a) 54  (b) 64.8  (c) 72  (d) 80`
 *   line-start label — `a) 54` / `1. 54` on its own line
 *
 * The bracket form REQUIRES real brackets, because a bare `4.` also occurs
 * inside decimals: an early version split "64.8" into an option.
 */
const BRACKET_OPT_RE = /(?:^|\s)[\(\[]\s*([a-dA-D1-4])\s*[\)\]]\s*/g;
const LINE_OPT_RE = /^\s*([a-dA-D1-4])\s*[.)]\s+(\S.*)$/;

type LabelledOption = { label: string; text: string };

const labelToIndex = (l: string): number =>
  /[1-4]/.test(l) ? Number(l) - 1 : l.toLowerCase().charCodeAt(0) - 97;

function extractOptions(line: string): LabelledOption[] | null {
  const marks = [...line.matchAll(BRACKET_OPT_RE)];
  if (marks.length > 0) {
    const out: LabelledOption[] = [];
    for (let i = 0; i < marks.length; i++) {
      const start = marks[i].index! + marks[i][0].length;
      const end = i + 1 < marks.length ? marks[i + 1].index! : line.length;
      const text = line.slice(start, end).trim().replace(/[,;]\s*$/, '');
      if (text) out.push({ label: marks[i][1].toLowerCase(), text });
    }
    return out.length ? out : null;
  }

  const m = line.match(LINE_OPT_RE);
  if (m) return [{ label: m[1].toLowerCase(), text: m[2].trim() }];
  return null;
}

/** Accepts the collected labels only if they run 1..n / a..n in order. */
function finaliseOptions(collected: LabelledOption[]): string[] | null {
  if (collected.length < 2) return null;
  const idx = collected.map((o) => labelToIndex(o.label));
  for (let i = 0; i < idx.length; i++) if (idx[i] !== i) return null;
  return collected.map((o) => o.text);
}

export function parseDump(raw: string): ParseResult {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const contexts: ParsedContext[] = [];
  const questions: ParsedQuestion[] = [];

  let ctxIdx: number | null = null;
  let collectingContext = false;
  let contextBuf: string[] = [];

  let cur: ParsedQuestion | null = null;
  let curNum = 0;
  let stemBuf: string[] = [];
  let solBuf: string[] = [];
  let optBuf: LabelledOption[] = [];
  let inSolution = false;
  let prevBlank = true;

  const flushContext = () => {
    if (collectingContext && contexts.length) {
      contexts[contexts.length - 1].body = contextBuf.join('\n').trim();
    }
    collectingContext = false;
    contextBuf = [];
  };

  const flushQuestion = () => {
    if (!cur) return;
    cur.stem = stemBuf.join('\n').trim();
    cur.solution = solBuf.length ? solBuf.join('\n').trim() : null;
    cur.options = finaliseOptions(optBuf);
    if (optBuf.length > 0 && cur.options === null) {
      cur.warnings.push(`option labels out of order (${optBuf.map((o) => o.label).join(',')})`);
    }
    cur.type = cur.options && cur.options.length >= 2 ? 'MCQ' : 'TITA';

    if (!cur.stem) cur.warnings.push('empty question text');
    if (!cur.answer) cur.warnings.push('no answer found — add an "Ans:" line');
    if (cur.type === 'MCQ') {
      if (cur.options!.length !== 4) cur.warnings.push(`${cur.options!.length} options found, expected 4`);
      if (cur.answer && !cur.options!.includes(cur.answer)) {
        cur.warnings.push('answer does not match any option');
      }
    }
    if (!cur.solution) cur.warnings.push('no solution — you will not learn from a bare answer');

    questions.push(cur);
    cur = null;
    stemBuf = [];
    solBuf = [];
    optBuf = [];
    inSolution = false;
  };

  /** Resolve "b" / "(b)" / "2" to the actual option text. */
  const resolveAnswer = (rawAns: string, options: string[] | null): string => {
    const a = rawAns.trim().replace(/^[\(\[]|[\)\].]$/g, '').trim();
    if (!options || options.length === 0) return a;
    if (options.includes(a)) return a;
    const short = a.toLowerCase();
    if (/^[a-d]$/.test(short)) {
      const i = short.charCodeAt(0) - 97;
      if (options[i] !== undefined) return options[i];
    }
    if (/^[1-4]$/.test(short)) {
      const i = Number(short) - 1;
      if (options[i] !== undefined) return options[i];
    }
    return a;
  };

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const trimmed = line.trim();
    prevBlank = li === 0 || lines[li - 1].trim() === '';

    const ctxM = trimmed.match(CONTEXT_RE);
    if (ctxM) {
      flushQuestion();
      flushContext();
      const kw = ctxM[1].toUpperCase();
      contexts.push({
        kind: kw === 'SET' || kw === 'CASELET' || kw === 'DILR' ? 'dilr_set' : 'rc_passage',
        title: ctxM[2].trim() || null,
        body: '',
      });
      ctxIdx = contexts.length - 1;
      collectingContext = true;
      contextBuf = [];
      continue;
    }

    const qM = trimmed.match(Q_START_RE);
    // Inside a solution a numbered line is usually a step ("1. Mark up to 140").
    // The discriminator is the blank line: dumps separate questions with one,
    // and never separate consecutive solution steps with one. Outside a
    // solution any numbered line starts a question.
    const qNum = qM ? Number(qM[1]) : 0;
    if (qM && (!inSolution || (prevBlank && qNum > curNum))) {
      flushQuestion();
      flushContext();
      curNum = qNum;
      cur = {
        stem: '', options: null, answer: null, solution: null,
        type: 'TITA', difficulty: 'medium', contextIdx: ctxIdx, warnings: [],
      };
      stemBuf = [qM[2]];
      continue;
    }

    if (collectingContext) { contextBuf.push(line); continue; }
    if (!cur) continue;

    const dM = trimmed.match(DIFF_RE);
    if (dM) { cur.difficulty = dM[1].toLowerCase() as Difficulty; continue; }

    const sM = trimmed.match(SOLUTION_RE);
    if (sM) { inSolution = true; if (sM[1].trim()) solBuf.push(sM[1].trim()); continue; }

    const aM = trimmed.match(ANSWER_RE);
    if (aM && !inSolution) { cur.answer = aM[1].trim(); continue; }

    if (inSolution) { solBuf.push(line); continue; }

    const opts = extractOptions(trimmed);
    if (opts) { optBuf.push(...opts); continue; }

    if (trimmed) stemBuf.push(trimmed);
  }

  flushQuestion();
  flushContext();

  for (const q of questions) {
    if (q.answer) q.answer = resolveAnswer(q.answer, q.options);
    if (q.type === 'MCQ' && q.answer && !q.options!.includes(q.answer)) {
      if (!q.warnings.includes('answer does not match any option')) {
        q.warnings.push('answer does not match any option');
      }
    } else if (q.type === 'MCQ' && q.answer) {
      q.warnings = q.warnings.filter((w) => w !== 'answer does not match any option');
    }
  }

  return { contexts, questions };
}
