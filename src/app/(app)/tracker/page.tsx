import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { attempts } from '@/db/schema';
import {
  getTopicStats, getErrorTagBreakdown, getDailyActivity, getMockTrend, PACE_TARGET,
} from '@/lib/tracker';
import { Range, Figure, TrendChart, accuracyFill } from '@/components/charts';
import { fmtDuration } from '@/lib/utils';
import { estimatePercentile, scoreForPercentile } from '@/data/percentiles';

export const dynamic = 'force-dynamic';

const TAG_LABEL: Record<string, string> = {
  conceptual: "Didn't know the method",
  calculation: 'Arithmetic slip',
  misread: 'Misread the question',
  timeout: 'Ran out of time',
};
const TAG_COLOR: Record<string, string> = {
  conceptual: 'var(--color-qa)',
  calculation: 'var(--color-dilr)',
  misread: 'var(--color-varc)',
  timeout: 'var(--color-s4)',
};

export default async function TrackerPage() {
  const [tstats, tags, activity, mocks, [life]] = await Promise.all([
    getTopicStats(), getErrorTagBreakdown(), getDailyActivity(), getMockTrend(),
    db.select({
      attempted: sql<number>`count(*) filter (where ${attempts.status} in ('correct','wrong'))::int`,
      correct: sql<number>`count(*) filter (where ${attempts.status} = 'correct')::int`,
      timeMs: sql<number>`coalesce(sum(${attempts.timeMs}),0)::int`,
      wrongMs: sql<number>`coalesce(sum(${attempts.timeMs}) filter (where ${attempts.status}='wrong'),0)::int`,
      medianMs: sql<number>`coalesce(percentile_cont(0.5) within group (
        order by ${attempts.timeMs}) filter (where ${attempts.status} in ('correct','wrong')),0)::int`,
    }).from(attempts),
  ]);

  const accuracy = life.attempted ? Math.round((life.correct / life.attempted) * 100) : 0;
  const medianSec = Math.round(life.medianMs / 1000);
  const wrongPct = life.timeMs ? Math.round((life.wrongMs / life.timeMs) * 100) : 0;
  const qaTarget = scoreForPercentile('QA', 95);

  const practised = tstats.filter((t) => t.attempted > 0);
  const untouched = tstats.filter((t) => t.attempted === 0 && t.section === 'QA');
  const maxTime = Math.max(PACE_TARGET.QA * 1.6, ...practised.map((t) => t.medianSec));
  const maxTag = Math.max(1, ...tags.map((t) => t.n));
  const maxDay = Math.max(20, ...activity.map((a) => a.attempted));

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <h1 className="text-[19px] font-normal text-fg">Progress</h1>
      <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-muted">
        Everything here is measured against what a 95th percentile actually needs, not
        against your own past scores.
      </p>

      <section className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-7 sm:grid-cols-4">
        <Figure label="Accuracy" value={`${accuracy}%`} against={`${life.correct} of ${life.attempted}`}
          tone={life.attempted === 0 ? 'neutral' : accuracy >= 70 ? 'ok' : accuracy >= 50 ? 'neutral' : 'bad'} size="lg" />
        <Figure label="Median per question" value={`${medianSec}s`} against={`${PACE_TARGET.QA}s is the pace`}
          tone={life.attempted === 0 ? 'neutral' : medianSec > PACE_TARGET.QA ? 'bad' : 'ok'} size="lg" />
        <Figure label="Time on task" value={fmtDuration(life.timeMs)}
          against={`${activity.length} active ${activity.length === 1 ? 'day' : 'days'}`} size="lg" />
        <Figure label="Spent on wrong answers" value={`${wrongPct}%`} against="of all practice time"
          tone={wrongPct > 40 ? 'bad' : 'neutral'} size="lg" />
      </section>

      {/* ------------------------------------------------- topic mastery */}
      <section className="border-b border-border py-7">
        <h2 className="text-[13px] text-fg">Accuracy by topic</h2>
        <p className="mb-4 mt-1 text-[12px] text-muted">
          The marker sits at 70%, roughly where quant stops costing you marks.
        </p>
        {practised.length === 0 ? (
          <p className="py-6 text-[13px] text-faint">
            Nothing attempted yet. This fills in after your first session.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {practised.map((t) => (
              <Range
                key={t.slug} label={t.name}
                value={t.accuracy} max={100} target={70}
                fill={accuracyFill(t.accuracy)}
                valueLabel={`${t.accuracy}%`}
                meta={`${t.correct} of ${t.attempted}`}
                tone={t.accuracy >= 70 ? 'ok' : t.accuracy < 50 ? 'bad' : 'neutral'}
              />
            ))}
          </div>
        )}
        {untouched.length > 0 && (
          <p className="mt-4 text-[12px] leading-relaxed text-faint">
            Not started: {untouched.map((t) => t.name).join(', ')}.
          </p>
        )}
      </section>

      {/* ---------------------------------------------------------- speed */}
      <section className="border-b border-border py-7">
        <h2 className="text-[13px] text-fg">Speed by topic</h2>
        <p className="mb-4 mt-1 text-[12px] text-muted">
          Median seconds per question. Past the marker and the section runs out before you do.
        </p>
        {practised.length === 0 ? (
          <p className="py-6 text-[13px] text-faint">Nothing attempted yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {practised.map((t) => {
              const target = PACE_TARGET[t.section as keyof typeof PACE_TARGET] ?? PACE_TARGET.QA;
              const over = t.medianSec > target;
              return (
                <Range
                  key={t.slug} label={t.name}
                  value={t.medianSec} max={maxTime} target={target}
                  fill={over ? 'var(--color-bad)' : 'var(--color-ok)'}
                  valueLabel={`${t.medianSec}s`}
                  meta={over ? `${t.medianSec - target}s over` : `${target - t.medianSec}s in hand`}
                  tone={over ? 'bad' : 'ok'}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* --------------------------------------------------- error causes */}
      <section className="border-b border-border py-7">
        <h2 className="text-[13px] text-fg">Why marks are going</h2>
        <p className="mb-4 mt-1 max-w-[60ch] text-[12px] leading-relaxed text-muted">
          Method gaps need study. Arithmetic slips need the calculator and a slower read.
          They are different problems, so they get fixed differently.
        </p>
        {tags.length === 0 ? (
          <p className="py-6 text-[13px] text-faint">
            No causes logged yet. Tag each wrong answer as you go — it takes one tap and it is
            the only way this page can tell you anything useful.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {tags.map((t) => (
              <Range
                key={t.tag} label={TAG_LABEL[t.tag] ?? t.tag}
                value={t.n} max={maxTag} fill={TAG_COLOR[t.tag] ?? 'var(--color-qa)'}
                valueLabel={String(t.n)}
                meta={t.n === 1 ? 'once' : `${t.n} times`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ----------------------------------------------------- mock trend */}
      <section className="border-b border-border py-7">
        <h2 className="text-[13px] text-fg">Mock percentiles</h2>
        <p className="mb-4 mt-1 text-[12px] text-muted">
          Estimated from published score reports. The dotted line is 95.
        </p>
        {mocks.length === 0 ? (
          <p className="py-6 text-[13px] text-faint">
            No mocks yet. The first one is scheduled for 18 October.
          </p>
        ) : (
          <TrendChart
            yLabel="Percentile"
            series={(['QA', 'DILR', 'VARC'] as const).map((sec, i) => ({
              name: sec,
              color: ['var(--color-qa)', 'var(--color-dilr)', 'var(--color-varc)'][i],
              points: mocks.map((m, x) => ({
                x, y: estimatePercentile(sec, (m.score as Record<string, number> | null)?.[sec] ?? 0),
              })),
            }))}
          />
        )}
      </section>

      {/* -------------------------------------------------- daily volume */}
      <section className="py-7">
        <h2 className="text-[13px] text-fg">Daily volume</h2>
        <p className="mb-4 mt-1 text-[12px] text-muted">
          Questions attempted each day, shaded by that day&apos;s accuracy.
        </p>
        {activity.length === 0 ? (
          <p className="py-6 text-[13px] text-faint">Nothing logged yet.</p>
        ) : (
          <ul className="flex items-end gap-[3px] overflow-x-auto pb-1">
            {activity.map((d) => {
              const acc = d.attempted ? Math.round((d.correct / d.attempted) * 100) : 0;
              return (
                <li key={d.day} className="flex shrink-0 flex-col items-center gap-1.5">
                  <span
                    className="w-[13px] rounded-[1px]"
                    style={{ height: Math.max(3, (d.attempted / maxDay) * 56), background: accuracyFill(acc) }}
                    title={`${d.day}: ${d.attempted} attempted, ${acc}% correct`}
                  />
                  <span className="nums text-[9px] text-faint">{d.day.slice(8)}</span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-[12px] text-faint">
          Quant target is {qaTarget} raw marks out of 66.
        </p>
      </section>
    </main>
  );
}
