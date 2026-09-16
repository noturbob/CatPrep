'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { CatCalculator } from './cat-calculator';
import { Markdown } from '@/lib/md';
import { cn, fmtDuration } from '@/lib/utils';
import { submitAnswer, setErrorTag, toggleMarked } from '@/app/(app)/practice/actions';
import type {
  AttemptStatus, Difficulty, ErrorTag, QuestionType, Section,
} from '@/db/schema';

export type PlayerItem = {
  attemptId: number;
  questionId: number;
  section: Section;
  type: QuestionType;
  difficulty: Difficulty;
  stem: string;
  options: string[] | null;
  topicName: string;
  contextTitle: string | null;
  contextBody: string | null;
  status: AttemptStatus;
  selected: string | null;
  timeMs: number;
  visitCount: number;
  markedForReview: boolean;
  errorTag: ErrorTag | null;
};

type Result = { status: AttemptStatus; correct: boolean; answer: string; solution: string };

const SECTION_LABEL: Record<Section, string> = { QA: 'Quant', DILR: 'Data & logic', VARC: 'Reading' };
const SECTION_COLOR: Record<Section, string> = {
  QA: 'var(--color-qa)', DILR: 'var(--color-dilr)', VARC: 'var(--color-varc)',
};

const ERROR_TAGS: { tag: ErrorTag; label: string; hint: string }[] = [
  { tag: 'conceptual', label: "Didn't know the method", hint: "Didn't know the method" },
  { tag: 'calculation', label: 'Arithmetic slip', hint: 'Right method, arithmetic slip' },
  { tag: 'misread', label: 'Misread it', hint: 'Misread the question' },
  { tag: 'timeout', label: 'Ran out of time', hint: 'Knew it, ran out of time' },
];

/** Target seconds per question, for the pace indicator. */
const PACE_TARGET: Record<Section, number> = { QA: 110, DILR: 180, VARC: 120 };

