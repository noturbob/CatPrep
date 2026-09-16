import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getRunState, computeScore } from '@/lib/mock';
import { Figure, Range } from '@/components/charts';
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
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-normal text-fg">{state.mockName}</h1>
          <p className="mt-1.5 text-[12px] text-muted">
            Submitted {new Date(state.submittedAt).toLocaleString('en-GB')}
          </p>
        </div>
        <Link href="/mock" className="text-[13px] text-accent underline decoration-accent/40 underline-offset-2">
          All mocks
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-7 sm:grid-cols-4">
        <Figure label="Total marks" value={String(s.total)}
          against={`around the ${s.totalPercentile}th percentile`} tone="signal" size="lg" />
        <Figure label="Time used" value={fmtDuration(s.timeMs)} against="across every section" size="lg" />
        <Figure label="Spent on wrong answers" value={`${wrongPct}%`}
          against="the marks you paid for twice" tone={wrongPct > 35 ? 'bad' : 'neutral'} size="lg" />
        {qa && (
          <Figure label="Quant, questions you meant to attempt" value={`${qa.attemptableAccuracy}%`}
            against={`${qa.inScopeCorrect} of ${qa.inScopeAttempted} in scope`}
            tone={qa.inScopeAttempted === 0 ? 'neutral' : qa.attemptableAccuracy >= 70 ? 'ok' : 'bad'} size="lg" />
        )}
      </section>

      {!s.calibration.realistic && (
        <section className="border-b border-border py-7">
          <h2 className="text-[13px] text-accent">This score flatters you</h2>
          <ul className="mt-3 max-w-[66ch] divide-y divide-border border-y border-border">
            {s.calibration.notes.map((n) => (
              <li key={n} className="py-2.5 text-[12px] leading-relaxed text-muted">{n}</li>
            ))}
          </ul>
          <p className="mt-3 max-w-[66ch] text-[12px] leading-relaxed text-faint">
            Treat the percentile above as optimistic. It becomes trustworthy once real past
            papers are in the bank.
          </p>
        </section>
      )}

      {/* ------------------------------------------------- per section */}
      <section>
        {s.sections.map((sec) => {
          const max = SECTION_MAX[sec.section as keyof typeof SECTION_MAX] ?? 66;
          return (
            <div key={sec.section} className="border-b border-border py-7">
              <Range
                label={sec.section === 'QA' ? 'Quant' : sec.section === 'DILR' ? 'Data and logic' : 'Reading and verbal'}
                value={sec.score} max={max}
                target={sec.section === 'QA' ? qaTargetRaw : undefined}
                fill={`var(--color-${sec.section.toLowerCase()})`}
                valueLabel={`${sec.score}`}
                meta={`raw marks out of ${max}, around the ${s.sectionPercentiles[sec.section]}th percentile`}
                targetLabel={sec.section === 'QA' ? `${qaTargetRaw} for 95th` : undefined}
              />

              <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-[12px] sm:grid-cols-4">
                <div className="flex justify-between sm:block">
                  <dt className="text-faint">Correct</dt><dd className="nums mt-0.5 text-ok">{sec.correct}</dd></div>
                <div className="flex justify-between sm:block">
                  <dt className="text-faint">Wrong</dt><dd className="nums mt-0.5 text-bad">{sec.wrong}</dd></div>
                <div className="flex justify-between sm:block">
                  <dt className="text-faint">Left blank</dt><dd className="nums mt-0.5 text-muted">{sec.skipped}</dd></div>
                <div className="flex justify-between sm:block">
                  <dt className="text-faint">Accuracy</dt><dd className="nums mt-0.5 text-fg">{sec.accuracy}%</dd></div>
              </dl>

              {sec.outOfScopeSkipped > 0 && (
                <p className="mt-4 max-w-[64ch] text-[12px] leading-relaxed text-muted">
                  <span className="nums text-fg">{sec.outOfScopeSkipped}</span> of those skips were
                  out-of-scope questions (Geometry, Number System, Modern Math) — skipped by design,
                  not missed. Your real number here is the{' '}
                  <span className="text-fg">attemptable accuracy of {sec.attemptableAccuracy}%</span>,
                  from {sec.inScopeCorrect}/{sec.inScopeAttempted} in-scope questions.
                </p>
              )}

              {sec.section === 'QA' && (
                <p className={cn('mt-3 text-[12px]',
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
        <section className="border-b border-border py-7">
          <h2 className="text-[13px] text-fg">Where the time went</h2>
          <p className="mb-4 mt-1 max-w-[62ch] text-[12px] leading-relaxed text-muted">
            A slow question you got wrong is the worst outcome in a timed paper — that is where
            the section is actually lost.
          </p>
          <ul className="divide-y divide-border">
            {s.slowest.map((q, i) => (
              <li key={i} className="flex items-start gap-3 py-2">
                <span className={cn('nums shrink-0 rounded-[2px] px-1.5 py-0.5 text-[11px]',
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

      <p className="py-7 text-[13px] leading-relaxed text-muted">
        Every wrong answer from this mock is already in your{' '}
        <Link href="/errors" className="text-accent underline decoration-accent/40 underline-offset-2">mistakes page</Link>.
        Analyse it today, not tomorrow.
      </p>
    </main>
  );
}
