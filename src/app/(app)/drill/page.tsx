import { getDrillTopics } from '@/lib/drill';
import { DrillPicker } from '@/components/drill-picker';

export const dynamic = 'force-dynamic';

export default async function DrillPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const topics = await getDrillTopics();

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
      <h1 className="text-[19px] font-normal text-fg">Drill</h1>
      <p className="mt-2 max-w-[58ch] text-[13px] leading-relaxed text-muted">
        Pick one topic and work it outside the daily plan — useful the moment the progress
        page shows something dragging your accuracy down.
      </p>

      {topics.length === 0 ? (
        <p className="mt-8 py-10 text-center text-[13px] text-faint">
          No questions in the bank yet. Run <code className="rounded bg-panel-2 px-1">pnpm seed:questions</code>{' '}
          or add some at <code className="rounded bg-panel-2 px-1">/admin/ingest</code>.
        </p>
      ) : (
        <div className="mt-7">
          <DrillPicker topics={topics} initialTopicSlug={topic} />
        </div>
      )}
    </main>
  );
}
