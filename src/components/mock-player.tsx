'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CatCalculator } from './cat-calculator';
import { Markdown } from '@/lib/md';
import { cn, fmtClock } from '@/lib/utils';
import { saveMockAnswer, endSectionAction, submitMockAction, pollRun } from '@/app/(app)/mock/actions';
import type { Section } from '@/db/schema';

export type MockItem = {
  attemptId: number;
  questionId: number;
  section: Section;
  type: 'MCQ' | 'TITA';
  stem: string;
  options: string[] | null;
  contextTitle: string | null;
  contextBody: string | null;
  selected: string | null;
  markedForReview: boolean;
  visited: boolean;
};

/** The five states CAT's palette actually uses. */
type PaletteState = 'notVisited' | 'notAnswered' | 'answered' | 'marked' | 'answeredMarked';

function paletteState(it: MockItem, visited: boolean): PaletteState {
  const has = it.selected !== null && it.selected !== '';
  if (it.markedForReview) return has ? 'answeredMarked' : 'marked';
  if (has) return 'answered';
  return visited ? 'notAnswered' : 'notVisited';
}

const PALETTE_STYLE: Record<PaletteState, string> = {
  notVisited: 'bg-white text-slate-700 border border-slate-400',
  notAnswered: 'bg-[#d64b4b] text-white border border-[#b23a3a]',
  answered: 'bg-[#4a9b58] text-white border border-[#3b7d46]',
  marked: 'bg-[#7b5cd6] text-white border border-[#6448b5]',
  answeredMarked: 'bg-[#7b5cd6] text-white border border-[#6448b5]',
};

const LEGEND: { state: PaletteState; label: string }[] = [
  { state: 'answered', label: 'Answered' },
  { state: 'notAnswered', label: 'Not Answered' },
  { state: 'notVisited', label: 'Not Visited' },
  { state: 'marked', label: 'Marked for Review' },
  { state: 'answeredMarked', label: 'Answered & Marked' },
];

