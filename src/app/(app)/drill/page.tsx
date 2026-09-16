import { NotBuilt } from '@/components/not-built';
export default function Page() {
  return <NotBuilt
    title="Topic drill"
    blurb="Pick any single topic and drill it at a chosen difficulty, outside the daily plan. Not built yet."
    bullets={[
      'Reuses the same player and calculator as daily practice',
      'Filter by topic, difficulty and unattempted-only',
      'Useful when the tracker shows one topic dragging your accuracy down',
    ]} />;
}
