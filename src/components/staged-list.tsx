'use client';

import { useState, useTransition } from 'react';
import { approveStaged, discardStaged } from '@/app/(app)/admin/ingest/actions';
import { cn } from '@/lib/utils';

export type StagedRow = {
  id: number;
  stem: string;
  options: string[] | null;
  answer: string;
  solution: string;
  type: string;
  difficulty: string;
  topicName: string;
  contextKind: string | null;
  batchLabel: string | null;
};

/** Mirrors the server-side guard so the UI never offers a doomed approve. */
function blockers(q: StagedRow): string[] {
  const out: string[] = [];
  if (!q.answer?.trim()) out.push('no answer');
  if (!q.solution?.trim()) out.push('no solution');
  if (q.type === 'MCQ') {
    if (!q.options || q.options.length < 2) out.push('no options');
    else if (!q.options.includes(q.answer)) out.push('answer not among options');
  }
  return out;
}

export function StagedList({ rows }: { rows: StagedRow[] }) {
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const toggle = (id: number) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });

  const clean = rows.filter((r) => blockers(r).length === 0);

  const run = (fn: () => Promise<void>) => { setMsg(null); start(fn); };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button" disabled={pending || clean.length === 0}
          onClick={() => run(async () => {
            const r = await approveStaged(clean.map((c) => c.id));
            setMsg(`Approved ${r.approved}. They are in practice from now on.`);
            setSel(new Set());
          })}
          className="rounded bg-ok px-3 py-1.5 text-[12px] font-medium text-bg hover:opacity-90 disabled:opacity-40"
        >
          Approve all {clean.length} clean
        </button>
        <button
          type="button" disabled={pending || sel.size === 0}
          onClick={() => run(async () => {
            const r = await approveStaged([...sel]);
            setMsg(r.rejected.length
              ? `Approved ${r.approved}. Held back: ${r.rejected.join('; ')}`
              : `Approved ${r.approved}.`);
            setSel(new Set());
          })}
          className="rounded border border-border px-3 py-1.5 text-[12px] text-fg hover:border-border-hi disabled:opacity-40"
        >
          Approve selected ({sel.size})
        </button>
        <button
          type="button" disabled={pending || sel.size === 0}
          onClick={() => run(async () => {
            await discardStaged([...sel]);
            setMsg(`Discarded ${sel.size}.`);
            setSel(new Set());
          })}
          className="rounded border border-bad/50 px-3 py-1.5 text-[12px] text-bad hover:border-bad disabled:opacity-40"
        >
          Discard selected
        </button>
        {msg && <span role="status" className="text-[12px] text-muted">{msg}</span>}
      </div>

      <ul className="space-y-2">
        {rows.map((q) => {
          const bad = blockers(q);
          return (
            <li key={q.id} className={cn('rounded border bg-panel px-3 py-2',
              bad.length ? 'border-bad/40' : 'border-border')}>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox" checked={sel.has(q.id)} onChange={() => toggle(q.id)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-faint">
                    <span>{q.topicName}</span><span>·</span><span>{q.type}</span>
                    <span>·</span><span>{q.difficulty}</span>
                    {q.contextKind && (
                      <><span>·</span><span className="text-varc">
                        {q.contextKind === 'rc_passage' ? 'RC passage' : 'DILR set'}
                      </span></>
                    )}
                    {q.batchLabel && <><span>·</span><span>{q.batchLabel}</span></>}
                  </div>
                  <p className="mt-1 text-[12px] text-fg">{q.stem}</p>
                  {q.options && <p className="mt-1 text-[11px] text-muted">{q.options.join('  ·  ')}</p>}
                  <p className="mt-1 text-[11px]">
                    <span className="text-faint">answer </span>
                    <span className="nums text-ok">{q.answer || '—'}</span>
                  </p>
                  {bad.length > 0 && (
                    <p className="mt-1 text-[11px] text-bad">
                      cannot approve: {bad.join(' · ')} — fix it in the source and re-import
                    </p>
                  )}
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
