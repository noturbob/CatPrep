import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getRunState, computeScore } from '@/lib/mock';
import { StatTile } from '@/components/charts';
import { fmtDuration, cn } from '@/lib/utils';
import { scoreForPercentile } from '@/data/percentiles';

export const dynamic = 'force-dynamic';

const SECTION_MAX = { VARC: 72, DILR: 66, QA: 66 } as const;

export default async function MockAnalysisPage({ params }: PageProps<'/mock/[id]/analysis'>) {
  const { id } = await params;
  const runId = Number(id);
  const state = await getRunState(runId);
  if (!state) redirect('/mock');
  if (!state.submittedAt) redirect(`/mock/${runId}/take`);

  const s = await computeScore(state.sessionId);
  const qa = s.sections.find((x) => x.section === 'QA');
  const wrongPct = s.timeMs ? Math.round((s.wrongTimeMs / s.timeMs) * 100) : 0;
  const qaTargetRaw = scoreForPercentile('QA', 95);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[13px] font-semibold">{state.mockName}</h1>
          <p className="mt-0.5 text-[12px] text-muted">
            Submitted {new Date(state.submittedAt).toLocaleString('en-GB')}
          </p>
        </div>
        <Link href="/mock" className="text-[12px] text-accent underline underline-offset-2">
          All mocks
        </Link>
      </div>

      <section className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatTile label="Total marks" value={String(s.total)} sub={`~${s.totalPercentile}%ile (estimate)`} tone="accent" />
        <StatTile label="Time used" value={fmtDuration(s.timeMs)} />
        <StatTile
          label="Time on wrong answers" value={`${wrongPct}%`}
          sub="the marks you paid twice for" tone={wrongPct > 35 ? 'bad' : 'default'}
        />
        {qa && (
          <StatTile
            label="QA attemptable accuracy" value={`${qa.attemptableAccuracy}%`}
            sub={`${qa.inScopeCorrect}/${qa.inScopeAttempted} in-scope`}
            tone={qa.attemptableAccuracy >= 70 ? 'ok' : 'bad'}
          />
        )}
      </section>

      {!s.calibration.realistic && (
        <section className="mb-5 rounded border border-accent/40 bg-accent/5 p-4">
          <h2 className="text-[12px] font-semibold text-accent">Read this score with a pinch of salt</h2>
          <ul className="mt-2 space-y-1.5 text-[11px] text-muted">
            {s.calibration.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-accent">—</span><span>{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-faint">
            The percentile above is therefore optimistic. It becomes trustworthy once real past
            papers are imported at <span className="text-muted">/admin/ingest</span>.
          </p>
        </section>
      )}

      {/* ------------------------------------------------- per section */}
      <section className="mb-5 space-y-3">
        {s.sections.map((sec) => {
          const max = SECTION_MAX[sec.section as keyof typeof SECTION_MAX] ?? 66;
          return (
            <div key={sec.section} className="rounded border border-border bg-panel p-4">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[12px] font-semibold">{sec.section}</h2>
                <p className="text-[12px]">
                  <span className="nums text-accent">{sec.score}</span>
                  <span className="text-faint"> / {max} · ~</span>
                  <span className="nums text-fg">{s.sectionPercentiles[sec.section]}</span>
                  <span className="text-faint">%ile</span>
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] sm:grid-cols-4">
                <div><dt className="text-faint">Correct</dt><dd className="nums text-ok">{sec.correct}</dd></div>
                <div><dt className="text-faint">Wrong</dt><dd className="nums text-bad">{sec.wrong}</dd></div>
                <div><dt className="text-faint">Skipped</dt><dd className="nums text-muted">{sec.skipped}</dd></div>
                <div><dt className="text-faint">Accuracy</dt><dd className="nums text-fg">{sec.accuracy}%</dd></div>
              </dl>

              {sec.outOfScopeSkipped > 0 && (
                <p className="mt-3 rounded border border-border bg-panel-2 px-3 py-2 text-[11px] text-muted">
                  <span className="nums text-fg">{sec.outOfScopeSkipped}</span> of those skips were
                  out-of-scope questions (Geometry, Number System, Modern Math) — skipped by design,
                  not missed. Your real number here is the{' '}
                  <span className="text-fg">attemptable accuracy of {sec.attemptableAccuracy}%</span>,
                  from {sec.inScopeCorrect}/{sec.inScopeAttempted} in-scope questions.
                </p>
              )}

              {sec.section === 'QA' && (
                <p className={cn('mt-2 text-[11px]',
                  sec.score >= qaTargetRaw ? 'text-ok' : 'text-muted')}>
                  {sec.score >= qaTargetRaw
                    ? `Above the ${qaTargetRaw} raw needed for a 95%ile QA sectional.`
                    : `${qaTargetRaw - sec.score} marks short of the ${qaTargetRaw} raw needed for 95%ile — about ${Math.ceil((qaTargetRaw - sec.score) / 3)} more correct.`}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* ------------------------------------------------- time sinks */}
      {s.slowest.length > 0 && (
        <section className="mb-5 rounded border border-border bg-panel p-4">
          <h2 className="text-[12px] font-semibold">Slowest questions</h2>
          <p className="mb-3 mt-0.5 text-[11px] text-muted">
            A slow question you got wrong is the worst outcome in a timed paper — that is where
            the section is actually lost.
          </p>
          <ul className="divide-y divide-border">
            {s.slowest.map((q, i) => (
              <li key={i} className="flex items-start gap-3 py-2">
                <span className={cn('nums shrink-0 rounded px-1.5 py-0.5 text-[11px]',
                  q.status === 'correct' && 'bg-ok/15 text-ok',
                  q.status === 'wrong' && 'bg-bad/15 text-bad',
                  q.status !== 'correct' && q.status !== 'wrong' && 'bg-panel-2 text-muted')}>
                  {fmtDuration(q.timeMs)}
                </span>
                <span className="min-w-0 flex-1 text-[12px] text-fg">
                  {q.stem.slice(0, 120)}{q.stem.length > 120 ? '…' : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[12px] text-muted">
        Every wrong answer from this mock is already in your{' '}
        <Link href="/errors" className="text-accent underline underline-offset-2">error log</Link>.
        Analyse it today, not tomorrow.
      </p>
    </main>
  );
}
