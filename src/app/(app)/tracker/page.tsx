import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { attempts } from '@/db/schema';
import {
  getTopicStats, getErrorTagBreakdown, getDailyActivity, getMockTrend, PACE_TARGET,
} from '@/lib/tracker';
import { StatTile, BarRow, TrendChart, accuracyFill } from '@/components/charts';
import { fmtDuration } from '@/lib/utils';
import { estimatePercentile, scoreForPercentile } from '@/data/percentiles';

export const dynamic = 'force-dynamic';

const TAG_LABEL: Record<string, string> = {
  conceptual: 'Concept gap',
  calculation: 'Calculation slip',
  misread: 'Misread question',
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
  const maxTime = Math.max(PACE_TARGET.QA * 1.5, ...practised.map((t) => t.medianSec));
  const maxTag = Math.max(1, ...tags.map((t) => t.n));

  // Projected QA raw score at the current accuracy, assuming 16 in-scope
  // questions attempted with CAT marking (+3 / -1 on MCQ).
  const projected = Math.round(16 * (accuracy / 100) * 3 - 16 * (1 - accuracy / 100) * 1);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-[13px] font-semibold">Tracker</h1>

      <section className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Accuracy" value={`${accuracy}%`} sub={`${life.correct}/${life.attempted} correct`}
          tone={accuracy >= 70 ? 'ok' : accuracy >= 50 ? 'default' : 'bad'} />
        <StatTile label="Median time / Q" value={`${medianSec}s`} sub={`target ${PACE_TARGET.QA}s`}
          tone={medianSec > PACE_TARGET.QA ? 'bad' : 'ok'} />
        <StatTile label="Time on task" value={fmtDuration(life.timeMs)} sub={`${activity.length} active days`} />
        <StatTile label="Time on wrong answers" value={`${wrongPct}%`}
          sub="of all practice time" tone={wrongPct > 40 ? 'bad' : 'default'} />
        <StatTile label="Projected QA raw" value={String(Math.max(0, projected))}
          sub={`${qaTarget} needed for 95%ile`} tone={projected >= qaTarget ? 'ok' : 'accent'} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ------------------------------------------------ topic mastery */}
        <section className="rounded border border-border bg-panel p-4">
          <h2 className="text-[12px] font-semibold">Topic mastery</h2>
          <p className="mb-3 mt-0.5 text-[11px] text-faint">
            Accuracy per in-scope topic. Darker means weaker.
          </p>
          {practised.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-faint">No attempts yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {practised.map((t) => (
                <BarRow
                  key={t.slug}
                  label={t.name}
                  value={t.accuracy}
                  max={100}
                  fill={accuracyFill(t.accuracy)}
                  valueLabel={`${t.accuracy}%`}
                  meta={`n=${t.attempted}`}
                />
              ))}
            </div>
          )}
          {untouched.length > 0 && (
            <p className="mt-3 border-t border-border pt-2 text-[11px] text-faint">
              Not started yet: {untouched.map((t) => t.name).join(', ')}
            </p>
          )}
        </section>

        {/* -------------------------------------------------- speed vs target */}
        <section className="rounded border border-border bg-panel p-4">
          <h2 className="text-[12px] font-semibold">Speed vs target</h2>
          <p className="mb-3 mt-0.5 text-[11px] text-faint">
            Median seconds per question. QA target is {PACE_TARGET.QA}s — red means slower.
          </p>
          {practised.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-faint">No attempts yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {practised.map((t) => {
                const target = PACE_TARGET[t.section as keyof typeof PACE_TARGET] ?? PACE_TARGET.QA;
                const over = t.medianSec > target;
                return (
                  <BarRow
                    key={t.slug}
                    label={t.name}
                    value={t.medianSec}
                    max={maxTime}
                    fill={over ? 'var(--color-bad)' : 'var(--color-ok)'}
                    valueLabel={`${t.medianSec}s`}
                    warn={over}
                    meta={over ? `+${t.medianSec - target}s` : `−${target - t.medianSec}s`}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* ------------------------------------------------ error breakdown */}
        <section className="rounded border border-border bg-panel p-4">
          <h2 className="text-[12px] font-semibold">Why you lose marks</h2>
          <p className="mb-3 mt-0.5 text-[11px] text-faint">
            Concept gaps need study. Calculation slips need the calculator and slower reading.
          </p>
          {tags.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-faint">
              No tagged errors yet — tag them right after each wrong answer.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {tags.map((t) => (
                <BarRow
                  key={t.tag}
                  label={TAG_LABEL[t.tag] ?? t.tag}
                  value={t.n}
                  max={maxTag}
                  fill={TAG_COLOR[t.tag] ?? 'var(--color-qa)'}
                  valueLabel={String(t.n)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ------------------------------------------------------ mock trend */}
        <section className="rounded border border-border bg-panel p-4">
          <h2 className="text-[12px] font-semibold">Mock percentile trend</h2>
          <p className="mb-3 mt-0.5 text-[11px] text-faint">
            Estimated from published score-vs-percentile reports, not official data.
          </p>
          {mocks.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-faint">
              No mocks taken yet. First one is scheduled for 18 October.
            </p>
          ) : (
            <TrendChart
              yLabel="Percentile"
              series={(['QA', 'DILR', 'VARC'] as const).map((sec, i) => ({
                name: sec,
                color: ['var(--color-qa)', 'var(--color-dilr)', 'var(--color-varc)'][i],
                points: mocks.map((m, x) => ({
                  x,
                  y: estimatePercentile(sec, ((m.score as Record<string, number> | null)?.[sec] ?? 0)),
                })),
              }))}
            />
          )}
        </section>
      </div>

      {/* --------------------------------------------------- activity strip */}
      <section className="mt-4 rounded border border-border bg-panel p-4">
        <h2 className="text-[12px] font-semibold">Daily volume</h2>
        <p className="mb-3 mt-0.5 text-[11px] text-faint">Questions attempted per day.</p>
        {activity.length === 0 ? (
          <p className="py-4 text-center text-[12px] text-faint">Nothing logged yet.</p>
        ) : (
          <div className="flex items-end gap-1 overflow-x-auto pb-1" style={{ minHeight: 64 }}>
            {activity.map((d) => {
              const max = Math.max(...activity.map((a) => a.attempted), 20);
              const h = Math.max(3, (d.attempted / max) * 52);
              const acc = d.attempted ? Math.round((d.correct / d.attempted) * 100) : 0;
              return (
                <div key={d.day} className="group relative flex shrink-0 flex-col items-center gap-1">
                  <div
                    className="w-4 rounded-[2px]"
                    style={{ height: h, background: accuracyFill(acc) }}
                    title={`${d.day}: ${d.attempted} attempted, ${acc}% correct`}
                  />
                  <span className="nums text-[9px] text-faint">{d.day.slice(8)}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
