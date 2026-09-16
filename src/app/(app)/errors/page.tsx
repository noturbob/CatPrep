import { getErrorLog, getLeeches } from '@/lib/tracker';
import { Markdown } from '@/lib/md';
import { fmtDuration } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TAG_LABEL: Record<string, string> = {
  conceptual: "Didn't know the method",
  calculation: 'Arithmetic slip',
  misread: 'Misread the question',
  timeout: 'Ran out of time',
  guess: 'Guessed',
};
const TAG_COLOR: Record<string, string> = {
  conceptual: 'var(--color-qa)',
  calculation: 'var(--color-dilr)',
  misread: 'var(--color-varc)',
  timeout: 'var(--color-s4)',
  guess: 'var(--color-faint)',
};

export default async function ErrorsPage() {
  const [errors, leeches] = await Promise.all([getErrorLog(), getLeeches()]);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <h1 className="text-[19px] font-normal text-fg">Mistakes</h1>
      <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-muted">
        Every question you got wrong, newest first. In the last fortnight before the exam,
        this is the most useful page in the app.
      </p>

      {leeches.length > 0 && (
        <section className="mt-7 border-b border-border pb-7">
          <h2 className="text-[13px] text-bad">
            Wrong twice or more — {leeches.length} {leeches.length === 1 ? 'question' : 'questions'}
          </h2>
          <p className="mb-4 mt-1 max-w-[60ch] text-[12px] leading-relaxed text-muted">
            These come back into your daily practice automatically. If one keeps
            reappearing, the concept needs a fresh read, not another attempt.
          </p>
          <ul className="divide-y divide-border border-y border-border">
            {leeches.map((l) => (
              <li key={l.questionId} className="flex items-start gap-3 py-2.5 text-[12px]">
                <span className="nums shrink-0 text-bad">{l.wrongCount}×</span>
                <span className="min-w-0 flex-1">
                  <span className="text-faint">{l.topicName}</span>
                  <span className="block text-fg">
                    {l.stem.slice(0, 110)}{l.stem.length > 110 ? '…' : ''}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {errors.length === 0 ? (
        <p className="py-16 text-center text-[13px] text-faint">
          Nothing wrong yet. Either you are doing well or you have not started.
        </p>
      ) : (
        <div className="mt-7 divide-y divide-border border-y border-border">
          {errors.map((e) => (
            <details key={e.attemptId} className="group">
              <summary className="cursor-pointer list-none px-0 py-3 [&::-webkit-details-marker]:hidden">
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-faint">
                  <span>{e.topicName}</span>
                  {e.errorTag && (
                    <span style={{ color: TAG_COLOR[e.errorTag] }}>{TAG_LABEL[e.errorTag]}</span>
                  )}
                  <span className="nums">{fmtDuration(e.timeMs)}</span>
                  {e.attemptedAt && <span className="nums">{e.attemptedAt.slice(0, 10)}</span>}
                  <span className="ml-auto text-faint group-open:hidden">solution ↓</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-fg">{e.stem}</p>
                <p className="mt-1.5 text-[12px]">
                  <span className="text-faint">you answered </span>
                  <span className="nums text-bad">{e.selected ?? '—'}</span>
                  <span className="text-faint">  correct </span>
                  <span className="nums text-ok">{e.answer}</span>
                </p>
              </summary>
              <div className="pb-4">
                <Markdown className="prose-cat text-[13px] text-fg">{e.solution}</Markdown>
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}