export function MockPlayer({
  runId, mockName, section, activeSections, doneSections,
  sectionEndsAt, serverNow, items: initial,
}: {
  runId: number;
  mockName: string;
  section: Section;
  activeSections: Section[];
  doneSections: Section[];
  sectionEndsAt: string;
  serverNow: number;
  items: MockItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [idx, setIdx] = useState(0);
  // Seeded with anything already visited plus the question we land on;
  // extended in goto(), which is where visiting actually happens.
  const [visited, setVisited] = useState<Set<number>>(() => {
    const s = new Set(initial.filter((i) => i.visited).map((i) => i.attemptId));
    if (initial[0]) s.add(initial[0].attemptId);
    return s;
  });
  const [showCalc, setShowCalc] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [, startTransition] = useTransition();

  /** Trust the server's clock, not the machine's. */
  const [offset] = useState(() => serverNow - Date.now());
  const endsAtMs = useMemo(() => new Date(sectionEndsAt).getTime(), [sectionEndsAt]);
  const [remaining, setRemaining] = useState(() => endsAtMs - (Date.now() + (serverNow - Date.now())));
  const expiredRef = useRef(false);

  const item = items[idx];

  /* ---- per-question timing, refs only touched in effects/handlers ---- */
  const bankedRef = useRef<Record<number, number>>({});
  const startedAtRef = useRef(0);
  useEffect(() => {
    const id = item.attemptId;
    const banked = bankedRef.current;
    const base = banked[id] ?? 0;
    startedAtRef.current = Date.now();
    return () => { banked[id] = base + (Date.now() - startedAtRef.current); };
  }, [item.attemptId]);

  const elapsedFor = useCallback((attemptId: number) =>
    (bankedRef.current[attemptId] ?? 0) + (Date.now() - startedAtRef.current), []);

  /* ---- countdown; expiry closes the section server-side ---- */
  useEffect(() => {
    const t = setInterval(() => {
      const left = endsAtMs - (Date.now() + offset);
      setRemaining(left);
      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        startTransition(async () => { await endSectionAction(runId); router.refresh(); });
      }
    }, 500);
    return () => clearInterval(t);
  }, [endsAtMs, offset, runId, router]);

  /* ---- resync with the server periodically, so an idle tab still closes ---- */
  useEffect(() => {
    const t = setInterval(() => {
      startTransition(async () => {
        const { state } = await pollRun(runId);
        if (state?.submittedAt || state?.currentSection !== section) router.refresh();
      });
    }, 30_000);
    return () => clearInterval(t);
  }, [runId, section, router]);

  /* ---- persistence. Saved on every navigation, not only on Save & Next:
         losing real practice answers to replicate CAT's harshness is a bad
         trade, and the Save & Next button is still the primary action. ---- */
  const persist = useCallback((it: MockItem, selected: string | null, marked: boolean) => {
    const timeMs = elapsedFor(it.attemptId);
    startTransition(async () => {
      await saveMockAnswer({
        runId, attemptId: it.attemptId, questionId: it.questionId,
        selected, timeMs, markedForReview: marked,
      });
    });
  }, [runId, elapsedFor]);

  const update = useCallback((selected: string | null, marked?: boolean) => {
    const m = marked ?? item.markedForReview;
    setItems((l) => l.map((x) => x.attemptId === item.attemptId
      ? { ...x, selected, markedForReview: m } : x));
    persist(item, selected, m);
  }, [item, persist]);

  const goto = useCallback((n: number) => {
    const next = Math.min(Math.max(0, n), items.length - 1);
    setIdx(next);
    const id = items[next]?.attemptId;
    if (id !== undefined) setVisited((v) => (v.has(id) ? v : new Set(v).add(id)));
  }, [items]);

  const saveNext = () => { update(item.selected); goto(idx + 1); };
  const markNext = () => { update(item.selected, true); goto(idx + 1); };
  const clearResponse = () => update(null);

  const counts = useMemo(() => {
    const c: Record<PaletteState, number> = {
      notVisited: 0, notAnswered: 0, answered: 0, marked: 0, answeredMarked: 0,
    };
    for (const it of items) c[paletteState(it, visited.has(it.attemptId))]++;
    return c;
  }, [items, visited]);

  const low = remaining <= 5 * 60_000;

  return (
    <div className="min-h-dvh bg-[#eceff1] text-slate-900">
      {/* ------------------------------------------------------ exam header */}
      <header className="border-b border-slate-400 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
          <span className="text-[13px] font-semibold">{mockName}</span>
          <div className="flex items-center gap-3">
            <button
              type="button" onClick={() => setShowCalc((s) => !s)}
              className="rounded border border-slate-400 bg-slate-100 px-2.5 py-1 text-[12px] hover:bg-slate-200"
            >
              Calculator
            </button>
            <span className={cn('nums rounded px-2.5 py-1 text-[13px] font-semibold',
              low ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800')}>
              Time left {fmtClock(Math.max(0, remaining))}
            </span>
          </div>
        </div>

        <div className="flex gap-px border-t border-slate-300 bg-slate-300 px-4">
          {activeSections.map((s) => {
            const done = doneSections.includes(s);
            const cur = s === section;
            return (
              <span key={s} className={cn('px-4 py-1.5 text-[12px]',
                cur && 'bg-white font-semibold text-blue-800',
                done && 'bg-slate-200 text-slate-500 line-through',
                !cur && !done && 'bg-slate-100 text-slate-500')}>
                {s}
              </span>
            );
          })}
          <span className="ml-auto self-center py-1.5 text-[11px] text-slate-600">
            Sections are locked in order — you cannot return to a finished one.
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-[1fr_230px]">
        {/* ------------------------------------------------------- question */}
        <div className="min-w-0">
          <div className="rounded border border-slate-300 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
              <span className="text-[12px] font-semibold">Question {idx + 1}</span>
              <span className="text-[11px] text-slate-500">
                {item.type === 'MCQ' ? '+3 / −1' : '+3 / no negative'}
              </span>
            </div>

            {item.contextBody && (
              <div className="max-h-64 overflow-y-auto border-b border-slate-200 bg-slate-50 px-4 py-3">
                {item.contextTitle && (
                  <h2 className="mb-1.5 text-[12px] font-semibold text-slate-700">{item.contextTitle}</h2>
                )}
                <Markdown className="prose-cat text-[13px] leading-relaxed text-slate-800">
                  {item.contextBody}
                </Markdown>
              </div>
            )}

            <div className="px-4 py-3">
              <Markdown className="prose-cat text-[14px] leading-relaxed text-slate-900">
                {item.stem}
              </Markdown>

              <div className="mt-4">
                {item.options ? (
                  <div className="space-y-1.5">
                    {item.options.map((opt, i) => (
                      <label
                        key={opt}
                        className={cn(
                          'flex cursor-pointer items-start gap-2.5 rounded border px-3 py-2 text-[13px]',
                          item.selected === opt
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-300 bg-white hover:bg-slate-50',
                        )}
                      >
                        <input
                          type="radio" name={`q${item.attemptId}`} checked={item.selected === opt}
                          onChange={() => update(opt)} className="mt-0.5"
                        />
                        <span className="text-slate-500">{String.fromCharCode(65 + i)}.</span>
                        <span className="flex-1 text-slate-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text" inputMode="decimal"
                    value={item.selected ?? ''}
                    onChange={(e) => update(e.target.value === '' ? null : e.target.value)}
                    placeholder="Type your answer"
                    aria-label="Your answer"
                    className="nums w-56 rounded border border-slate-400 bg-white px-3 py-2 text-[14px] focus:border-blue-600 focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2.5">
              <button type="button" onClick={markNext}
                className="rounded border border-slate-400 bg-white px-3 py-1.5 text-[12px] hover:bg-slate-100">
                Mark for Review &amp; Next
              </button>
              <button type="button" onClick={clearResponse}
                className="rounded border border-slate-400 bg-white px-3 py-1.5 text-[12px] hover:bg-slate-100">
                Clear Response
              </button>
              <button type="button" onClick={saveNext}
                className="ml-auto rounded bg-blue-700 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-800">
                Save &amp; Next
              </button>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- palette */}
        <aside>
          <div className="rounded border border-slate-300 bg-white">
            <div className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-[11px] font-semibold">
              {section} · {items.length} questions
            </div>

            <ul className="grid grid-cols-5 gap-1.5 p-3">
              {items.map((it, i) => {
                const st = paletteState(it, visited.has(it.attemptId));
                return (
                  <li key={it.attemptId}>
                    <button
                      type="button" onClick={() => goto(i)}
                      aria-label={`Question ${i + 1}, ${st}`}
                      aria-current={i === idx}
                      className={cn('nums h-8 w-full rounded text-[12px] font-medium',
                        PALETTE_STYLE[st], i === idx && 'ring-2 ring-blue-600 ring-offset-1')}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}
            </ul>

            <dl className="space-y-1 border-t border-slate-200 px-3 py-2 text-[11px]">
              {LEGEND.map((l) => (
                <div key={l.state} className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-slate-600">
                    <span className={cn('inline-block h-3 w-3 rounded-sm', PALETTE_STYLE[l.state])} />
                    {l.label}
                  </dt>
                  <dd className="nums text-slate-800">{counts[l.state]}</dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-slate-200 p-3">
              {!confirmEnd ? (
                <button
                  type="button" onClick={() => setConfirmEnd(true)}
                  className="w-full rounded bg-slate-700 px-3 py-2 text-[12px] font-semibold text-white hover:bg-slate-800"
                >
                  {doneSections.length + 1 === activeSections.length ? 'Submit mock' : 'End section'}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-700">
                    {doneSections.length + 1 === activeSections.length
                      ? 'Submit and see your scorecard?'
                      : `End ${section} and move on? You cannot come back.`}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startTransition(async () => {
                        update(item.selected);
                        if (doneSections.length + 1 === activeSections.length) {
                          await submitMockAction(runId);
                        } else {
                          await endSectionAction(runId);
                          router.refresh();
                        }
                      })}
                      className="flex-1 rounded bg-red-700 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-red-800"
                    >
                      Yes
                    </button>
                    <button
                      type="button" onClick={() => setConfirmEnd(false)}
                      className="flex-1 rounded border border-slate-400 bg-white px-3 py-1.5 text-[12px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {showCalc && <CatCalculator onClose={() => setShowCalc(false)} />}
    </div>
  );
}
