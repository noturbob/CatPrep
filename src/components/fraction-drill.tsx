"use client";

import { useEffect, useRef, useState } from "react";

const SECONDS = 10;
const ROUND = 20;

/* [numerator, denominator]. Unit fractions, the common multiples, and the
   >1 ratios that show up as successive % changes (5/4 = +25%, 8/7 = +14.28%). */
const POOL: [number, number][] = [
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 25, 40].map(
    (d) => [1, d] as [number, number],
  ),
  [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6],
  [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
  [3, 8], [5, 8], [7, 8],
  [2, 9], [4, 9], [5, 9], [7, 9], [8, 9],
  [2, 11], [3, 11], [5, 12], [7, 12], [11, 12],
  [3, 16], [5, 16], [7, 16], [3, 20], [7, 20],
  [5, 4], [6, 5], [7, 6], [8, 7], [9, 8], [10, 9], [4, 3], [3, 2],
];

const pct = ([n, d]: [number, number]) => (n / d) * 100;
const show = (f: [number, number]) => `${+pct(f).toFixed(2)}%`;

type Outcome = { f: [number, number]; given: string; ok: boolean };

function shuffle<T>(xs: T[]) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** The daily “20 fraction-to-percent conversions”, against a 10-second clock per card. */
export function FractionDrill() {
  const [deck, setDeck] = useState<[number, number][]>([]);
  const [idx, setIdx] = useState(0);
  const [draft, setDraft] = useState("");
  const [log, setLog] = useState<Outcome[]>([]);
  const [left, setLeft] = useState(SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);

  const f = deck[idx];
  const answered = log.length > idx;
  const done = deck.length > 0 && idx >= deck.length;

  function grade(given: string) {
    const v = parseFloat(given.replace("%", ""));
    // Two decimals, rounded or truncated, both pass: 14.28 and 14.29 for 1/7.
    setLog((l) => [...l, { f, given, ok: Math.abs(v - pct(f)) <= 0.01 }]);
  }

  // Countdown for the live card; a timeout grades whatever is typed.
  useEffect(() => {
    if (!f || answered) return;
    const end = Date.now() + SECONDS * 1000;
    inputRef.current?.focus();
    const t = setInterval(() => {
      const s = Math.max(0, (end - Date.now()) / 1000);
      setLeft(s);
      if (s === 0) {
        clearInterval(t);
        setLog((l) => (l.length > idx ? l : [...l, { f, given: "", ok: false }]));
      }
    }, 100);
    return () => clearInterval(t);
  }, [f, idx, answered]);

  function start(cards: [number, number][]) {
    setDeck(cards);
    setIdx(0);
    setLog([]);
    setDraft("");
    setLeft(SECONDS);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answered) return grade(draft);
    setIdx((i) => i + 1);
    setDraft("");
    setLeft(SECONDS);
  }

  const last = log[idx];
  const misses = log.filter((o) => !o.ok);

  return (
    <div className="lift rounded-sm border-2 border-line bg-card p-6">
      <h3 className="font-semibold">Fraction → percent drill</h3>
      <p className="mt-2 text-muted">
        Type the percentage; two decimals is enough. {SECONDS} seconds a card, {ROUND} cards a round. Enter submits,
        Enter again moves on.
      </p>

      {!f && !done && (
        <button onClick={() => start(shuffle(POOL).slice(0, ROUND))} className="btn btn-primary mt-6">
          Start a round
        </button>
      )}

      {f && (
        <form onSubmit={onSubmit} className="mt-6">
          <div className="flex justify-between text-caption text-muted">
            <span>{idx + 1} / {deck.length}</span>
            <span>{answered ? "" : `${Math.ceil(left)}s`}</span>
          </div>
          <div className="mt-1 h-2 rounded-sm border border-line">
            <div
              className={left < 3 ? "h-full bg-coral" : "h-full bg-sky"}
              style={{ width: `${answered ? 0 : (left / SECONDS) * 100}%` }}
            />
          </div>

          <p className="mt-8 text-center text-h1 font-light">{f[0]}/{f[1]}</p>

          <div className="mx-auto mt-5 flex max-w-xs items-center gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              readOnly={answered}
              inputMode="decimal"
              autoComplete="off"
              aria-label={`${f[0]}/${f[1]} as a percentage`}
              className="w-full rounded-sm border-2 border-line bg-card px-3 py-2 text-center text-sub focus:border-sky focus:outline-none"
            />
            <span className="text-sub text-muted">%</span>
          </div>

          {last && (
            <p className="mt-5 text-center" role="status">
              <span className={`rounded-sm px-2 py-0.5 font-semibold text-charcoal ${last.ok ? "bg-mint" : "bg-coral"}`}>
                {last.ok ? "Correct" : last.given ? "Wrong" : "Time up"}, {show(f)}
              </span>
              <span className="ml-3 text-caption text-muted">Enter for next</span>
            </p>
          )}
        </form>
      )}

      {done && (
        <div className="mt-6">
          <p className="text-sub">{log.length - misses.length} / {log.length} correct</p>
          {misses.length > 0 && (
            <ul className="mt-4 divide-y divide-faint border-y-2 border-line">
              {misses.map((o) => (
                <li key={o.f.join("/")} className="flex justify-between py-2">
                  <span>{o.f[0]}/{o.f[1]} = {show(o.f)}</span>
                  <span className="text-muted">{o.given ? `you: ${o.given}` : "timed out"}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex flex-wrap gap-6">
            {misses.length > 0 && (
              <button onClick={() => start(shuffle(misses.map((o) => o.f)))} className="btn btn-primary">
                Retry misses
              </button>
            )}
            <button onClick={() => start(shuffle(POOL).slice(0, ROUND))} className="btn btn-secondary">
              New round
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
