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
    <div className="rounded border border-border bg-panel p-4">
      <h2 className="text-[12px] font-semibold">New mock</h2>
      <p className="mb-3 mt-0.5 text-[11px] text-muted">
        Assembled from verified questions in your bank. 40 minutes per section, fixed order,
        no going back.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button" onClick={() => make('qa')} disabled={pending || available.QA === 0}
          className="rounded bg-accent px-3 py-1.5 text-[12px] font-medium text-bg hover:opacity-90 disabled:opacity-40"
        >
          QA sectional · 22 Q · 40 min
        </button>
        <button
          type="button" onClick={() => make('full')} disabled={pending || !canFull}
          className="rounded border border-border px-3 py-1.5 text-[12px] text-fg hover:border-border-hi disabled:opacity-40"
        >
          Full mock · 68 Q · 120 min
        </button>
      </div>

      {!canFull && (
        <p className="mt-3 rounded border border-border bg-panel-2 px-3 py-2 text-[11px] text-muted">
          A full mock needs VARC and DILR content. Bank has{' '}
          <span className="nums text-fg">{available.VARC}</span> VARC,{' '}
          <span className="nums text-fg">{available.DILR}</span> DILR,{' '}
          <span className="nums text-fg">{available.QA}</span> QA.{' '}
          The QA sectional is the useful one until past papers are imported.
        </p>
      )}

      {report && (
        <div className="mt-3 rounded border border-border bg-panel-2 px-3 py-2">
          <p className="text-[12px] text-fg">
            Assembled{' '}
            {(['VARC', 'DILR', 'QA'] as const)
              .filter((s) => report.filled[s] > 0)
              .map((s) => `${report.filled[s]} ${s}`)
              .join(' · ')}
          </p>
          {Object.keys(report.shortfall).length > 0 && (
            <p className="mt-1 text-[11px] text-bad">
              Short by{' '}
              {Object.entries(report.shortfall).map(([s, n]) => `${n} ${s}`).join(', ')} —
              the bank does not have enough yet, so this mock is smaller than a real paper.
            </p>
          )}
          <button
            type="button" disabled={pending}
            onClick={() => start(async () => { await beginRun(report.mockId); })}
            className={cn('mt-2 rounded bg-ok px-3 py-1.5 text-[12px] font-medium text-bg hover:opacity-90',
              pending && 'opacity-50')}
          >
            Start now
          </button>
        </div>
      )}
    </div>
  );
}