export function QuestionPlayer({ items: initial, title }: { items: PlayerItem[]; title: string }) {
  const [items, setItems] = useState(initial);
  const [idx, setIdx] = useState(() => {
    const i = initial.findIndex((it) => it.status === 'unseen');
    return i === -1 ? 0 : i;
  });
  const [draft, setDraft] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, Result>>({});
  const [showCalc, setShowCalc] = useState(false);
  const [pending, startTransition] = useTransition();

  const item = items[idx];

  /** Time already banked before this session, keyed by attempt. Pure. */
  const initialTimes = useMemo(
    () => Object.fromEntries(initial.map((i) => [i.attemptId, i.timeMs])) as Record<number, number>,
    [initial],
  );

  /* Timer. The accumulated total lives in refs that are only ever touched
     inside effects and event handlers — never read during render — and the
     visible value is plain state driven by the interval callback. */
  const bankedRef = useRef<Record<number, number>>({});
  const startedAtRef = useRef(0);
  const [tick, setTick] = useState({ attemptId: -1, ms: 0 });

  useEffect(() => {
    const id = item.attemptId;
    // Same object for the component's lifetime; capture it so the cleanup
    // closes over the map rather than re-reading the ref.
    const banked = bankedRef.current;
    const base = banked[id] ?? initialTimes[id] ?? 0;
    startedAtRef.current = Date.now();
    const t = setInterval(
      () => setTick({ attemptId: id, ms: base + (Date.now() - startedAtRef.current) }),
      200,
    );
    return () => {
      clearInterval(t);
      banked[id] = base + (Date.now() - startedAtRef.current);
    };
  }, [item.attemptId, initialTimes]);

  const liveMs = tick.attemptId === item.attemptId
    ? tick.ms
    : (initialTimes[item.attemptId] ?? 0);

  const result = results[item.attemptId];
  const answered = item.status !== 'unseen';
  const value = draft[item.attemptId] ?? item.selected ?? '';

  const goto = useCallback((n: number) => {
    setIdx(Math.min(Math.max(0, n), items.length - 1));
  }, [items.length]);

  const submit = useCallback(() => {
    if (answered || pending) return;
    const base = bankedRef.current[item.attemptId] ?? initialTimes[item.attemptId] ?? 0;
    const totalMs = base + (Date.now() - startedAtRef.current);
    startTransition(async () => {
      const res = await submitAnswer({
        attemptId: item.attemptId,
        selected: value === '' ? null : value,
        timeMs: totalMs,
        visitCount: item.visitCount + 1,
      });
      setResults((r) => ({ ...r, [item.attemptId]: res }));
      setItems((list) =>
        list.map((it) =>
          it.attemptId === item.attemptId
            ? { ...it, status: res.status, selected: value === '' ? null : value, timeMs: totalMs }
            : it,
        ),
      );
    });
  }, [answered, pending, item, value, initialTimes]);

  /* Keyboard: 1-4 pick options, Enter submits then advances. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (items[idx].status === 'unseen') submit();
        else goto(idx + 1);
        return;
      }
      if (typing) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goto(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goto(idx - 1); }
      if (/^[1-4]$/.test(e.key) && items[idx].options && items[idx].status === 'unseen') {
        const opt = items[idx].options![Number(e.key) - 1];
        if (opt) setDraft((d) => ({ ...d, [items[idx].attemptId]: opt }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, items, submit, goto]);

  const done = items.filter((i) => i.status !== 'unseen').length;
  const correct = items.filter((i) => i.status === 'correct').length;
  const overPace = liveMs / 1000 > PACE_TARGET[item.section];

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      {/* ---------------------------------------------------------- header */}
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5">
        <div>
          <h1 className="text-[19px] font-normal text-fg">{title}</h1>
          <p className="mt-1.5 text-[13px] text-muted">
            <span className="nums text-fg">{done}</span>
            <span className="text-faint">/{items.length} done</span>
            {done > 0 && (
              <span className="text-faint">
                {'  '}
                <span className="nums text-ok">{correct}</span> correct,{' '}
                <span className="nums">{Math.round((correct / done) * 100)}%</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('nums text-[13px]', overPace ? 'text-bad' : 'text-muted')}>
            {fmtDuration(liveMs)}
            <span className="text-faint"> / {PACE_TARGET[item.section]}s</span>
          </span>
          <button
            type="button"
            onClick={() => setShowCalc((s) => !s)}
            className="rounded-[2px] border border-border px-3 py-1.5 text-[13px] text-fg transition-colors hover:border-border-hi"
          >
            {showCalc ? 'Hide calculator' : 'Calculator'}
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_180px]">
        {/* ------------------------------------------------------- question */}
        <div className="min-w-0">
          {item.contextBody && (
            <div className="mb-4 max-h-72 overflow-y-auto border-b border-border pb-4">
              {item.contextTitle && (
                <h2 className="mb-2 text-[12px] text-muted">{item.contextTitle}</h2>
              )}
              <Markdown className="prose-cat text-[13px] text-fg">{item.contextBody}</Markdown>
            </div>
          )}

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px] text-faint">
              <span style={{ color: SECTION_COLOR[item.section] }}>{SECTION_LABEL[item.section]}</span>
              <span className="text-muted">{item.topicName}</span>
              <span>{item.difficulty}</span>
              <span>{item.type === 'MCQ' ? '−1 if wrong' : 'no negative marking'}</span>
            </div>

            <Markdown className="prose-cat text-[15px] leading-relaxed text-fg">{item.stem}</Markdown>

            {/* ------------------------------------------------ answer area */}
            <div className="mt-5">
              {item.options ? (
                <div className="space-y-1.5">
                  {item.options.map((opt, i) => {
                    const picked = value === opt;
                    const isAnswer = result && opt === result.answer;
                    const isWrongPick = result && picked && !result.correct;
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={answered}
                        onClick={() => setDraft((d) => ({ ...d, [item.attemptId]: opt }))}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-[2px] border px-3 py-2.5 text-left text-[13px] transition-colors',
                          'disabled:cursor-default',
                          !answered && picked && 'border-accent bg-accent/10',
                          !answered && !picked && 'border-border bg-panel-2 hover:border-border-hi',
                          isAnswer && 'border-ok bg-ok/10',
                          isWrongPick && 'border-bad bg-bad/10',
                          answered && !isAnswer && !isWrongPick && 'border-border bg-panel-2 opacity-50',
                        )}
                      >
                        <span className="nums mt-px text-[11px] text-faint">{i + 1}</span>
                        <span className="flex-1 text-fg">{opt}</span>
                        {isAnswer && <span className="text-[11px] text-ok">correct</span>}
                        {isWrongPick && <span className="text-[11px] text-bad">your answer</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    disabled={answered}
                    value={value}
                    onChange={(e) => setDraft((d) => ({ ...d, [item.attemptId]: e.target.value }))}
                    placeholder="Your answer"
                    aria-label="Your answer"
                    className={cn(
                      'nums w-48 rounded-[2px] border bg-panel-2 px-3 py-2 text-[14px] text-fg placeholder:text-faint focus:outline-none',
                      result && result.correct && 'border-ok',
                      result && !result.correct && 'border-bad',
                      !result && 'border-border focus:border-accent',
                    )}
                  />
                  {result && !result.correct && (
                    <span className="text-[13px] text-muted">
                      correct answer <span className="nums text-ok">{result.answer}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* --------------------------------------------------- controls */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {!answered ? (
                <>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={pending}
                    className="rounded-[2px] bg-accent px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {pending ? 'Saving…' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDraft((d) => ({ ...d, [item.attemptId]: '' })); submit(); }}
                    disabled={pending}
                    className="text-[13px] text-faint underline decoration-faint/50 underline-offset-2 hover:text-muted"
                  >
                    Skip
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => goto(idx + 1)}
                  disabled={idx >= items.length - 1}
                  className="rounded-[2px] bg-accent px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Next
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const next = !item.markedForReview;
                  setItems((l) => l.map((it) => it.attemptId === item.attemptId ? { ...it, markedForReview: next } : it));
                  toggleMarked(item.attemptId, next);
                }}
                className={cn('rounded-[2px] border px-3 py-1.5 text-[13px] transition-colors',
                  item.markedForReview ? 'border-varc text-varc' : 'border-border text-muted hover:border-border-hi')}
              >
                {item.markedForReview ? 'Marked' : 'Mark for review'}
              </button>
              <span className="ml-auto hidden text-[11px] text-faint sm:block">
                Enter to submit, arrows to move{item.options ? ', 1–4 to pick' : ''}
              </span>
            </div>
          </div>

          {/* ------------------------------------------------ after answering */}
          {result && (
            <div className="settle mt-6 border-t border-border pt-5">
              <div className="mb-3 flex items-center gap-3">
                <span className={cn('text-[13px] font-medium',
                  result.status === 'correct' && 'text-ok',
                  result.status === 'wrong' && 'text-bad',
                  result.status === 'skipped' && 'text-muted')}>
                  {result.status === 'correct' ? 'Correct' : result.status === 'wrong' ? 'Wrong' : 'Skipped'}
                </span>
                <span className="nums text-[12px] text-faint">{fmtDuration(item.timeMs)}</span>
              </div>

              <Markdown className="prose-cat text-[13px] text-fg">{result.solution}</Markdown>

              {result.status !== 'correct' ? (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-2 text-[12px] text-muted">
                    What went wrong? One tap — this is what fills in your progress page.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ERROR_TAGS.map((t) => (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => {
                          setItems((l) => l.map((it) => it.attemptId === item.attemptId ? { ...it, errorTag: t.tag } : it));
                          setErrorTag(item.attemptId, t.tag);
                        }}
                        className={cn('rounded-[2px] border px-2.5 py-1 text-[12px] transition-colors',
                          item.errorTag === t.tag
                            ? 'border-accent text-accent'
                            : 'border-border text-muted hover:border-border-hi')}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setItems((l) => l.map((it) => it.attemptId === item.attemptId ? { ...it, errorTag: 'guess' } : it));
                      setErrorTag(item.attemptId, 'guess');
                    }}
                    className={cn('rounded-[2px] border px-2.5 py-1 text-[12px] transition-colors',
                      item.errorTag === 'guess'
                        ? 'border-accent text-accent'
                        : 'border-border text-muted hover:border-border-hi')}
                  >
                    I guessed this
                  </button>
                  <span className="ml-2 text-[11px] text-faint">
                    Keeps it in your revision queue even though it scored.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* -------------------------------------------------------- palette */}
        <aside className="lg:sticky lg:top-16 lg:self-start">
          <p className="mb-2 text-[11px] text-faint">This session</p>
          <div className="grid grid-cols-5 gap-1">
            {items.map((it, i) => (
              <button
                key={it.attemptId}
                type="button"
                onClick={() => goto(i)}
                aria-label={`Question ${i + 1}, ${it.status}`}
                aria-current={i === idx}
                className={cn(
                  'nums relative h-7 rounded-[2px] text-[11px] transition-colors',
                  i === idx && 'ring-1 ring-accent',
                  it.status === 'correct' && 'bg-ok/15 text-ok',
                  it.status === 'wrong' && 'bg-bad/15 text-bad',
                  it.status === 'skipped' && 'bg-panel-2 text-faint',
                  it.status === 'unseen' && 'bg-panel-2 text-muted',
                )}
              >
                {i + 1}
                {it.markedForReview && (
                  <span className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-varc" />
                )}
              </button>
            ))}
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-border pt-3 text-[12px]">
            {([['Correct', 'correct'], ['Wrong', 'wrong'],
               ['Skipped', 'skipped'], ['Left', 'unseen']] as const).map(([label, key]) => (
              <div key={key} className="flex items-center justify-between">
                <dt className="text-faint">{label}</dt>
                <dd className="nums text-fg">{items.filter((i) => i.status === key).length}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {showCalc && <CatCalculator onClose={() => setShowCalc(false)} />}
    </div>
  );
}
