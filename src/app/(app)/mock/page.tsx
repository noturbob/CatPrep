import Link from 'next/link';
import { listMocks, bankAvailability } from '@/lib/mock';
import { MockCreate } from '@/components/mock-create';
import { estimatePercentile } from '@/data/percentiles';

export const dynamic = 'force-dynamic';

export default async function MockPage() {
  const [rows, available] = await Promise.all([listMocks(), bankAvailability()]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6">
      <h1 className="text-[13px] font-semibold">Mocks</h1>
      <p className="mb-4 mt-0.5 text-[12px] text-muted">
        Real conditions: the clock runs on the server, so a refresh or a crash cannot buy you time.
      </p>

      <div className="mb-6">
        <MockCreate available={available} />
      </div>

      <h2 className="mb-2 text-[12px] font-semibold">History</h2>
      {rows.length === 0 ? (
        <p className="rounded border border-border bg-panel py-8 text-center text-[12px] text-faint">
          No mocks yet. Your first scheduled one is 18 October.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((m) => {
            const score = m.score as Record<string, number> | null;
            return (
              <li key={`${m.id}-${m.runId ?? 'new'}`}
                className="flex flex-wrap items-center gap-3 rounded border border-border bg-panel px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-fg">{m.name}</p>
                  <p className="nums mt-0.5 text-[11px] text-faint">
                    {m.total} questions
                    {m.submittedAt && score && (
                      <> · {score.total} marks · ~{estimatePercentile('OVERALL', score.total)}%ile</>
                    )}
                  </p>
                </div>
                {m.submittedAt ? (
                  <Link href={`/mock/${m.runId}/analysis`}
                    className="rounded border border-border px-3 py-1 text-[12px] text-fg hover:border-border-hi">
                    Analysis
                  </Link>
                ) : m.runId ? (
                  <Link href={`/mock/${m.runId}/take`}
                    className="rounded bg-accent px-3 py-1 text-[12px] font-medium text-bg hover:opacity-90">
                    Resume
                  </Link>
                ) : (
                  <span className="text-[11px] text-faint">not started</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
