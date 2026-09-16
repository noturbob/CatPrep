import Link from 'next/link';
import { listMocks, bankAvailability } from '@/lib/mock';
import { MockCreate } from '@/components/mock-create';
import { estimatePercentile } from '@/data/percentiles';

export const dynamic = 'force-dynamic';

export default async function MockPage() {
  const [rows, available] = await Promise.all([listMocks(), bankAvailability()]);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <h1 className="text-[19px] font-normal text-fg">Mocks</h1>
      <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-muted">
        Real conditions: the clock runs on the server, so a refresh or a crash cannot buy
        you time.
      </p>

      <MockCreate available={available} />

      <section className="py-7">
        <h2 className="mb-4 text-[13px] text-fg">History</h2>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-faint">
            No mocks yet. Your first scheduled one is 18 October.
          </p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {rows.map((m) => {
              const score = m.score as Record<string, number> | null;
              return (
                <li key={`${m.id}-${m.runId ?? 'new'}`}
                  className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-fg">{m.name}</p>
                    <p className="nums mt-1 text-[12px] text-faint">
                      {m.total} questions
                      {m.submittedAt && score && (
                        <span className="text-muted">
                          {' — '}{score.total} marks, around the{' '}
                          {estimatePercentile('OVERALL', score.total)}th percentile
                        </span>
                      )}
                    </p>
                  </div>
                  {m.submittedAt ? (
                    <Link href={`/mock/${m.runId}/analysis`}
                      className="shrink-0 border border-border px-3 py-1.5 text-[12px] text-fg transition-colors hover:border-border-hi">
                      Analysis
                    </Link>
                  ) : m.runId ? (
                    <Link href={`/mock/${m.runId}/take`}
                      className="shrink-0 rounded-[2px] bg-accent px-3 py-1.5 text-[12px] font-medium text-bg transition-opacity hover:opacity-90">
                      Resume
                    </Link>
                  ) : (
                    <span className="shrink-0 text-[12px] text-faint">not started</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
