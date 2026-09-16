'use client';

import { useMemo, useState, useTransition } from 'react';
import { beginDrill } from '@/app/(app)/drill/actions';
import type { TopicOption } from '@/lib/drill';
import { accuracyFill } from './charts';
import { cn } from '@/lib/utils';
import type { Difficulty } from '@/db/schema';

const COUNTS = [10, 15, 20, 30] as const;
const DIFFICULTIES: { value: Difficulty | 'any'; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function DrillPicker({
  topics, initialTopicSlug,
}: { topics: TopicOption[]; initialTopicSlug?: string }) {
  const [topicSlug, setTopicSlug] = useState(
    () => (initialTopicSlug && topics.some((t) => t.slug === initialTopicSlug))
      ? initialTopicSlug : topics[0]?.slug ?? '',
  );
  const [difficulty, setDifficulty] = useState<Difficulty | 'any'>('any');
  const [unattemptedOnly, setUnattemptedOnly] = useState(false);
  const [count, setCount] = useState<number>(15);
  const [pending, start] = useTransition();

  const grouped = useMemo(() => {
    const areas = new Map<string, TopicOption[]>();
    for (const t of topics) {
      if (!areas.has(t.area)) areas.set(t.area, []);
      areas.get(t.area)!.push(t);
    }
    return [...areas.entries()];
  }, [topics]);

  const selected = topics.find((t) => t.slug === topicSlug);

  return (
    <div>
      <div className="divide-y divide-border border-y border-border">
        {grouped.map(([area, ts]) => (
          <div key={area} className="py-3">
            <p className="mb-2 text-[12px] text-faint">{area}</p>
            <div className="flex flex-wrap gap-2">
              {ts.map((t) => {
                const active = t.slug === topicSlug;
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => setTopicSlug(t.slug)}
                    className={cn(
                      'flex items-center gap-2 rounded-[2px] border px-2.5 py-1.5 text-[12px] transition-colors',
                      active ? 'border-accent text-fg' : 'border-border text-muted hover:border-border-hi',
                    )}
                  >
                    <span>{t.name}</span>
                    {t.attempted > 0 && (
                      <span
                        className="nums h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: accuracyFill(t.accuracy) }}
                        title={`${t.accuracy}% accuracy over ${t.attempted} attempts`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <p className="mt-3 text-[12px] text-muted">
          {selected.available} question{selected.available === 1 ? '' : 's'} available
          {selected.attempted > 0 && (
            <span> — {selected.accuracy}% accuracy so far over {selected.attempted} attempts</span>
          )}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-[12px] text-muted">Difficulty</p>
          <div className="mt-1.5 flex gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDifficulty(d.value)}
                className={cn('rounded-[2px] border px-2.5 py-1 text-[12px] transition-colors',
                  difficulty === d.value ? 'border-accent text-fg' : 'border-border text-muted hover:border-border-hi')}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] text-muted">Questions</p>
          <div className="mt-1.5 flex gap-1.5">
            {COUNTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCount(c)}
                className={cn('nums rounded-[2px] border px-2.5 py-1 text-[12px] transition-colors',
                  count === c ? 'border-accent text-fg' : 'border-border text-muted hover:border-border-hi')}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-end gap-2 pb-1.5 text-[12px] text-muted">
          <input
            type="checkbox" checked={unattemptedOnly}
            onChange={(e) => setUnattemptedOnly(e.target.checked)}
            className="accent-[var(--color-accent)]"
          />
          Unattempted only
        </label>
      </div>

      <button
        type="button"
        disabled={!topicSlug || pending}
        onClick={() => start(async () => {
          await beginDrill({ topicSlug, difficulty, unattemptedOnly, count });
        })}
        className="mt-5 rounded-[2px] bg-accent px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {pending ? 'Building…' : 'Start drill'}
      </button>
    </div>
  );
}
