import Link from 'next/link';
import { getBankQuestions, getBankTopics, BANK_PAGE_SIZE, type BankFilters } from '@/lib/bank';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const SECTIONS = ['all', 'QA', 'DILR', 'VARC'] as const;
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'] as const;
const SOURCES: { value: string; label: string }[] = [
  { value: 'all', label: 'Any source' },
  { value: 'original', label: 'Original' },
  { value: 'pyq', label: 'Real previous-year' },
  { value: 'imported', label: 'Other imported' },
];
const STATUSES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unattempted', label: 'Unattempted' },
  { value: 'attempted', label: 'Attempted' },
];

function selectCls(active: boolean) {
  return cn('rounded-[2px] border px-2.5 py-1 text-[12px] transition-colors',
    active ? 'border-accent text-fg' : 'border-border text-muted hover:border-border-hi');
}

export default async function BankPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const filters: BankFilters = {
    section: (sp.section as BankFilters['section']) ?? 'all',
    topicSlug: sp.topic ?? 'all',
    difficulty: (sp.difficulty as BankFilters['difficulty']) ?? 'all',
    source: (sp.source as BankFilters['source']) ?? 'all',
    status: (sp.status as BankFilters['status']) ?? 'all',
    page: Math.max(0, Number(sp.page ?? 0) || 0),
  };

  const [topics, { rows, total }] = await Promise.all([getBankTopics(), getBankQuestions(filters)]);
  const topicsForSection = filters.section === 'all' ? topics : topics.filter((t) => t.section === filters.section);
  const pages = Math.max(1, Math.ceil(total / BANK_PAGE_SIZE));

  /** Builds a link that keeps every current filter except the one being changed. */
  const href = (patch: Record<string, string | number>) => {
    const params = new URLSearchParams({
      section: filters.section, topic: filters.topicSlug, difficulty: filters.difficulty,
      source: filters.source, status: filters.status, page: '0',
    });
    for (const [k, v] of Object.entries(patch)) params.set(k, String(v));
    if (params.get('section') === 'all') params.delete('section');
    if (params.get('topic') === 'all') params.delete('topic');
    if (params.get('difficulty') === 'all') params.delete('difficulty');
    if (params.get('source') === 'all') params.delete('source');
    if (params.get('status') === 'all') params.delete('status');
    if (params.get('page') === '0') params.delete('page');
    const qs = params.toString();
    return qs ? `/bank?${qs}` : '/bank';
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <h1 className="text-[19px] font-normal text-fg">Bank</h1>
      <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-muted">
        Every verified question, filterable by section, topic, difficulty and where it came
        from. <span className="nums text-fg">{total}</span> match{total === 1 ? 'es' : ''} the
        current filter.
      </p>

      <div className="mt-6 space-y-3 border-b border-border pb-6">
        <div className="flex flex-wrap gap-1.5">
          {SECTIONS.map((s) => (
            <Link key={s} href={href({ section: s, topic: 'all' })} className={selectCls(filters.section === s)}>
              {s === 'all' ? 'All sections' : s}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Link href={href({ topic: 'all' })} className={selectCls(filters.topicSlug === 'all')}>
            All topics
          </Link>
          {topicsForSection.map((t) => (
            <Link key={t.slug} href={href({ topic: t.slug })} className={selectCls(filters.topicSlug === t.slug)}>
              {t.name} <span className="nums text-faint">{t.count}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((d) => (
              <Link key={d} href={href({ difficulty: d })} className={selectCls(filters.difficulty === d)}>
                {d === 'all' ? 'Any difficulty' : d}
              </Link>
            ))}
          </div>
          <div className="flex gap-1.5">
            {SOURCES.map((s) => (
              <Link key={s.value} href={href({ source: s.value })} className={selectCls(filters.source === s.value)}>
                {s.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-1.5">
            {STATUSES.map((s) => (
              <Link key={s.value} href={href({ status: s.value })} className={selectCls(filters.status === s.value)}>
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {filters.topicSlug !== 'all' && (
          <Link
            href={`/drill?topic=${filters.topicSlug}`}
            className="inline-block rounded-[2px] bg-accent px-3 py-1.5 text-[12px] font-medium text-bg transition-opacity hover:opacity-90"
          >
            Drill this topic
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-faint">Nothing matches this filter.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border border-b border-border">
          {rows.map((r) => (
            <li key={r.id} className="py-3">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-faint">
                <span>{r.topicName}</span>
                <span>{r.type}</span>
                <span>{r.difficulty}</span>
                {r.source !== 'original' && (
                  <span className="text-varc">
                    {r.source === 'pyq' ? 'real previous-year' : 'imported'}
                    {r.sourceYear ? ` — ${r.sourceYear}` : ''}
                    {r.sourceSlot ? `, ${r.sourceSlot}` : ''}
                  </span>
                )}
                {r.attempted && (
                  <span className={r.lastCorrect ? 'text-ok' : 'text-bad'}>
                    {r.lastCorrect ? 'last correct' : 'last wrong'}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[13px] text-fg">
                {r.stem.slice(0, 180)}{r.stem.length > 180 ? '…' : ''}
              </p>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[12px]">
          <Link
            href={href({ page: Math.max(0, filters.page - 1) })}
            aria-disabled={filters.page === 0}
            className={cn('text-accent underline decoration-accent/40 underline-offset-2',
              filters.page === 0 && 'pointer-events-none text-faint no-underline')}
          >
            Previous
          </Link>
          <span className="nums text-faint">{filters.page + 1} / {pages}</span>
          <Link
            href={href({ page: Math.min(pages - 1, filters.page + 1) })}
            aria-disabled={filters.page >= pages - 1}
            className={cn('text-accent underline decoration-accent/40 underline-offset-2',
              filters.page >= pages - 1 && 'pointer-events-none text-faint no-underline')}
          >
            Next
          </Link>
        </div>
      )}
    </main>
  );
}
