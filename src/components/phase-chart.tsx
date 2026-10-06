"use client";

import { useSyncExternalStore } from "react";
import { EXAM, START, daysBetween, istDate, mocks, phases } from "@/content/plan";

const SPAN = daysBetween(START, EXAM) + 1; // 56 day-columns, exam day included
const x = (d: string) => `${(daysBetween(START, d) / SPAN) * 100}%`;
const w = (from: string, to: string) => `${((daysBetween(from, to) + 1) / SPAN) * 100}%`;
const TICKS = ["2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26", "2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23"];
const short = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const noop = () => () => {};
const mid = (d: string) => `calc(${x(d)} + ${50 / SPAN}%)`;

/** Gantt of the seven phases and twelve mocks, with today marked once the browser knows the date. */
export function PhaseChart() {
  const today = useSyncExternalStore(noop, () => istDate(new Date()), () => null);
  const showToday = today && today >= START && today <= EXAM;

  const rows: { label: string; bold?: boolean; plot: React.ReactNode }[] = [
    ...phases.map((p) => ({
      label: p.name,
      plot: (
        <span
          className="absolute inset-y-1.5 rounded-sm border-2 border-line bg-sky"
          style={{ left: x(p.from), width: w(p.from, p.to) }}
          title={`${short(p.from)} to ${short(p.to)}`}
        />
      ),
    })),
    {
      label: "Full mocks (12)",
      plot: mocks.map((m, i) => (
        <span
          key={m}
          title={`Mock ${i + 1}, ${short(m)}`}
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-line bg-canary"
          style={{ left: mid(m) }}
        />
      )),
    },
    {
      label: "CAT 2026, 29 Nov",
      bold: true,
      plot: (
        <span
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-line bg-coral"
          style={{ left: mid(EXAM) }}
        />
      ),
    },
  ];

  // Exam-day and today markers are drawn inside every track, so they line up whether the
  // labels sit to the left (tablet and up) or above each bar (phones).
  const markers = (
    <>
      <span className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-coral" style={{ left: mid(EXAM) }} />
      {showToday && <span className="pointer-events-none absolute inset-y-0 border-l-2 border-ink" style={{ left: mid(today) }} />}
    </>
  );

  return (
    <figure className="lift rounded-sm border-2 border-line bg-card">
      <div className="p-4 sm:p-6">
        <div className="grid sm:grid-cols-[190px_1fr] sm:gap-x-4">
          <span className="max-sm:hidden" />
          <div className="relative mb-1 h-6 text-caption text-muted">
            {TICKS.map((t, i) => (
              <span key={t} className={`absolute whitespace-nowrap ${i === 0 ? "" : "-translate-x-1/2"} ${i % 2 ? "max-sm:hidden" : ""}`} style={{ left: x(t) }}>
                {short(t)}
              </span>
            ))}
          </div>
          {rows.map((r) => (
            <div key={r.label} className="contents">
              <div className={`flex items-end text-caption sm:h-9 sm:items-center ${r.bold ? "font-semibold" : ""} max-sm:mt-2`}>{r.label}</div>
              <div className="relative h-7 border-l border-faint sm:h-9">
                {markers}
                {r.plot}
              </div>
            </div>
          ))}
        </div>
        {showToday && (
          <p className="mt-3 flex items-center gap-2 text-caption text-muted">
            <span className="inline-block h-3 border-l-2 border-ink" aria-hidden /> today
            <span className="ml-4 inline-block h-3 border-l-2 border-dashed border-coral" aria-hidden /> exam day
          </p>
        )}
      </div>
      <figcaption className="border-t-2 border-line px-4 py-3 text-caption text-muted sm:px-6">
        Topics end on 31 October; November is real questions and mocks. Each bar is a phase, each diamond a full
        mock, and the dashed line is exam day.
      </figcaption>
    </figure>
  );
}
