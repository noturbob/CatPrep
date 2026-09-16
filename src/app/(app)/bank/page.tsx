import { NotBuilt } from '@/components/not-built';
export default function Page() {
  return <NotBuilt
    title="Question bank"
    blurb="Browse everything in the bank by topic, year, slot, difficulty and source. Not built yet."
    bullets={[
      '150 verified original questions are already seeded and reachable through daily practice',
      'This page adds browsing, filtering and launching a drill from any filter',
      'Real previous-year questions arrive through the ingest page',
    ]} />;
}
