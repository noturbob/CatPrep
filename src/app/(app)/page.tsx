import Link from 'next/link';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, questions, topics, mailMessages, dailyPlan } from '@/db/schema';
import { getDayProgress, getPlanFor, getStreak } from '@/lib/daily';
import { daysToCat, PHASES, type PhaseKey } from '@/lib/plan';
import { localDay, fmtDuration } from '@/lib/utils';
import { scoreForPercentile } from '@/data/percentiles';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function Ring({ done, total, label, color }: { done: number; total: number; label: string; color: string }) {
  const pct = total === 0 ? 0 : Math.min(1, done / total);
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-panel-2)" strokeWidth="6" />
          <circle
            cx="32" cy="32" r={R} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
          />
        </svg>
        <span className="nums absolute inset-0 flex items-center justify-center text-[12px] font-semibold">
          {done}<span className="text-faint">/{total}</span>
        </span>
      </div>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}

export default async function Dashboard() {
  const today = localDay();
  const [plan, progress, streak] = await Promise.all([
    getPlanFor(today), getDayProgress(today), getStreak(),
  ]);

  const focusTopics = plan?.focusTopicIds?.length
    ? await db.select({ name: topics.name, slug: topics.slug })
        .from(topics).where(inArray(topics.id, plan.focusTopicIds))
    : [];

  const [lifetime] = await db
    .select({
      total: sql<number>`count(*)::int`,
      correct: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
      timeMs: sql<number>`coalesce(sum(${attempts.timeMs}),0)::int`,
    })
    .from(attempts)
    .where(sql`${attempts.status} <> 'unseen'`);

  const [bankCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(questions).where(eq(questions.section, 'QA'));

  const [nextMock] = await db
    .select({ day: dailyPlan.day, note: dailyPlan.note })
    .from(dailyPlan)
    .where(and(eq(dailyPlan.isMockDay, true), sql`${dailyPlan.day} >= ${today}`))
    .orderBy(dailyPlan.day)
    .limit(1);

  const [actionMail] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(mailMessages)
    .where(and(eq(mailMessages.isActionRequired, true), eq(mailMessages.isArchived, false)));

  const phase = (plan?.phase ?? 'A') as PhaseKey;
  const qaFor95 = scoreForPercentile('QA', 95);
  const accuracy = lifetime.total ? Math.round((lifetime.correct / lifetime.total) * 100) : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* countdown + phase */}
      <section className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] text-muted">CAT 2026 · Sunday 29 November</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="nums text-[40px] font-semibold leading-none text-accent">{daysToCat()}</span>
            <span className="text-[13px] text-muted">days left</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-medium">{PHASES[phase].label}</p>
          <p className="mt-0.5 max-w-sm text-[11px] text-faint">{PHASES[phase].blurb}</p>
        </div>
      </section>

      {/* today */}
      <section className="mb-4 rounded border border-border bg-panel p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-semibold">Today</h2>
            {focusTopics.length > 0 && (
              <p className="mt-0.5 text-[12px] text-muted">
                Focus: {focusTopics.map((t) => t.name).join(', ')}
              </p>
            )}
            {plan?.note && <p className="mt-0.5 text-[11px] text-faint">{plan.note}</p>}
          </div>
          <Link
            href="/practice"
            className="rounded bg-accent px-3.5 py-1.5 text-[13px] font-medium text-bg hover:opacity-90"
          >
            {progress.QA.done > 0 ? 'Continue practice' : 'Start today'}
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Ring done={progress.QA.done} total={progress.QA.total || plan?.qaTarget || 20} label="QA" color="var(--color-qa)" />
          <Ring done={progress.DILR.done} total={progress.DILR.total || plan?.dilrTarget || 3} label="DILR sets" color="var(--color-dilr)" />
          <Ring done={progress.VARC.done} total={progress.VARC.total || plan?.varcTarget || 3} label="RC passages" color="var(--color-varc)" />

          <dl className="ml-auto grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] sm:grid-cols-3">
            <div><dt className="text-faint">Streak</dt><dd className="nums text-fg">{streak} d</dd></div>
            <div><dt className="text-faint">Accuracy</dt><dd className="nums text-fg">{accuracy}%</dd></div>
            <div><dt className="text-faint">Attempted</dt><dd className="nums text-fg">{lifetime.total}</dd></div>
            <div><dt className="text-faint">Time on task</dt><dd className="nums text-fg">{fmtDuration(lifetime.timeMs)}</dd></div>
            <div><dt className="text-faint">QA bank</dt><dd className="nums text-fg">{bankCount.n}</dd></div>
            <div>
              <dt className="text-faint">Next mock</dt>
              <dd className="text-fg">
                {plan?.isMockDay ? (
                  <Link href="/mock" className="text-accent underline underline-offset-2">today</Link>
                ) : nextMock ? (
                  <Link href="/mock" className="hover:text-accent">
                    {new Date(nextMock.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </Link>
                ) : '—'}
              </dd>
            </div>
          </dl>
        </div>

        {(progress.DILR.total === 0 || progress.VARC.total === 0) && (
          <p className="mt-4 rounded border border-border bg-panel-2 px-3 py-2 text-[11px] text-muted">
            No DILR sets or RC passages in the bank yet. Real CAT past sets are far better practice
            than anything generated — add them at{' '}
            <Link href="/admin/ingest" className="text-accent underline underline-offset-2">/admin/ingest</Link>.
          </p>
        )}
      </section>

      {/* goal + inbox */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded border border-border bg-panel p-4">
          <h3 className="text-[12px] font-semibold">QA target</h3>
          <p className="mt-2 text-[13px]">
            <span className="nums text-accent">{qaFor95}</span>
            <span className="text-muted"> / 66 raw for 95%ile</span>
          </p>
          <p className="mt-1 text-[11px] text-faint">
            About {Math.ceil(qaFor95 / 3)} net correct. Arithmetic and Algebra alone cover
            14–16 of the 22 questions, so the whitelist is enough.
          </p>
        </div>

        <Link href="/mail" className={cn(
          'rounded border bg-panel p-4 transition-colors hover:border-border-hi',
          actionMail.n > 0 ? 'border-accent/50' : 'border-border',
        )}>
          <h3 className="text-[12px] font-semibold">IIM inbox</h3>
          <p className="mt-2 text-[13px]">
            {actionMail.n > 0 ? (
              <><span className="nums text-accent">{actionMail.n}</span>
                <span className="text-muted"> needing action</span></>
            ) : (
              <span className="text-muted">Nothing needs action</span>
            )}
          </p>
          <p className="mt-1 text-[11px] text-faint">
            Scanned every 6 hours. Before CAT this only catches iimcat.ac.in mail;
            the shortlist flood starts in January.
          </p>
        </Link>
      </section>
    </main>
  );
}
