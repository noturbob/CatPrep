'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createMock, beginRun } from '@/app/(app)/mock/actions';
import type { Section } from '@/db/schema';
import { cn } from '@/lib/utils';

export function MockCreate({ available }: { available: Record<Section, number> }) {
  const router = useRouter();
  const [report, setReport] = useState<{
    mockId: number; filled: Record<string, number>; shortfall: Record<string, number>;
  } | null>(null);
  const [pending, start] = useTransition();

  const make = (kind: 'full' | 'qa') =>
    start(async () => {
      const r = await createMock(kind);
      setReport({ mockId: r.mockId, filled: r.filled, shortfall: r.shortfall as Record<string, number> });
      router.refresh();
    });

  const canFull = available.VARC > 0 && available.DILR > 0 && available.QA > 0;

  return (
    <section className="border-b border-border py-7">
      <h2 className="text-[13px] text-fg">Start a mock</h2>
      <p className="mb-4 mt-1 max-w-[58ch] text-[12px] leading-relaxed text-muted">
        Assembled from verified questions in your bank. Forty minutes a section, fixed
        order, no going back.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button" onClick={() => make('qa')} disabled={pending || available.QA === 0}
          className="rounded-[2px] bg-accent px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Quant sectional — 22 questions, 40 min
        </button>
        <button
          type="button" onClick={() => make('full')} disabled={pending || !canFull}
          className="rounded-[2px] border border-border px-3.5 py-1.5 text-[13px] text-fg transition-colors hover:border-border-hi disabled:opacity-40"
        >
          Full mock — 68 questions, 120 min
        </button>
      </div>

      {!canFull && (
        <p className="mt-4 max-w-[58ch] text-[12px] leading-relaxed text-muted">
          A full mock needs reading and data-and-logic content — the bank has{' '}
          <span className="nums text-fg">{available.VARC}</span> verbal,{' '}
          <span className="nums text-fg">{available.DILR}</span> data-and-logic,{' '}
          <span className="nums text-fg">{available.QA}</span> quant. The quant
          sectional works today; a full mock waits on past papers going into ingest.
        </p>
      )}

      {report && (
        <div className="settle mt-4 max-w-[58ch] border-t border-border pt-4">
          <p className="text-[13px] text-fg">
            Assembled{' '}
            {(['VARC', 'DILR', 'QA'] as const)
              .filter((s) => report.filled[s] > 0)
              .map((s) => `${report.filled[s]} ${s}`)
              .join(', ')}
          </p>
          {Object.keys(report.shortfall).length > 0 && (
            <p className="mt-1.5 text-[12px] leading-relaxed text-bad">
              Short by {Object.entries(report.shortfall).map(([s, n]) => `${n} ${s}`).join(', ')} —
              the bank doesn&apos;t have enough yet, so this run is smaller than a real paper.
            </p>
          )}
          <button
            type="button" disabled={pending}
            onClick={() => start(async () => { await beginRun(report.mockId); })}
            className={cn('mt-3 rounded-[2px] bg-ok px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90',
              pending && 'opacity-50')}
          >
            Start now
          </button>
        </div>
      )}
    </section>
  );
}
