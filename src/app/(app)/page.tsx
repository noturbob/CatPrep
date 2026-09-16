import Link from 'next/link';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, questions, topics, mailMessages, dailyPlan } from '@/db/schema';
import { getDayProgress, getPlanFor, getStreak } from '@/lib/daily';
import { daysToCat, PHASES, type PhaseKey } from '@/lib/plan';
import { localDay, fmtDuration, cn } from '@/lib/utils';
import { scoreForPercentile } from '@/data/percentiles';
import { Range, Figure } from '@/components/charts';
import { PACE_TARGET } from '@/lib/tracker';

export const dynamic = 'force-dynamic';

const SECTION_COLOR = {
  QA: 'var(--color-qa)', DILR: 'var(--color-dilr)', VARC: 'var(--color-varc)',
} as const;

export default async function Dashboard() {
  const today = localDay();
  const [plan, progress, streak] = await Promise.all([
    getPlanFor(today), getDayProgress(today), getStreak(),
  ]);

  const focusTopics = plan?.focusTopicIds?.length
    ? await db.select({ name: topics.name }).from(topics)
        .where(inArray(topics.id, plan.focusTopicIds))
    : [];

  const [lifetime] = await db
    .select({
      total: sql<number>`count(*) filter (where ${attempts.status} in ('correct','wrong'))::int`,
      correct: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
      timeMs: sql<number>`coalesce(sum(${attempts.timeMs}),0)::int`,
      medianMs: sql<number>`coalesce(percentile_cont(0.5) within group (
        order by ${attempts.timeMs}) filter (where ${attempts.status} in ('correct','wrong')),0)::int`,
    })
    .from(attempts);

  const [bankCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(questions).where(and(eq(questions.section, 'QA'), eq(questions.verified, true)));

  const [nextMock] = await db
    .select({ day: dailyPlan.day })
    .from(dailyPlan)
    .where(and(eq(dailyPlan.isMockDay, true), sql`${dailyPlan.day} >= ${today}`))
    .orderBy(dailyPlan.day).limit(1);

  const [actionMail] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(mailMessages)
    .where(and(eq(mailMessages.isActionRequired, true), eq(mailMessages.isArchived, false)));

  const phase = (plan?.phase ?? 'A') as PhaseKey;
  const left = daysToCat();
  const qaFor95 = scoreForPercentile('QA', 95);
  const accuracy = lifetime.total ? Math.round((lifetime.correct / lifetime.total) * 100) : 0;
  const medianSec = Math.round(lifetime.medianMs / 1000);
  // What 22 QA questions would yield at this accuracy, with CAT marking.
  const projected = Math.max(0, Math.round(16 * (accuracy / 100) * 3 - 16 * (1 - accuracy / 100)));

  const rows = [
    { key: 'QA', label: 'Quant', done: progress.QA.done, total: progress.QA.total || plan?.qaTarget || 20, unit: 'questions' },
    { key: 'DILR', label: 'Data & logic', done: progress.DILR.done, total: progress.DILR.total || plan?.dilrTarget || 3, unit: 'sets' },
    { key: 'VARC', label: 'Reading', done: progress.VARC.done, total: progress.VARC.total || plan?.varcTarget || 3, unit: 'passages' },
  ] as const;

  const allDone = rows.every((r) => r.total > 0 && r.done >= r.total);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      {/* ------------------------------------------------------ countdown */}
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-7">
        <div>
          <p className="readout text-[76px] text-fg sm:text-[96px]">{left}</p>
          <p className="mt-3 text-[13px] text-muted">
            days until CAT, Sunday 29 November
          </p>
        </div>
        <div className="max-w-[17rem] text-right">
          <p className="text-[13px] text-fg">{PHASES[phase].label.replace(/^Phase \w+ · /, '')}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-faint">{PHASES[phase].blurb}</p>
        </div>
      </header>

      {/* ---------------------------------------------------------- today */}
      <section className="border-b border-border py-7">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[13px] text-fg">
            Today
            {focusTopics.length > 0 && (
              <span className="text-muted"> — {focusTopics.map((t) => t.name).join(', ')}</span>
            )}
          </h2>
          <Link
            href="/practice"
            className="rounded-[2px] bg-accent px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90"
          >
            {allDone ? 'Review today' : progress.QA.done > 0 ? 'Continue' : 'Start today'}
          </Link>
        </div>

        <div className="divide-y divide-border">
          {rows.map((r) => (
            <Range
              key={r.key}
              label={r.label}
              value={r.done}
              max={r.total}
              fill={SECTION_COLOR[r.key]}
              valueLabel={`${r.done}/${r.total}`}
              meta={r.total === 0 ? 'nothing in the bank yet' : `${r.unit}`}
              tone={r.total > 0 && r.done >= r.total ? 'ok' : 'neutral'}
            />
          ))}
        </div>

        {plan?.note && (
          <p className="mt-4 text-[12px] leading-relaxed text-muted">{plan.note}</p>
        )}

        {(progress.DILR.total === 0 || progress.VARC.total === 0) && (
          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            No data-and-logic sets or reading passages yet. Past CAT papers are far better
            practice here than anything generated, so{' '}
            <Link href="/admin/ingest" className="text-accent underline decoration-accent/40 underline-offset-2">
              paste some in
            </Link>.
          </p>
        )}
      </section>

      {/* -------------------------------------------------- where you are */}
      <section className="border-b border-border py-7">
        <h2 className="mb-5 text-[13px] text-fg">Where you stand</h2>
        <div className="divide-y divide-border">
          <Range
            label="Quant score, projected from your accuracy"
            value={projected} max={66} target={qaFor95}
            fill="var(--color-qa)"
            valueLabel={`${projected}`}
            meta="raw marks out of 66"
            targetLabel={`${qaFor95} for 95th`}
            tone={projected >= qaFor95 ? 'ok' : 'neutral'}
          />
          <Range
            label="Accuracy"
            value={accuracy} max={100} target={70}
            fill={accuracy >= 70 ? 'var(--color-ok)' : 'var(--color-seq-3)'}
            valueLabel={`${accuracy}%`}
            meta={`${lifetime.correct} of ${lifetime.total} attempted`}
            targetLabel="70% target"
            tone={accuracy >= 70 ? 'ok' : 'neutral'}
          />
          <Range
            label="Median time per question"
            value={Math.min(medianSec, 240)} max={240} target={PACE_TARGET.QA}
            fill={medianSec > PACE_TARGET.QA ? 'var(--color-bad)' : 'var(--color-ok)'}
            valueLabel={`${medianSec}s`}
            meta={medianSec === 0 ? 'no attempts yet' : 'across every attempt'}
            targetLabel={`${PACE_TARGET.QA}s pace`}
            tone={lifetime.total === 0 ? 'neutral' : medianSec > PACE_TARGET.QA ? 'bad' : 'ok'}
          />
        </div>
      </section>

      {/* -------------------------------------------------------- figures */}
      <section className="grid grid-cols-2 gap-x-8 gap-y-6 border-b border-border py-7 sm:grid-cols-4">
        <Figure label="Streak" value={`${streak}`} against={streak === 1 ? 'day' : 'days running'} tone={streak > 0 ? 'signal' : 'neutral'} />
        <Figure label="Attempted" value={`${lifetime.total}`} against="questions so far" />
        <Figure label="Time on task" value={fmtDuration(lifetime.timeMs)} against="total" />
        <Figure label="Quant bank" value={`${bankCount.n}`} against="questions available" />
      </section>

      {/* --------------------------------------------------------- footer */}
      <section className="grid gap-x-8 gap-y-6 py-7 sm:grid-cols-2">
        <Link href="/mock" className="group">
          <p className="text-[12px] text-muted">Next mock</p>
          <p className="nums mt-1.5 text-[19px] leading-none text-fg group-hover:text-accent">
            {plan?.isMockDay ? 'Today' : nextMock
              ? new Date(nextMock.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
              : '—'}
          </p>
          <p className="mt-1.5 text-[11px] text-faint">
            Three sections, 40 minutes each, no going back.
          </p>
        </Link>

        <Link href="/mail" className="group">
          <p className="text-[12px] text-muted">IIM inbox</p>
          <p className={cn('nums mt-1.5 text-[19px] leading-none group-hover:text-accent',
            actionMail.n > 0 ? 'text-accent' : 'text-fg')}>
            {actionMail.n > 0 ? `${actionMail.n} need action` : 'Nothing pending'}
          </p>
          <p className="mt-1.5 text-[11px] text-faint">
            Checked every six hours. The shortlist mail starts in January.
          </p>
        </Link>
      </section>
    </main>
  );
}
