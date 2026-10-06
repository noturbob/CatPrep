"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { dilrFocus, focusOn, istDate, today, varcFocus } from "@/content/plan";

const noop = () => () => {};
const fmt = (s: string) =>
  new Date(s + "T00:00:00Z").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** The plan's entry for today's date in IST, across all three sections. Empty frame on the server. */
export function TodayCard() {
  const date = useSyncExternalStore(noop, () => istDate(new Date()), () => null);
  const t = date ? today(date) : null;

  return (
    <section aria-label="Today" className="lift rounded-sm border-2 border-line bg-card">
      <div className="flex items-baseline justify-between gap-4 border-b-2 border-line px-5 py-3">
        <h2 className="text-body font-semibold">{date ? fmt(date) : "Today"}</h2>
        {t?.kind === "study" && <span className="text-caption text-muted">Day {t.day} of 55</span>}
      </div>
      <div className="min-h-44 px-5 py-5">
        {!t && <p className="text-muted">Loading today’s plan…</p>}
        {t?.kind === "before" && <p className="text-sub">The plan starts on Monday 5 October, in {t.daysToStart} days.</p>}
        {t?.kind === "exam" && <p className="text-h3 font-light">CAT 2026 is today. VARC, then DILR, then QA: choose first, solve second.</p>}
        {t?.kind === "after" && (
          <p className="text-sub">
            CAT 2026 is done. Next: the <Link href="/admissions/calendar" className="underline decoration-2 underline-offset-4">backup exams and what happens after CAT</Link>.
          </p>
        )}
        {t?.kind === "study" && date && (
          <>
            <p className="flex items-baseline gap-3">
              <span className="text-display font-light">{t.daysLeft}</span>
              <span className="text-muted">{t.daysLeft === 1 ? "day" : "days"} to CAT, Sunday 29 November</span>
            </p>
            {t.mock && (
              <p className="mt-4 inline-block rounded-sm border border-charcoal bg-canary px-2 py-1 text-caption font-semibold text-charcoal">
                Mock {t.mock} of 12 today, analysed the same day
              </p>
            )}
            <dl className="mt-5 divide-y divide-faint border-y border-faint">
              <Row label="QA" sub="about 2¾ h" href={t.task.href} text={t.task.task} />
              <Row label="VARC" sub="about 1 h" href="/varc/practice" text={focusOn(varcFocus, date)?.text} />
              <Row label="DILR" sub="about 1 h" href="/dilr/practice" text={focusOn(dilrFocus, date)?.text} />
            </dl>
            {t.task.href && (
              <Link href={t.task.href} className="btn btn-primary mt-6">Open today’s QA section</Link>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Row({ label, sub, text, href }: { label: string; sub: string; text?: string; href?: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-3 py-3">
      <dt>
        <span className="block font-semibold">{label}</span>
        <span className="text-caption text-muted">{sub}</span>
      </dt>
      <dd>{href ? <Link href={href} className="hover:underline">{text}</Link> : text}</dd>
    </div>
  );
}
