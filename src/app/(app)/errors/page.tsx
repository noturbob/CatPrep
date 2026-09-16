import { getErrorLog, getLeeches } from '@/lib/tracker';
import { Markdown } from '@/lib/md';
import { fmtDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TAG_LABEL: Record<string, string> = {
  conceptual: 'Concept', calculation: 'Calculation',
  misread: 'Misread', timeout: 'Too slow', guess: 'Guess',
};

export default async function ErrorsPage() {
  const [errors, leeches] = await Promise.all([getErrorLog(), getLeeches()]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="text-[13px] font-semibold">Error log</h1>
      <p className="mb-5 mt-0.5 text-[12px] text-muted">
        Every question you got wrong, newest first. This is the single most valuable
        page in the app in the last fortnight before the exam.
      </p>

      {leeches.length > 0 && (
        <section className="mb-6 rounded border border-bad/40 bg-bad/5 p-4">
          <h2 className="text-[12px] font-semibold text-bad">
            Leeches · wrong {leeches.length === 1 ? 'twice' : 'two or more times'}
          </h2>
          <p className="mb-3 mt-0.5 text-[11px] text-muted">
            These are fed back into your daily practice automatically. If one keeps
            reappearing, the underlying concept needs a fresh read, not another attempt.
          </p>
          <ul className="space-y-1.5">
            {leeches.map((l) => (
              <li key={l.questionId} className="flex items-start gap-2 text-[12px]">
                <span className="nums mt-px shrink-0 rounded bg-bad/15 px-1.5 text-[11px] text-bad">
                  {l.wrongCount}x
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-faint">{l.topicName}</span>
                  <span className="text-faint"> · </span>
                  <span className="text-fg">{l.stem.slice(0, 110)}{l.stem.length > 110 ? '…' : ''}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {errors.length === 0 ? (
        <p className="rounded border border-border bg-panel py-10 text-center text-[13px] text-faint">
          Nothing wrong yet. Either you are doing well or you have not started.
        </p>
      ) : (
        <div className="space-y-2">
          {errors.map((e) => (
            <details key={e.attemptId} className="group rounded border border-border bg-panel">
              <summary className="cursor-pointer list-none px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-muted">{e.topicName}</span>
                  {e.errorTag && (
                    <span className={cn('rounded px-1.5 py-0.5',
                      e.errorTag === 'conceptual' && 'bg-qa/15 text-qa',
                      e.errorTag === 'calculation' && 'bg-dilr/15 text-dilr',
                      e.errorTag === 'misread' && 'bg-varc/15 text-varc',
                      e.errorTag === 'timeout' && 'bg-s4/15 text-s4',
                      e.errorTag === 'guess' && 'bg-panel-2 text-muted')}>
                      {TAG_LABEL[e.errorTag]}
                    </span>
                  )}
                  <span className="nums text-faint">{fmtDuration(e.timeMs)}</span>
                  {e.attemptedAt && (
                    <span className="nums text-faint">{e.attemptedAt.slice(0, 10)}</span>
                  )}
                  <span className="ml-auto text-faint group-open:hidden">show solution</span>
                </div>
                <p className="mt-1.5 text-[13px] text-fg">{e.stem}</p>
                <p className="mt-1.5 text-[12px]">
                  <span className="text-faint">you answered </span>
                  <span className="nums text-bad">{e.selected ?? '—'}</span>
                  <span className="text-faint"> · correct </span>
                  <span className="nums text-ok">{e.answer}</span>
                </p>
              </summary>
              <div className="border-t border-border px-4 py-3">
                <Markdown className="prose-cat text-[13px] text-fg">{e.solution}</Markdown>
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
